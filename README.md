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
cd frontend

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

### Variables de Entorno (Frontend)

Crear archivo `.env` en `/frontend`:

```env
# Conexión
PUBLIC_API_URL= "http://localhost:4000"
```

## 📝 Notas de Desarrollo

### Hot Reload

-  **Backend**: Usa `tsx` con watch mode
-  **Frontend**: Vite HMR habilitado

### Depuración

-  **Backend**: GraphQL Playground en `http://localhost:4000/`
-  **Base de datos**: Prisma Studio `npx prisma studio`
-  **Frontend**: React DevTools recomendado

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
