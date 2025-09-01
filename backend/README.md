# Backend - Sistema de Gestión de Costos Indirectos

## 🛠️ Stack Tecnológico

-  **Apollo Server** - Servidor GraphQL
-  **Prisma** - ORM y generador de tipos
-  **SQLite** - Base de datos (desarrollo)
-  **TypeScript** - Tipado estático
-  **tsx** - Ejecutor TypeScript con hot reload
-  **dotenv** - Variables de entorno

## 🚀 Inicio Rápido

### Prerrequisitos

-  Node.js 18+
-  npm

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Configurar base de datos
npx prisma generate
npx prisma db push

# (Opcional) Datos de prueba
npm run seed

# Iniciar servidor
npm run dev
```

El servidor estará disponible en `http://localhost:4000`

## 📦 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor con hot reload
npm run start            # Servidor de producción

# Build
npm run build           # Compilar TypeScript
npm run clean           # Limpiar archivos compilados

# Base de datos
npm run db:push         # Aplicar cambios schema a DB
npm run db:reset        # Resetear base de datos
npm run db:studio       # Abrir Prisma Studio
npm run seed            # Ejecutar datos de prueba

# Prisma
npm run prisma:generate # Generar cliente Prisma
npm run prisma:migrate  # Crear migración
```

### 📁 Estructura Actual del Proyecto

```
backend/
├── src/
│   ├── modules/                # Módulos de dominio
│   │   ├── plants/            # Módulo de plantas
│   │   │   ├── plant.service.ts
│   │   │   ├── plant.resolver.ts
│   │   │   └── plant.schema.ts
│   │   └── operations/        # Módulo de operaciones
│   │       ├── operation.service.ts
│   │       ├── operation.resolver.ts
│   │       └── operation.schema.ts
│   ├── models/                # Modelos Prisma
│   │   ├── Operation.ts       # Modelo de operación
│   │   ├── Plan.ts           # Modelo de planta
│   │   └── types.ts          # Tipos compartidos
│   ├── resolvers/            # Resolvers GraphQL
│   │   └── index.ts          # Combinación de resolvers
│   ├── seed/                 # Datos de prueba
│   │   └── seed.ts
│   ├── context.ts           # Contexto GraphQL
│   ├── schema.ts            # Schema GraphQL combinado
│   └── index.ts             # Punto de entrada
├── prisma/
│   ├── schema.prisma        # Esquema de base de datos
│   ├── dev.db              # Base de datos SQLite
│   └── migrations/          # Migraciones (si se usan)
├── .env                     # Variables de entorno
├── .env.example            # Ejemplo de variables
├── package.json
└── tsconfig.json
```

## 🗄️ Esquema de Base de Datos

### Modelo Plant (Planta)

```prisma
model Plant {
  id          String      @id @default(cuid())
  name        String
  code        String      @unique
  operations  Operation[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}
```

### Modelo Operation (Operación)

```prisma
model Operation {
  id        String         @id @default(cuid())
  name      String
  plantId   String
  plant     Plant          @relation(fields: [plantId], references: [id], onDelete: Cascade)
  costs     IndirectCost[]
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt
}
```

### Modelo IndirectCost (Costo Indirecto)

```prisma
model IndirectCost {
  id                 String    @id @default(cuid())
  volumeThresholdKg  Float
  costPerKg          Float
  operationId        String
  operation          Operation @relation(fields: [operationId], references: [id], onDelete: Cascade)
}
```

## � GraphQL Schema

### Tipos Principales

```graphql
type Plant {
	id: ID!
	name: String!
	code: String!
	operations: [Operation!]
	createdAt: Date!
	updatedAt: Date!
}

type Operation {
	id: ID!
	name: String!
	plantId: ID!
	plant: Plant
	costs: [IndirectCost!]!
	createdAt: Date!
	updatedAt: Date!
}

type IndirectCost {
	id: ID!
	volumeThresholdKg: Float!
	costPerKg: Float!
	operationId: ID!
}
```

### Queries

```graphql
type Query {
	plants: [Plant!]!
	plant(id: ID!): Plant
	plantOperations(plantId: ID!): [Operation!]!
	operation(id: ID!): Operation
}
```

### Mutations

```graphql
type Mutation {
	# Plantas
	createPlant(name: String!, code: String!): Plant!
	updatePlant(id: ID!, name: String, code: String): Plant!
	deletePlant(id: ID!): Boolean!

	# Operaciones
	createOperation(plantId: ID!, name: String!, costs: [IndirectCostInput!]): Operation!
	updateOperationCosts(operationId: ID!, costs: [IndirectCostInput!]!): Operation!
	deleteOperation(operationId: ID!): Boolean!
}
```

## 🔧 Configuración

### Variables de Entorno (.env)

```env
# Base de datos
DATABASE_URL="file:./dev.db"

# Puerto del servidor
PORT=4000

# Entorno
NODE_ENV=development

# CORS (opcional)
CORS_ORIGIN="http://localhost:5173"
```

### Context GraphQL

```typescript
export interface Context {
	prisma: PrismaClient;
	// Aquí se pueden agregar más servicios
	// user?: User; // Para autenticación futura
}

export const createContext = (): Context => ({
	prisma,
});
```

## � Ejemplos de Uso GraphQL

### Crear una nueva planta

```graphql
mutation {
	createPlant(name: "Planta Norte", code: "PN") {
		id
		name
		code
		createdAt
	}
}
```

### Obtener plantas con operaciones

```graphql
query {
	plants {
		id
		name
		code
		operations {
			id
			name
			costs {
				volumeThresholdKg
				costPerKg
			}
		}
	}
}
```

### Crear una operación

```graphql
mutation {
	createOperation(
		plantId: "plant-id"
		name: "Empaquetado"
		costs: [
			{ volumeThresholdKg: 300, costPerKg: 0.025 }
			{ volumeThresholdKg: 1000, costPerKg: 0.020 }
		]
	) {
		id
		name
		costs {
			volumeThresholdKg
			costPerKg
		}
	}
}
```

### Actualizar costos de operación

```graphql
mutation {
	updateOperationCosts(
		operationId: "operation-id"
		costs: [
			{ volumeThresholdKg: 300, costPerKg: 0.030 }
			{ volumeThresholdKg: 1000, costPerKg: 0.025 }
			{ volumeThresholdKg: 3000, costPerKg: 0.020 }
		]
	) {
		id
		name
		costs {
			volumeThresholdKg
			costPerKg
		}
	}
}
```

## 📊 Datos de Prueba

### Seed Script

El script de seed crea:

-  **3 plantas** de ejemplo
-  **Operaciones** por planta (Impresión, Laminado, etc.)
-  **Costos** por diferentes volúmenes

```bash
npm run seed
```

### Datos Creados

```typescript
// Plantas
{ name: "Planta Norte", code: "PN" }
{ name: "Fábrica Central", code: "FC" }
{ name: "Manufactura Sur", code: "MS" }

// Operaciones por planta
["Impresión", "Laminado", "Corte", "Empaquetado"]

// Volúmenes de ejemplo
[300, 500, 1000, 3000, 5000] // kg
```

## 🔍 Herramientas de Desarrollo

### Prisma Studio

Interfaz visual para la base de datos:

```bash
npm run db:studio
```

Disponible en `http://localhost:5555`

### GraphQL Playground

Explorador GraphQL integrado:

-  Visita `http://localhost:4000`
-  Explora schema y ejecuta queries

### Hot Reload

El servidor se reinicia automáticamente al cambiar archivos:

```bash
npm run dev
# Usa tsx watch para hot reload
```

## 🚀 Despliegue

### Build de Producción

```bash
npm run build
npm start
```

### Variables de Producción

```env
NODE_ENV=production
DATABASE_URL="postgresql://..." # Para PostgreSQL en producción
PORT=4000
```
