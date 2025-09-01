# Sistema de Gestión de Costos Indirectos

## 🏗️ Arquitectura del Sistema

### Backend

-  **GraphQL Server** con Apollo Server
-  **Base de datos** SQLite con Prisma ORM
-  **Arquitectura modular** siguiendo patrones de NestJS
-  **TypeScript** para tipado fuerte

### Frontend

-  **React 18** con TypeScript
-  **Vite** para desarrollo y build optimizado
-  **Apollo Client** para GraphQL
-  **shadcn/ui** para componentes de UI
-  **Tailwind CSS** para estilos
-  **GraphQL Code Generator** para tipado automático

## ⚡ Instalación Rápida

Para configurar y ejecutar el proyecto rápidamente:

```bash
# 1. Clonar el repositorio
git clone https://github.com/JuanDa14/indirect-costs
cd indirect-costs

# 2. Configuración automática (recomendado)
npm run setup

# 3. Iniciar en modo desarrollo
npm run dev
```

El comando `npm run setup` automáticamente:

-  ✅ Instala todas las dependencias
-  ✅ Configura archivos de entorno
-  ✅ Inicializa la base de datos
-  ✅ Genera tipos GraphQL
-  ✅ Prepara el proyecto para desarrollo

## 📋 Prerrequisitos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

-  **Node.js** (versión 18 o superior)
-  **npm** (incluido con Node.js)
-  **Git** para clonar el repositorio

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/JuanDa14/indirect-costs
cd indirect-costs
```

### 2. Configurar el Backend

```bash
# Navegar al directorio del backend
cd backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Configurar la base de datos con Prisma
npx prisma generate
npx prisma db push

# (Opcional) Ejecutar datos de prueba
npm run seed
```

### 3. Configurar el Frontend

```bash
# Navegar al directorio del frontend
cd ../frontend

# Instalar dependencias
npm install

# Generar tipos de GraphQL
npm run codegen
```

## 🏃‍♂️ Ejecutar en Desarrollo

### Opción 1: Ejecutar todo automáticamente (Recomendado)

```bash
# Desde el directorio raíz
npm run dev
```

Este comando iniciará automáticamente:

-  Backend en `http://localhost:4000`
-  Frontend en `http://localhost:5173`
-  GraphQL CodeGen en modo watch
-  Hot reload en ambos servicios

### Opción 2: Ejecutar servicios por separado

#### Iniciar Backend

```bash
cd backend
npm run dev
```

El servidor GraphQL estará disponible en `http://localhost:4000`

#### Iniciar Frontend

```bash
cd frontend
npm run dev:full
```

La aplicación web estará disponible en `http://localhost:5173`

## 📦 Scripts Disponibles

### Backend (`/backend`)

```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Compilar para producción
npm run start        # Ejecutar versión compilada
npm run seed         # Ejecutar datos de prueba
npm run db:reset     # Resetear base de datos
npm run db:studio    # Abrir Prisma Studio
```

### Frontend (`/frontend`)

```bash
npm run dev          # Desarrollo básico
npm run dev:full     # Desarrollo con CodeGen en watch
npm run build        # Compilar para producción
npm run preview      # Previsualizar build de producción
npm run codegen      # Generar tipos GraphQL
npm run codegen:watch # Generar tipos en modo watch
npm run lint         # Ejecutar ESLint
```

## 🗄️ Base de Datos

El proyecto usa **SQLite** con **Prisma** como ORM:

-  **Base de datos**: `backend/prisma/dev.db`
-  **Schema**: `backend/prisma/schema.prisma`
-  **Migraciones**: `backend/prisma/migrations/`

### Comandos útiles de Prisma:

```bash
cd backend

# Ver y editar datos en interfaz visual
npx prisma studio

# Resetear base de datos
npx prisma db push --force-reset

# Generar cliente Prisma después de cambios
npx prisma generate
```

## 🎯 Funcionalidades Principales

### ✅ Gestión de Plantas

-  Crear plantas con código automático
-  Editar información de plantas
-  Eliminar plantas con confirmación
-  Validación de códigos únicos

### ✅ Gestión de Operaciones

-  Crear operaciones por planta
-  Matriz de costos por volumen
-  Edición inline de costos
-  Eliminación con confirmación

### ✅ Matriz de Costos

-  Vista matricial: Operaciones × Volúmenes
-  Formato inteligente (kg/T)
-  Edición por operación
-  Cálculos automáticos

### ✅ Interfaz de Usuario

-  Diseño moderno con shadcn/ui
-  Responsive para móviles y desktop
-  Formularios con validación
-  Confirmaciones para acciones destructivas

## 🛠️ Desarrollo

### Estructura del Proyecto

```
indirect-costs/
├── backend/
│   ├── src/
│   │   ├── modules/        # Módulos de NestJS
│   │   ├── models/         # Modelos de datos
│   │   ├── resolvers/      # Resolvers GraphQL
│   │   └── schema.ts       # Schema GraphQL
│   ├── prisma/
│   │   ├── schema.prisma   # Esquema de base de datos
│   │   └── migrations/     # Migraciones
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilidades y constantes
│   │   ├── graphql/        # Tipos generados
│   │   └── types/          # Tipos TypeScript
│   └── package.json
└── README.md
```

### Convenciones de Código

-  **TypeScript strict mode** habilitado
-  **ESLint** para linting
-  **Prettier** para formato (recomendado)
-  **Conventional Commits** para mensajes de commit

### GraphQL Code Generation

El frontend usa CodeGen para generar tipos automáticamente:

```bash
# Generar tipos una vez
npm run codegen

# Modo watch (se regenera al cambiar schema)
npm run codegen:watch
```

Los tipos se generan en `src/graphql/graphql.types.ts`

## 🔧 Configuración de Entorno

### Variables de Entorno (Backend)

Crear archivo `.env` en `/backend`:

```env
# Base de datos
DATABASE_URL="file:./dev.db"

# Puerto del servidor
PORT=4000

# Entorno
NODE_ENV=development
```

### Configuración de Apollo Client (Frontend)

El cliente está configurado para conectar a `http://localhost:4000/`

## 📝 Notas de Desarrollo

### Hot Reload

-  **Backend**: Usa `tsx` con watch mode
-  **Frontend**: Vite HMR habilitado
-  **GraphQL Types**: CodeGen en modo watch

### Depuración

-  **Backend**: GraphQL Playground en `http://localhost:4000/`
-  **Base de datos**: Prisma Studio `npx prisma studio`
-  **Frontend**: React DevTools recomendado

### Testing

```bash
# Backend (cuando se implemente)
cd backend
npm run test

# Frontend (cuando se implemente)
cd frontend
npm run test
```

## 🚀 Despliegue

### Build de Producción

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Variables de Entorno de Producción

Configurar variables según el entorno de despliegue.

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Solución de Problemas

### Puerto en uso

Si el puerto 4000 está ocupado:

```bash
# Encontrar proceso
netstat -ano | findstr :4000

# Terminar proceso (Windows)
taskkill /PID <PID> /F
```

### Problemas de GraphQL

1. Verificar que el backend esté corriendo
2. Regenerar tipos: `npm run codegen`
3. Revisar Network tab en DevTools

### Problemas de Base de Datos

```bash
cd backend
npx prisma db push --force-reset
npx prisma generate
npm run seed
```

---
