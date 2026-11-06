# 🐾 Los 5 Mosqueteros — Enterprise Pet Rescue, AI Adoption & Care Ecosystem

[![NestJS](https://img.shields.io/badge/NestJS-10.x-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.x-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Redis](https://img.shields.io/badge/Redis-7.x-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![Google Gemini](https://img.shields.io/badge/Gemini_AI-2.0_Flash-8E75C4?style=flat-square&logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![Mercado Pago](https://img.shields.io/badge/Mercado_Pago-Checkout_Pro-009EE3?style=flat-square&logo=mercadopago&logoColor=white)](https://www.mercadopago.com.ar/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI_3.0-85EA2D?style=flat-square&logo=swagger&logoColor=black)](http://localhost:3000/docs)
[![Docker](https://img.shields.io/badge/Docker-Multi--stage-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

**Los 5 Mosqueteros** es una plataforma backend de alto rendimiento orientada a la protección y rescate animal, que fusiona un **motor inteligente de evaluación de compatibilidad de adopciones con IA (Google Gemini)**, gestión de turnos veterinarios, canal de chat en tiempo real por WebSockets y una **tienda solidaria con checkout de Mercado Pago** para el financiamiento de cirugías y refugios.

---

## 🏛️ Arquitectura del Sistema

```mermaid
flowchart TD
    subgraph Clients["📱 Clientes (Web SPA / Mobile App)"]
        Adopters["👨‍👩‍👧 Adoptantes & Donantes"]
        Volunteers["🤝 Voluntarios del Refugio"]
        Vets["🩺 Médicos Veterinarios"]
    end

    subgraph Gateway["🚪 Reverse Proxy & Security"]
        NGINX["⚖️ Nginx / Cloudflare"]
        Guards["🛡️ NestJS Guards (JWT + Roles RBAC)"]
    end

    subgraph CoreBackend["🚀 Los 5 Mosqueteros Core API (NestJS)"]
        AuthMod["Módulo Auth (JWT & Bcrypt)"]
        PetsMod["Módulo Mascotas & Geolocalización"]
        AdoptionsMod["Módulo Adopciones & Scoring"]
        AiEngine["🤖 Motor IA Gemini (Evaluación de Compatibilidad)"]
        StoreMod["Módulo Tienda Solidaria"]
        AppointMod["Módulo Turnos Veterinarios"]
        ChatGateway["⚡ Socket.IO Chat Gateway"]
    end

    subgraph DataPersistence["💾 Almacenamiento & Servicios Externos"]
        PrismaORM["Prisma ORM"]
        Postgres[(PostgreSQL 16 Relacional)]
        RedisCache[("⚡ Redis (Caché & Sockets Adapter)")]
        MP["💳 Mercado Pago API"]
        Cloudinary["☁️ Cloudinary Media"]
    end

    Clients --> Gateway
    Gateway --> Guards --> CoreBackend
    AdoptionsMod --> AiEngine
    StoreMod --> MP
    PetsMod --> Cloudinary
    CoreBackend --> PrismaORM --> Postgres
    ChatGateway <--> RedisCache
```

---

## 🐶 Los 5 Módulos Principales

### 1. 🤖 Motor de Compatibilidad de Adopción con IA (Gemini 2.0)
- Evalúa el estilo de vida del adoptante (tipo de hogar, patio, horas en soledad, otros animales y niños) cruzándolo con el perfil bioconductual de la mascota (energía, tamaño, traumas y necesidades).
- Genera un **Scoring de Compatibilidad (0 a 100)** y un informe etológico descriptivo para que el refugio tome decisiones informadas y reduzca las tasas de devolución.

```mermaid
sequenceDiagram
    autonumber
    actor A as Adoptante
    participant API as Backend NestJS
    participant AI as Gemini 2.0 Flash
    participant DB as PostgreSQL
    actor V as Voluntario Refugio

    A->>API: POST /adoptions/:petId/apply (Cuestionario)
    API->>AI: Prompt con perfil de mascota + respuestas del adoptante
    AI-->>API: Score (0-100) + Análisis etológico detallado
    API->>DB: Guarda Solicitud (Estado: SUBMITTED + Scoring)
    API-->>A: Confirmación de postulación recibida
    V->>API: GET /adoptions/all
    API-->>V: Lista clasificada por mayor compatibilidad
```

### 2. 📍 Rescate & Localización de Mascotas
- Publicación de animales en adopción o extraviados con fotos múltiples y georreferenciación (latitud/longitud).
- Filtros avanzados por especie (perros, gatos, otros), tamaño, nivel de energía y estado.

### 3. 🛒 Tienda Solidaria & Checkout Transaccional
- Catálogo de insumos para mascotas donde el 100% de los beneficios financia rescates.
- Manejo transaccional estricto con control y reserva de stock (`$transaction`).
- Generación de preferencias de pago con **Mercado Pago Checkout Pro**.

### 4. 🩺 Turnos Veterinarios & Campañas de Castración
- Gestión de citas para vacunación, cirugías y desparasitación con historial médico.
- Campañas de donación colectiva (Crowdfunding médico) con barra de progreso en vivo.

### 5. 💬 Chat en Tiempo Real (Socket.io)
- Canal de mensajería instantánea bidireccional entre postulantes a adopción y los cuidadores del refugio.

---

## 🗄️ Modelo Entidad-Relación

```mermaid
erDiagram
    User ||--o{ AdoptionApplication : submits
    User ||--o{ Order : places
    User ||--o{ VetAppointment : books
    User ||--o{ ChatMessage : sends
    
    Pet ||--o{ AdoptionApplication : receives
    Pet ||--o{ VetAppointment : attends
    
    Order ||--|{ OrderItem : contains
    Product ||--o{ OrderItem : references
    
    DonationCampaign {
        string id
        string title
        float targetAmount
        float raisedAmount
        boolean isActive
    }
```

---

## 🛠️ Instalación y Puesta en Marcha

### Con Docker Compose (Recomendado)

```bash
# 1. Clonar el repositorio
git clone https://github.com/mauro8778/los-5-mosqueteros.git
cd los-5-mosqueteros

# 2. Levantar la infraestructura completa (PostgreSQL + Redis + API)
docker compose up --build -d
```
* **API REST:** `http://localhost:3000`
* **Swagger OpenAPI:** `http://localhost:3000/docs`

---

### Desarrollo Local

#### Requisitos
- **Node.js:** >= 20.x
- **PostgreSQL:** >= 15.x
- **Redis:** >= 6.x

```bash
# 1. Instalar dependencias
npm install

# 2. Variables de entorno
cp .env.example .env

# 3. Aplicar modelo a la base de datos
npx prisma db push

# 4. Iniciar en modo desarrollo con Hot-Reload
npm run start:dev
```

---

## 📡 Endpoints Destacados de la API

| Módulo | Método | Endpoint | Descripción |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/auth/register` | Registro de adoptantes |
| **Auth** | `POST` | `/auth/login` | Login y emisión de JWT |
| **Mascotas** | `GET` | `/pets` | Búsqueda filtrada de mascotas |
| **Mascotas** | `POST` | `/pets` | Publicar nuevo rescate (Admin/Voluntario) |
| **Adopciones** | `POST` | `/adoptions/:petId/apply` | Postulación con scoring IA en vivo |
| **Adopciones** | `GET` | `/adoptions/all` | Auditoría de solicitudes con IA |
| **Tienda** | `GET` | `/store/products` | Catálogo de productos solidarios |
| **Tienda** | `POST` | `/store/orders` | Checkout con Mercado Pago |
| **Donaciones** | `GET` | `/donations/campaigns` | Campañas de recaudación activas |
| **Veterinaria** | `POST` | `/appointments` | Reserva de turno clínico |

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
