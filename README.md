# 🐾 Los 5 Mosqueteros — Fullstack Ecosystem for Pet Rescue, AI Adoption & Care

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-E0234E?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.x-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Google Gemini](https://img.shields.io/badge/Gemini_AI-2.0_Flash-8E75C4?style=flat-square&logo=google-gemini&logoColor=white)](https://ai.google.dev/)
[![Mercado Pago](https://img.shields.io/badge/Mercado_Pago-Checkout_Pro-009EE3?style=flat-square&logo=mercadopago&logoColor=white)](https://www.mercadopago.com.ar/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8-010101?style=flat-square&logo=socket.io&logoColor=white)](https://socket.io/)
[![Docker](https://img.shields.io/badge/Docker-Multi--stage-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)

**Los 5 Mosqueteros** es una plataforma fullstack empresarial orientada al rescate, protección y bienestar animal. Integra una aplicación web moderna (React + Vite + Tailwind) y un backend de alto rendimiento (NestJS + Prisma + PostgreSQL) con un **motor etológico de evaluación de compatibilidad de adopciones con Inteligencia Artificial (Google Gemini)**, tienda solidaria con checkout de Mercado Pago, turnos veterinarios y chat en tiempo real por WebSockets.

---

## 🏛️ Arquitectura del Sistema

```mermaid
flowchart TD
    subgraph Clients["💻 Frontend SPA (React 18 + Vite + Tailwind CSS)"]
        UI_Adoptions["🐶 Portal de Adopción & Filtros"]
        UI_AIModal["🤖 Evaluador Interactivo con IA (0-100% Match)"]
        UI_Store["🛒 Tienda Solidaria & Carrito"]
        UI_Donations["❤️ Crowdfunding Médico"]
        UI_Chat["💬 Chat en Tiempo Real"]
    end

    subgraph BackendAPI["🚀 Backend Core API (NestJS + TypeScript)"]
        AuthMod["Módulo Auth & Roles (RBAC)"]
        PetsMod["Módulo Mascotas & Rescate"]
        AdoptionsMod["Módulo Adopciones"]
        AiEngine["🤖 Motor Gemini AI (Scoring & Reporte Etológico)"]
        StoreMod["Módulo Tienda & Mercado Pago"]
        AppointMod["Módulo Turnos Veterinarios"]
        ChatGateway["⚡ Socket.IO Gateway"]
    end

    subgraph DataStore["💾 Infraestructura & Persistencia"]
        PrismaORM["Prisma ORM"]
        Postgres[(PostgreSQL 16)]
        RedisCache[("⚡ Redis 7")]
        MP["💳 Mercado Pago Checkout Pro"]
    end

    Clients -->|HTTP REST & JWT| BackendAPI
    Clients <-->|WebSockets Bidireccional| ChatGateway
    AdoptionsMod --> AiEngine
    StoreMod --> MP
    BackendAPI --> PrismaORM --> Postgres
    ChatGateway <--> RedisCache
```

---

## 🌟 Funcionalidades Fullstack

### 1. 🤖 Evaluación de Compatibilidad de Adopción con IA
- El adoptante responde un cuestionario sobre su tipo de vivienda, disponibilidad horaria, niños y otros animales.
- El backend procesa el perfil con **Google Gemini 2.0 Flash**, calculando un porcentaje de compatibilidad y un análisis etológico detallado que se visualiza en la interfaz.

### 2. 🐶 Fichas Interactivas de Mascotas
- Catálogo de rescates con las 5 mascotas emblemáticas (*D’Artagnan, Athos, Porthos, Aramis y Milady*).
- Filtros rápidos por especie (perros / gatos), badges de vacunación, castración y nivel de actividad.

### 3. 🛒 Tienda Solidaria Transaccional
- Catálogo de insumos con carrito flotante, control de inventario y botón directo para **Mercado Pago Checkout Pro**.

### 4. ❤️ Crowdfunding para Cirugías
- Campañas de recaudación médica con barras de progreso en tiempo real y donaciones instantáneas.

### 5. 🩺 Turnos Veterinarios & Chat en Vivo
- Formulario de reserva de castraciones y consultas.
- Widget flotante de chat bidireccional por WebSockets con voluntarios del refugio.

---

## 🚀 Estructura del Monorepo

```
los-5-mosqueteros/
├── backend/                  # API REST & WebSockets (NestJS + TypeScript)
│   ├── src/
│   │   ├── adoptions/        # Solicitudes de adopción
│   │   ├── ai-match/         # Integración con Google Gemini AI
│   │   ├── appointments/     # Turnos veterinarios
│   │   ├── auth/             # JWT, Bcrypt, Guards & Roles
│   │   ├── chat/             # Gateway Socket.io
│   │   ├── donations/        # Campañas solidarias
│   │   ├── pets/             # Fichas de animales rescatados
│   │   ├── prisma/           # Servicio y cliente de base de datos
│   │   └── store/            # Carrito y órdenes
│   ├── prisma/               # Esquema relacional PostgreSQL
│   └── Dockerfile            # Construcción multi-stage
│
├── frontend/                 # Aplicación Web SPA (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/       # UI (Navbar, Hero, PetList, AiMatchModal, Store, etc.)
│   │   ├── services/         # Clientes Axios y conexión Socket.io
│   │   └── types/            # Interfaces TypeScript
│   └── vite.config.ts
│
├── docker-compose.yml        # Orquestación (Postgres + Redis + Backend)
└── package.json              # Scripts para ejecutar ambos servicios
```

---

## 🛠️ Instalación y Uso Rápido

### Desarrollo Local (Recomendado)

#### 1. Iniciar Backend
```bash
cd backend
npm install
cp .env.example .env
npm run start:dev
```
Backend disponible en `http://localhost:3000` (Swagger en `http://localhost:3000/docs`).

#### 2. Iniciar Frontend
En una nueva terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend disponible en `http://localhost:5173`.

---

### Despliegue con Docker Compose

```bash
docker compose up --build -d
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
