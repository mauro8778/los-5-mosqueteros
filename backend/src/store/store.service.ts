import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';
import { MercadoPagoConfig, Preference } from 'mercadopago';

@Injectable()
export class StoreService {
  private readonly logger = new Logger(StoreService.name);
  private mpClient: MercadoPagoConfig | null = null;

  constructor(private prisma: PrismaService) {
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (token) {
      this.mpClient = new MercadoPagoConfig({ accessToken: token });
    }
  }

  async getProducts() {
    return this.prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createProduct(dto: CreateProductDto) {
    return this.prisma.product.create({ data: dto });
  }

  async createOrder(userId: string, dto: CreateOrderDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('La orden debe contener al menos un producto');
    }

    // Validación de stock y cálculo de total
    let total = 0;
    const itemsData: { productId: string; quantity: number; unitPrice: number; title: string }[] = [];

    for (const item of dto.items) {
      const prod = await this.prisma.product.findUnique({ where: { id: item.productId } });
      if (!prod || !prod.isActive) {
        throw new NotFoundException(`Producto ${item.productId} no disponible`);
      }
      if (prod.stock < item.quantity) {
        throw new BadRequestException(`Stock insuficiente para "${prod.title}" (Disponible: ${prod.stock})`);
      }

      total += prod.price * item.quantity;
      itemsData.push({
        productId: prod.id,
        quantity: item.quantity,
        unitPrice: prod.price,
        title: prod.title,
      });
    }

    // Creación transaccional de orden y descuento de inventario
    const order = await this.prisma.$transaction(async (tx) => {
      const createdOrder = await tx.order.create({
        data: {
          userId,
          totalAmount: total,
          shippingAddress: dto.shippingAddress,
          status: OrderStatus.PENDING,
          items: {
            create: itemsData.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
            })),
          },
        },
        include: { items: true },
      });

      for (const i of itemsData) {
        await tx.product.update({
          where: { id: i.productId },
          data: { stock: { decrement: i.quantity } },
        });
      }

      return createdOrder;
    });

    // Generación de preferencia Mercado Pago si está disponible
    let preferenceUrl: string | null = null;
    let preferenceId: string | null = null;

    if (this.mpClient) {
      try {
        const preference = new Preference(this.mpClient);
        const mpRes = await preference.create({
          body: {
            items: itemsData.map((i) => ({
              id: i.productId,
              title: i.title,
              quantity: i.quantity,
              unit_price: i.unitPrice,
            })),
            external_reference: order.id,
            back_urls: {
              success: 'https://los5mosqueteros.org/checkout/success',
              failure: 'https://los5mosqueteros.org/checkout/failure',
              pending: 'https://los5mosqueteros.org/checkout/pending',
            },
            auto_return: 'approved',
          },
        });

        preferenceId = mpRes.id || null;
        preferenceUrl = mpRes.init_point || null;

        await this.prisma.order.update({
          where: { id: order.id },
          data: { preferenceId },
        });
      } catch (err: any) {
        this.logger.warn(`Error al generar checkout de Mercado Pago: ${err.message}`);
      }
    }

    return {
      order,
      preferenceId,
      checkoutUrl: preferenceUrl,
      message: 'Orden creada exitosamente',
    };
  }

  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
