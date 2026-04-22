# 📱 Frontend DeporteHN - React Native + Expo

App móvil para iOS y Android (+ Web) que muestra horarios de fútbol infantil.

## Setup Inicial

### 1. Instalar Expo CLI
```bash
npm install -g expo-cli
```

### 2. Instalar dependencias
```bash
cd frontend
npm install
```

### 3. Configurar API URL
Editar `app.json` y actualizar:
```json
"extra": {
  "apiUrl": "http://YOUR_BACKEND_URL/api"
}
```

### 4. Iniciar servidor de desarrollo
```bash
npm start
```

### 5. Ejecutar en dispositivo
```bash
# iOS (solo en Mac)
npm run ios

# Android
npm run android

# Web
npm run web
```

---

## 📂 Estructura

```
frontend/src/
├── screens/              # Pantallas principales
│   ├── CategoriesScreen.tsx
│   ├── CategoryDetailsScreen.tsx
│   ├── TeamDetailsScreen.tsx
│   ├── FavoritesScreen.tsx
│   └── SettingsScreen.tsx
│
├── navigation/           # Stack y Tab Navigation
│   └── BottomTabNavigator.tsx
│
├── components/          # Componentes reutilizables (pronto)
│
├── services/           # Comunicación con API
│   └── api.ts
│
├── stores/             # Estado global (Zustand)
│   └── appStore.ts
│
├── constants/          # Constantes
│   └── categories.ts
│
├── styles/            # Design System
│   └── theme.ts
│
├── types/             # TypeScript types
│   └── index.ts
│
└── App.tsx            # Punto de entrada
```

---

## 🎨 Design System

Todos los estilos centralizados en `src/styles/theme.ts`:
- **Colores:** Paleta minimalista light mode
- **Tipografía:** Escalas de font size
- **Espacios:** Sistema de spacing
- **Sombras:** Sutiles para mobile

---

## 🔌 Conexión con API

Servicios en `src/services/api.ts`:

```typescript
// Obtener categorías
const response = await categoriesService.getAll();

// Obtener equipos de una categoría
const teams = await teamsService.getByCategory(categoryId);

// Obtener partidos de un equipo
const matches = await matchesService.getByTeam(teamId);

// Agregar a favoritos
await usersService.addFavorite(teamId, userId);
```

---

## 🌍 Estado Global (Zustand)

```typescript
import { useAppStore } from '@/stores/appStore';

// En un componente
const { userId, favoriteTeams, addFavorite } = useAppStore();
```

Persiste automáticamente en AsyncStorage.

---

## 📱 Navegación

Bottom Tab Navigator con 3 tabs:
1. **Categorías** → Equipos → Partidos
2. **Favoritos** → Mis equipos favoritos
3. **Ajustes** → Preferencias

---

## 🚀 Deploy

### EAS Build (Recomendado)
```bash
# Conectar proyecto
eas init

# Compilar para iOS
eas build --platform ios

# Compilar para Android
eas build --platform android

# Compilar para web
npm run web
# Luego deploy a Vercel
```

### Alternativa: Expo Go
```bash
npm start
# Escanear QR con Expo Go en tu teléfono
```

---

## 🔧 Troubleshooting

**Error: "Can't find module"**
```bash
npm install
# O reinicia el servidor: Ctrl+C y npm start
```

**Las imágenes no cargan**
- Asegurate de que `app.json` tiene la estructura correcta
- Coloca imágenes en `assets/`

**API no conecta**
- Verifica que la URL en `app.json` es correcta
- Asegúrate que el backend está ejecutándose

---

## 📝 Próximos Pasos

- [ ] Componentes reutilizables (Card, Button, Badge)
- [ ] Pantalla de splash personalizada
- [ ] Notificaciones push con Firebase
- [ ] Autenticación de usuarios
- [ ] Caché offline con AsyncStorage
- [ ] Temas (dark mode)

---

**Frontend lista para conectarse con Backend** ✅
