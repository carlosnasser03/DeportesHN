# 📊 Dashboard Analytics - DeportesHN

## ¿Qué es?

Dashboard protegido con JWT que muestra **estadísticas de comentarios** en tiempo real:
- Total de comentarios
- Comentarios aprobados vs rechazados
- Gráfico de comentarios por categoría
- Tasas de aprobación/rechazo

## 🚀 Cómo acceder

1. **Asegúrate que el backend está corriendo:**
   ```bash
   cd backend
   npm run dev
   ```

2. **En otra terminal, inicia el frontend:**
   ```bash
   cd web
   npm run dev
   ```

3. **Accede al dashboard:**
   ```
   http://localhost:3001/dashboard
   ```

## 🔐 Autenticación

El dashboard requiere **dos variables de entorno** en `web/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_ADMIN_KEY=admin_key_super_secreta_2026
```

### ¿Cómo funciona?

1. Al entrar a `/dashboard`, el frontend intenta obtener un **JWT token**
2. Envía `NEXT_PUBLIC_ADMIN_KEY` a `POST /api/auth/token`
3. Si es válido, recibe un token JWT válido por **24 horas**
4. El token se guarda en `sessionStorage` (se borra al cerrar la pestaña)
5. Con el token, obtiene estadísticas de `GET /api/comments/stats`

## 📈 Estructura del Dashboard

```
/dashboard
├─ Header con timestamp
├─ Tarjetas de métricas
│  ├─ Total de comentarios (azul)
│  ├─ Comentarios aprobados (verde)
│  └─ Comentarios rechazados (rojo)
├─ Gráfico de barras por categoría
└─ Resumen con tasas (%)
```

## 🛠️ Archivos creados

```
web/app/
├─ dashboard/
│  └─ page.tsx ⭐ (Página principal)
├─ components/dashboard/
│  ├─ StatsCard.tsx (Tarjeta de métrica)
│  ├─ CategoryChart.tsx (Gráfico por categoría)
│  └─ DashboardHeader.tsx (Encabezado)
└─ hooks/
   ├─ useAuth.ts (JWT authentication)
   └─ useDashboardStats.ts (Obtener datos)
```

## 🔧 Backend (actualizado)

El endpoint `/api/comments/stats` ahora retorna:

```json
{
  "success": true,
  "data": {
    "totalComments": 45,
    "approvedComments": 40,
    "rejectedComments": 5,
    "statsByCategory": [
      {
        "categoryId": "uuid-1",
        "categoryName": "Sub-11",
        "count": 15
      },
      {
        "categoryId": "uuid-2",
        "categoryName": "Sub-13",
        "count": 12
      }
    ]
  }
}
```

## 🧪 Probando el Dashboard

1. **Crear algunos comentarios primero:**
   - Ir a `http://localhost:3001` (home)
   - Ingresar en una categoría
   - Crear varios comentarios

2. **Ver estadísticas:**
   - Ir a `http://localhost:3001/dashboard`
   - Las métricas se cargan automáticamente
   - El gráfico se actualiza en tiempo real

## 🚨 Si hay errores:

| Error | Causa | Solución |
|-------|-------|----------|
| "Acceso Denegado" | ADMIN_KEY inválida | Revisar `.env.local` |
| "Error al Cargar" | Backend no está corriendo | Iniciar `npm run dev` en backend |
| Métricas vacías | Sin comentarios en BD | Crear comentarios en home primero |

## 📱 Próximos pasos

- [ ] Exportar reportes (PDF/Excel)
- [ ] Filtrar por rango de fechas
- [ ] Integrar con Google Analytics
- [ ] Notificaciones en tiempo real
