# 🎯 Plan de Desarrollo - DeporteHN

## Fases del Proyecto

### ✅ FASE 0: Estructura Base (COMPLETADA)
- [x] Crear estructura de carpetas
- [x] Design System minimalista
- [x] Tipos TypeScript globales
- [x] Schema Prisma de BD
- [x] Servicios de API
- [x] Configuración Express

---

## ✅ FASE 1: Backend API (COMPLETA)

✅ 4 Servicios (category, team, match, user)
✅ 4 Controladores (CRUD completo)
✅ 4 Rutas (/api/categories, /teams, /matches, /users)
✅ Seed con 180 equipos + 60 partidos
✅ Documentación completa

---

## 🔥 FASE 2: Frontend Mobile (PRÓXIMA)

### 1.1 Controladores
- [ ] `controllers/categories.controller.ts` - CRUD de categorías
- [ ] `controllers/teams.controller.ts` - CRUD de equipos
- [ ] `controllers/matches.controller.ts` - CRUD de partidos
- [ ] `controllers/users.controller.ts` - Gestión de favoritos

### 1.2 Rutas
- [ ] `routes/categories.ts` - GET /api/categories
- [ ] `routes/teams.ts` - GET /api/teams
- [ ] `routes/matches.ts` - GET /api/matches
- [ ] `routes/users.ts` - POST/DELETE favoritos

### 1.3 Servicios
- [ ] `services/category.service.ts`
- [ ] `services/team.service.ts`
- [ ] `services/match.service.ts`
- [ ] `services/user.service.ts`

### 1.4 Base de Datos
- [ ] Seed inicial (categorías, 30 equipos por categoría)
- [ ] Deploy en Railway
- [ ] Pruebas de conexión

**Tiempo estimado:** 2-3 horas
**Checkpoint:** API devuelve categorías, equipos y partidos

---

## 🎨 FASE 2: Frontend Principal

### 2.1 Estructura Next.js
- [ ] Layout raíz
- [ ] Navbar con navegación
- [ ] Footer

### 2.2 Páginas
- [ ] `/` - Home (lista de categorías)
- [ ] `/categoria/[id]` - Equipos de la categoría
- [ ] `/equipo/[id]` - Partidos del equipo
- [ ] `/resultados` - Historial de partidos

### 2.3 Componentes Reutilizables
- [ ] `Card` - Card genérica
- [ ] `Button` - Botón estándar
- [ ] `Badge` - Etiqueta de estado (scheduled, live, finished)
- [ ] `TeamCard` - Tarjeta de equipo
- [ ] `MatchCard` - Tarjeta de partido
- [ ] `CategorySelector` - Selector de categoría

### 2.4 Hooks
- [ ] `useCategories()` - Fetch categorías
- [ ] `useTeams(categoryId)` - Fetch equipos
- [ ] `useMatches(teamId)` - Fetch partidos
- [ ] `useFavorites()` - Gestionar favoritos

**Tiempo estimado:** 3-4 horas
**Checkpoint:** App navega y muestra partidos

---

## ⭐ FASE 3: Favoritos & Persistencia

### 3.1 Sistema de Favoritos Local
- [ ] Almacenar favoritos en localStorage
- [ ] UI para marcar/desmarcar favoritos
- [ ] Página `/mis-favoritos`

### 3.2 Sincronización con BD
- [ ] Endpoint POST `/api/users/favorites`
- [ ] Endpoint DELETE `/api/users/favorites/:teamId`
- [ ] Endpoint GET `/api/users/favorites`
- [ ] Cookie/Session para identificar usuario

### 3.3 Persistencia
- [ ] Guardar favoritos en BD
- [ ] Recuperar favoritos al abrir app

**Tiempo estimado:** 2 horas
**Checkpoint:** Favoritos persisten entre sesiones

---

## 🔔 FASE 4: Notificaciones Push

### 4.1 Firebase Setup
- [ ] Crear proyecto en Firebase
- [ ] Obtener credenciales
- [ ] Configurar FCM

### 4.2 Frontend
- [ ] Service Worker para notificaciones
- [ ] Solicitar permiso al usuario
- [ ] Registrar FCM token
- [ ] Mostrar notificaciones

### 4.3 Backend
- [ ] Endpoint para registrar FCM token
- [ ] Job scheduled para verificar partidos próximos
- [ ] Enviar notificación 10 min antes
- [ ] Enviar notificación cuando termina partido

**Tiempo estimado:** 2-3 horas
**Checkpoint:** Notificaciones llegan al usuario

---

## 🚀 FASE 5: Deploy

### 5.1 Backend (Railway)
- [ ] Crear proyecto en Railway
- [ ] Conectar repositorio Git
- [ ] Variables de entorno
- [ ] Ejecutar migraciones
- [ ] Verificar API

### 5.2 Frontend (Vercel)
- [ ] Crear proyecto en Vercel
- [ ] Conectar repositorio
- [ ] Variables de entorno
- [ ] Deploy automático

### 5.3 Dominio
- [ ] Conectar dominio custom (opcional)
- [ ] SSL/HTTPS

**Tiempo estimado:** 1 hora
**Checkpoint:** App en producción

---

## 📊 Admin Panel (FUTURO)

- [ ] Dashboard de admin
- [ ] Crear/editar partidos
- [ ] Carga de resultados
- [ ] Gestión de equipos

---

## 💰 Monetización (FUTURO)

- [ ] Plan premium (sin ads)
- [ ] Publicidad discreta
- [ ] Sistema de pagos

---

## 📝 Notas

- Cada fase debe tener tests
- Usar componentes reutilizables
- SOLID principles en todo
- Light mode optimizado
- Responsive mobile-first

**Duración estimada total MVP:** 10-14 horas
**Inicio:** 2026-04-21
