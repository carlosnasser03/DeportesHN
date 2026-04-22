# 🏆 DeporteHN - App de Horarios de Fútbol Infantil

Aplicación moderna y minimalista para que padres vean cuándo, dónde y cómo quedaron los partidos de sus hijos en categorías de fútbol infantil (U7-U17).

## 📋 Stack Tecnológico

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL (en Railway)
- **Hosting:** Vercel (Frontend) + Railway (Backend)
- **Notificaciones:** Firebase Cloud Messaging (FCM)

## 📁 Estructura del Proyecto

```
DeporteHN/
├── frontend/                  # Aplicación Next.js
│   ├── src/
│   │   ├── app/              # Rutas principales (App Router)
│   │   ├── components/       # Componentes reutilizables
│   │   ├── hooks/            # Custom hooks
│   │   ├── styles/           # Design system
│   │   ├── utils/            # Utilidades y helpers
│   │   ├── types/            # Tipos TypeScript globales
│   │   ├── services/         # Comunicación con API
│   │   └── constants/        # Constantes (categorías, etc)
│   └── package.json
│
├── backend/                   # API Express
│   ├── src/
│   │   ├── routes/           # Endpoints de la API
│   │   ├── controllers/      # Lógica de controladores
│   │   ├── models/           # Schemas de Prisma
│   │   ├── middleware/       # Middleware (auth, validation)
│   │   ├── services/         # Lógica de negocio
│   │   ├── config/           # Configuración general
│   │   └── utils/            # Utilidades
│   ├── prisma/
│   │   └── schema.prisma     # Schema de BD
│   ├── .env.example          # Variables de entorno
│   └── package.json
│
└── docs/                      # Documentación
```

## 🎨 Design System

Todos los valores están **centralizados en variables independientes** en `frontend/src/styles/designSystem.ts`:

- **Colores:** Paleta light mode minimalista
- **Tipografía:** Sistema de escalas de fuente
- **Espacios:** Escala de espaciado SOLID
- **Bordes:** Border radius consistente
- **Sombras:** Sutiles para light mode

## 📦 Variables Independientes

### Categorías (`frontend/src/constants/categories.ts`)
Cada categoría (U7-U17) tiene:
- ID único
- Nombre y etiqueta
- Máximo de equipos (30)
- Color distintivo
- Rango de edad

### Tipos TypeScript (`frontend/src/types/index.ts`)
Entidades principales:
- `Team` - Equipo de fútbol
- `Match` - Partido
- `User` - Usuario con favoritos
- `Category` - Categoría de edad

## 🗄️ Base de Datos

Schema definido en `backend/prisma/schema.prisma`:

- **Category:** Categorías de fútbol (U7-U17)
- **Team:** Equipos (30 por categoría)
- **Match:** Partidos con resultados
- **User:** Usuarios con favoritos y preferencias

## 🔧 Configuración

### Backend

1. Copia `.env.example` a `.env`
2. Configura variables de entorno (DATABASE_URL, FIREBASE, etc)
3. Ejecuta migraciones: `npm run migrate`
4. Inicia servidor: `npm run dev`

### Frontend

1. Instala dependencias: `npm install`
2. Configura API URL en `.env.local`
3. Inicia dev server: `npm run dev`

## 🚀 Características MVP

- [ ] Ver categorías y equipos
- [ ] Ver partidos por equipo
- [ ] Favoritar equipos (persistencia local)
- [ ] Notificaciones push (inicio y resultado)
- [ ] Design minimalista light mode
- [ ] Responsive mobile-first

## 🛣️ Roadmap

### Phase 1: MVP
- Estructura base
- API REST básica
- Frontend catálogo de partidos

### Phase 2: Favoritos & Notificaciones
- Sistema de favoritos con DB
- Notificaciones push con FCM
- Historial de resultados

### Phase 3: Admin Panel
- Dashboard de admin
- Carga de partidos y resultados
- Gestión de equipos y categorías

### Phase 4: Monetización
- Plan premium (sin ads, más features)
- Publicidad sutil

## 📝 Notas de Desarrollo

- **SOLID Principles:** Estructura modular, componentes reutilizables
- **Type Safety:** 100% TypeScript
- **Performance:** Light mode, sin librerías pesadas
- **Escalabilidad:** Variables independientes, fácil de modificar

---

**Proyecto:** DeporteHN v0.1.0
**Creado:** 2026-04-21
