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

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/          # Componentes React
│   │   ├── ui/             # Componentes base (shadcn/ui)
│   │   ├── plants/         # Componentes de plantas
│   │   ├── operations/     # Componentes de operaciones
│   │   └── base/           # Componentes reutilizables
│   ├── hooks/              # Custom hooks
│   │   ├── usePlants.ts    # Hooks para plantas
│   │   └── useOperations.ts # Hooks para operaciones
│   ├── lib/                # Utilidades centralizadas
│   │   ├── constants.ts    # Constantes del sistema
│   │   ├── functions.ts    # Funciones utilitarias
│   │   ├── types.ts        # Tipos TypeScript comunes
│   │   └── index.ts        # Exportaciones centralizadas
│   ├── graphql/            # GraphQL
│   │   └── graphql.types.ts # Tipos generados automáticamente
│   ├── types/              # Tipos TypeScript
│   │   └── index.ts        # Re-exportación de tipos GraphQL
│   ├── app/                # Páginas principales
│   │   └── IndirectCostsPage.tsx
│   ├── App.tsx             # Componente raíz
│   ├── main.tsx            # Punto de entrada
│   └── index.css           # Estilos globales
├── public/                 # Archivos estáticos
├── codegen.ts             # Configuración GraphQL CodeGen
├── tailwind.config.js     # Configuración Tailwind
├── vite.config.ts         # Configuración Vite
└── tsconfig.json          # Configuración TypeScript
```

## 🔧 Configuración

### Apollo Client

```typescript
// Configurado para conectar al backend GraphQL
const client = new ApolloClient({
	uri: 'http://localhost:4000/',
	cache: new InMemoryCache(),
});
```

### GraphQL Code Generator

```typescript
// codegen.ts
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: 'http://localhost:4000/',
	documents: ['src/**/*.tsx', 'src/**/*.ts'],
	generates: {
		'src/graphql/graphql.types.ts': {
			plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
		},
	},
};
```

### Tipos GraphQL Generados

Los tipos se generan automáticamente en `src/graphql/graphql.types.ts`:

```typescript
export type Plant = {
	id: string;
	name: string;
	code: string;
	operations?: Operation[];
	createdAt: Date;
	updatedAt: Date;
};

export type Operation = {
	id: string;
	name: string;
	plantId: string;
	costs: IndirectCost[];
	// ...
};
```

## 🔍 Depuración

### Herramientas Recomendadas

-  **React DevTools** - Inspeccionar componentes
-  **Apollo DevTools** - Depurar GraphQL
-  **Vite DevTools** - Performance del build

### Logs Útiles

```typescript
// Apollo Client queries
localStorage.setItem('apollo:devtools', 'true');

// GraphQL errors
console.log(error.graphQLErrors);
console.log(error.networkError);
```

## 🚀 Optimizaciones

### Vite

-  **HMR** - Hot Module Replacement
-  **Tree Shaking** - Eliminación de código no usado
-  **Code Splitting** - Carga bajo demanda

### Apollo Client

-  **Cache** - InMemoryCache para performance
-  **Queries** - Optimistic updates
-  **Subscriptions** - Real-time (preparado)

## 🤝 Desarrollo

### ESLint Rules

```json
{
	"extends": ["@typescript-eslint/recommended", "plugin:react-hooks/recommended"]
}
```

---
