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

## 🗄️ Esquema de Base de Datos

### Relaciones entre Entidades

El sistema implementa:

```
📍 PLANTA (Plant)
├── 🔧 OPERACIÓN 1 (Operation)
│   ├── 💰 Costo para 300kg
│   ├── 💰 Costo para 1000kg
│   └── 💰 Costo para 5000kg
├── 🔧 OPERACIÓN 2 (Operation)
│   ├── 💰 Costo para 500kg
│   └── 💰 Costo para 2000kg
└── 🔧 OPERACIÓN N...
```

**Relación Principal:**

-  **1 Planta → Muchas Operaciones → Muchos Costos Indirectos**

### Detalle de las Relaciones

#### 🏭 Plant → Operation (1:N)

-  Una **planta** puede tener **múltiples operaciones** (Impresión, Laminado, Corte, etc.)
-  Cada **operación** pertenece a **una sola planta**
-  **Eliminación en cascada**: Si se elimina una planta, se eliminan todas sus operaciones

#### ⚙️ Operation → IndirectCost (1:N)

-  Una **operación** puede tener **múltiples costos indirectos** para diferentes volúmenes
-  Cada **costo** pertenece a **una sola operación**
-  **Eliminación en cascada**: Si se elimina una operación, se eliminan todos sus costos

#### 📊 Restricciones de Integridad

-  **Plant.code**: Único en todo el sistema
-  **(Operation.plantId, Operation.name)**: Única por planta (no puede haber dos operaciones con el mismo nombre en la misma planta)

### Modelo Plant (Planta)

```prisma
model Plant {
  id          String      @id @default(cuid())
  name        String      // Ej: "Planta Norte"
  code        String      @unique // Ej: "PN"
  operations  Operation[] // Relación 1:N con operaciones
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@map("plants")
}
```

### Modelo Operation (Operación)

```prisma
model Operation {
  id        String         @id @default(cuid())
  name      String         // Ej: "Impresión", "Laminado"
  plantId   String         // FK hacia Plant
  plant     Plant          @relation(fields: [plantId], references: [id], onDelete: Cascade)
  costs     IndirectCost[] // Relación 1:N con costos
  createdAt DateTime       @default(now())
  updatedAt DateTime       @updatedAt

  @@unique([plantId, name]) // Una operación única por planta
  @@map("operations")
}
```

### Modelo IndirectCost (Costo Indirecto)

```prisma
model IndirectCost {
  id                 String    @id @default(cuid())
  volumeThresholdKg  Float     // Ej: 300, 1000, 5000
  costPerKg          Float     // Ej: 0.05, 0.03, 0.02
  operationId        String    // FK hacia Operation
  operation          Operation @relation(fields: [operationId], references: [id], onDelete: Cascade)

  @@unique([operationId, volumeThresholdKg]) // Un costo único por volumen por operación
  @@map("indirect_costs")
}
```

### Ejemplo Práctico de Datos

```typescript
// Planta Norte
Plant {
  name: "Planta Norte",
  code: "PN",
  operations: [
    {
      name: "Impresión",
      costs: [
        { volumeThresholdKg: 300, costPerKg: 0.05 },
        { volumeThresholdKg: 1000, costPerKg: 0.03 },
        { volumeThresholdKg: 5000, costPerKg: 0.02 }
      ]
    },
    {
      name: "Laminado",
      costs: [
        { volumeThresholdKg: 500, costPerKg: 0.04 },
        { volumeThresholdKg: 2000, costPerKg: 0.025 }
      ]
    }
  ]
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
