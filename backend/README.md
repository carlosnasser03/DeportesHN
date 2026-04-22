# 🔧 Backend DeporteHN - API Express

API REST para la aplicación de horarios de fútbol infantil.

## Setup Inicial

### 1. Instalar dependencias
```bash
cd backend
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tu DATABASE_URL
```

### 3. Crear base de datos
```bash
npm run db:push
```

### 4. Cargar datos de prueba
```bash
npm run seed
```

### 5. Iniciar servidor
```bash
npm run dev
```

El servidor estará en `http://localhost:3000`

---

## 📚 Endpoints API

### Categorías
```bash
GET    /api/categories           # Todas las categorías
GET    /api/categories/:id       # Categoría específica
POST   /api/categories           # Crear categoría
PUT    /api/categories/:id       # Actualizar categoría
DELETE /api/categories/:id       # Eliminar categoría
```

### Equipos
```bash
GET    /api/teams                          # Todos los equipos
GET    /api/teams?categoryId=ID            # Equipos de una categoría
GET    /api/teams/:id                      # Equipo específico
POST   /api/teams                          # Crear equipo
PUT    /api/teams/:id                      # Actualizar equipo
DELETE /api/teams/:id                      # Eliminar equipo
```

### Partidos
```bash
GET    /api/matches                        # Todos los partidos
GET    /api/matches?teamId=ID              # Partidos de un equipo
GET    /api/matches?categoryId=ID          # Partidos de una categoría
GET    /api/matches?upcoming=true          # Próximos partidos
GET    /api/matches/:id                    # Partido específico
POST   /api/matches                        # Crear partido
PUT    /api/matches/:id                    # Actualizar partido
POST   /api/matches/:id/finish             # Finalizar con resultado
DELETE /api/matches/:id                    # Eliminar partido
```

### Usuarios & Favoritos
```bash
GET    /api/users/favorites                    # Obtener favoritos
POST   /api/users/favorites                    # Agregar a favoritos
DELETE /api/users/favorites/:teamId            # Quitar de favoritos
POST   /api/users/fcm-token                    # Registrar token push
PUT    /api/users/preferences                  # Actualizar preferencias
```

---

## 🧪 Ejemplos de Requests

### Obtener categorías
```bash
curl http://localhost:3000/api/categories
```

### Obtener equipos de una categoría
```bash
curl "http://localhost:3000/api/teams?categoryId=CATEGORY_ID"
```

### Crear partido
```bash
curl -X POST http://localhost:3000/api/matches \
  -H "Content-Type: application/json" \
  -d '{
    "categoryId": "CATEGORY_ID",
    "homeTeamId": "TEAM_ID_1",
    "awayTeamId": "TEAM_ID_2",
    "date": "2026-04-30T19:00:00Z",
    "location": "Estadio Nacional"
  }'
```

### Agregar equipo a favoritos
```bash
curl -X POST http://localhost:3000/api/users/favorites \
  -H "Content-Type: application/json" \
  -H "X-User-ID: user123" \
  -d '{ "teamId": "TEAM_ID" }'
```

### Finalizar partido con resultado
```bash
curl -X POST http://localhost:3000/api/matches/:id/finish \
  -H "Content-Type: application/json" \
  -d '{ "homeScore": 2, "awayScore": 1 }'
```

---

## 🗄️ Base de Datos

Schema: `backend/prisma/schema.prisma`

### Entidades:
- **Category** - Categorías de fútbol (U7-U17)
- **Team** - Equipos (30 por categoría)
- **Match** - Partidos con resultados
- **User** - Usuarios con favoritos

---

## 📝 Estructura de Carpetas

```
backend/src/
├── controllers/      # Manejo de requests HTTP
├── services/         # Lógica de negocio
├── routes/          # Definición de endpoints
├── config/          # Configuración
└── index.ts         # Punto de entrada
```

---

## 🔄 Workflow Típico

1. **Request llega** a Express
2. **Router** lo dirige al **Controller**
3. **Controller** valida y llama al **Service**
4. **Service** ejecuta lógica y llama **Prisma**
5. **Prisma** ejecuta query en BD
6. **Service** retorna datos
7. **Controller** formatea response
8. **Express** envía JSON al cliente

---

## ⚠️ Notas Importantes

- User ID se extrae del header `X-User-ID` o query param `userId`
- Por defecto es `anonymous` si no se proporciona
- En producción, implementar autenticación JWT
- Las migraciones se versionan automáticamente

---

## 🚀 Deploy a Railway

1. Crear proyecto en Railway
2. Conectar repositorio Git
3. Agregar variable de entorno `DATABASE_URL` (Postgres)
4. Deploy automático

---

**Backend lista para conectarse con Frontend** ✅
