# Frontend - Sistema de Gestión de Costos Indirectos

## 🛠️ Stack Tecnológico

-  **React 18** - Librería de UI
-  **TypeScript** - Tipado estático
-  **Vite** - Build tool y dev server
-  **Apollo Client** - Cliente GraphQL
-  **shadcn/ui** - Componentes de UI
-  **Tailwind CSS** - Framework de CSS
-  **GraphQL Code Generator** - Generación automática de tipos
-  **Lucide React** - Iconos

## 🚀 Inicio Rápido

### Prerrequisitos

-  Node.js 18+
-  Backend corriendo en `http://localhost:4000`

### Instalación

```bash
# Instalar dependencias
npm install

# Generar tipos GraphQL
npm run codegen

# Iniciar en desarrollo
npm run dev:full
```

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo básico
npm run dev:full         # Desarrollo + CodeGen en watch mode

# Build
npm run build           # Compilar para producción
npm run preview         # Previsualizar build

# GraphQL
npm run codegen         # Generar tipos GraphQL
npm run codegen:watch   # Generar tipos en modo watch

# Calidad de código
npm run lint            # Ejecutar ESLint
```

## 🔧 Configuración

### Variables de Entorno (.env)

```env
# Conexión
PUBLIC_API_URL= "http://localhost:4000"
```
