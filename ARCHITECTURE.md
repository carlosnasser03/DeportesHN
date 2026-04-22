# 🏗️ Arquitectura de DeporteHN

## Principios SOLID Aplicados

### S - Single Responsibility Principle
- Cada componente/servicio tiene UNA responsabilidad
- `teamsService` solo maneja equipos
- `MatchCard` solo renderiza un partido

### O - Open/Closed Principle
- Componentes abiertos para extensión (props)
- Cerrados para modificación
- Design system reutilizable

### L - Liskov Substitution Principle
- Interfaces consistentes
- Tipos TypeScript aseguran compatibilidad

### I - Interface Segregation Principle
- Tipos específicos, no genéricos
- `Match`, `Team`, `Category` separados

### D - Dependency Inversion Principle
- Servicios inyectables
- Abstracción sobre detalles

---

## Flujo de Datos

```
User (Browser)
     ↓
Frontend (Next.js)
├── Pages (Rutas)
├── Components (UI)
├── Hooks (Lógica)
└── Services (API calls)
     ↓
Backend (Express)
├── Routes (Endpoints)
├── Controllers (Manejo)
├── Services (Negocio)
└── Prisma (BD)
     ↓
PostgreSQL (Railway)
```

---

## Variables Independientes

### Design System
- Colores centralizados en `designSystem.ts`
- Espacios (padding, margin, gap)
- Tipografía (tamaños, pesos)
- Bordes y sombras

**Cambiar todos los azules:**
1. Editar `COLORS.primary` en `designSystem.ts`
2. Se actualizan automáticamente en toda la app

### Categorías
- Definidas en `constants/categories.ts`
- Cada una con color, rango de edad, máximo equipos
- Fácil agregar nuevas categorías

### API
- Base URL en `.env`
- Todos los servicios usan `apiClient`
- Cambiar API = cambiar 1 variable

---

## Seguridad

### Frontend
- CORS habilitado desde backend
- Validación de tipos con TypeScript
- XSS prevención con React

### Backend
- Validación en rutas
- Rate limiting (futuro)
- JWT para auth (futuro)
- SQL injection prevenida con Prisma

### BD
- PostgreSQL con credenciales en .env
- Migraciones versionadas
- Backups automáticos (Railway)

---

## Performance

### Light Mode
- Colores claros = menos energía en OLED
- Sin animaciones pesadas
- Imágenes optimizadas

### Code Splitting
- Next.js route-based splitting
- Lazy loading de componentes

### Caché
- Favoritos en localStorage
- SWR/React Query (futuro)

---

## Escalabilidad

### BD
- Índices en campos consultados frecuentemente
- Queries optimizadas con Prisma
- Particionamiento si crece mucho (futuro)

### Backend
- Stateless (escalable horizontalmente)
- Services separados de routes
- Middleware reutilizable

### Frontend
- Componentes reutilizables
- Hooks customizados
- State management centralized (Zustand listo)

---

## Testing

```
Frontend:
├── Unit tests (Componentes)
├── Integration tests (Hooks)
└── E2E tests (Flujos completos)

Backend:
├── Unit tests (Services)
├── Integration tests (Endpoints)
└── DB tests (Migraciones)
```

---

## CI/CD

```
Git Push
  ↓
GitHub Actions (futuro)
  ├─ Lint + Type check
  ├─ Tests
  └─ Deploy si pasan
     ├─ Railway (Backend)
     └─ Vercel (Frontend)
```

---

## Monitoreo

Backend:
- Logs en consola (Winston futuro)
- Health check en `/api/health`
- Errores centrados en backend

Frontend:
- Console errors
- Sentry (futuro)

---

## Documentación

- `README.md` - Overview
- `PLAN.md` - Roadmap detallado
- `ARCHITECTURE.md` - Esto (cómo funciona)
- Comentarios en código donde es complejo
- JSDoc en funciones públicas

---

**Arquitectura diseñada para ser:**
- Mantenible
- Escalable
- Segura
- Performance-first
