# 🏗️ Arquitectura del Proyecto

## 📋 Visión General

IQpanda Core System es un sistema administrativo con IA construido con arquitectura monorepo, separando claramente el backend (API REST) del frontend (SPA React).

## 🗂️ Estructura de Directorios

```
iqpanda-core-system/
├── src/                    # 🔧 Backend (Node.js + Express + MongoDB)
│   ├── config/            # Configuración (DB, logger, AI)
│   ├── controllers/       # Lógica de negocio de endpoints
│   ├── models/            # Modelos de MongoDB (Mongoose)
│   ├── routes/            # Definición de rutas de API
│   ├── services/          # Servicios de IA y lógica compleja
│   ├── utils/             # Utilidades y helpers
│   ├── __tests__/         # Tests unitarios
│   └── index.ts           # Punto de entrada del servidor
│
├── client/                 # 🎨 Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas principales
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilidades del cliente
│   │   └── App.tsx        # Componente raíz
│   └── package.json       # Dependencias del frontend
│
├── shared/                 # 🔗 Código compartido (tipos, interfaces)
├── script/                 # 🛠️ Scripts de utilidad
├── public/                 # 📁 Archivos estáticos públicos
└── attached_assets/        # 🖼️ Assets del proyecto

# Archivos de configuración
├── package.json            # Workspace raíz y scripts principales
├── tsconfig.json          # Configuración TypeScript backend
├── .env.example           # Template de variables de entorno
├── .nvmrc                 # Versión de Node.js
└── README.md              # Documentación principal
```

## 🔄 Flujo de Datos

```
[Cliente React] 
    ↓ HTTP Request
[Express Server] 
    ↓
[Route Handler] 
    ↓
[Controller] (valida request)
    ↓
[Service] (lógica de negocio/IA)
    ↓
[Model] (Mongoose)
    ↓
[MongoDB]
    ↓
[Response] → [Cliente React]
```

## 🛠️ Stack Tecnológico

### Backend (src/)

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| Runtime | Node.js 24+ | Ejecutar JavaScript en servidor |
| Framework | Express.js | Servidor web y API REST |
| Lenguaje | TypeScript | Tipado estático |
| Base de Datos | MongoDB + Mongoose | Almacenamiento NoSQL |
| Validación | Joi | Validación de esquemas |
| Logging | Winston | Sistema de logs |
| Seguridad | express-rate-limit | Protección contra abuso |
| Testing | Jest | Tests unitarios |

### Frontend (client/)

| Capa | Tecnología | Propósito |
|------|-----------|-----------|
| Framework | React 18 | UI Components |
| Lenguaje | TypeScript | Tipado estático |
| Build Tool | Vite | Bundling y HMR |
| Routing | Wouter | Navegación SPA |
| Estado | TanStack Query | Manejo de estado servidor |
| UI Components | shadcn/ui | Sistema de diseño |
| Estilos | Tailwind CSS | CSS utility-first |

### Servicios de IA (src/services/)

| Servicio | Propósito | Algoritmo |
|----------|-----------|-----------|
| **Panda AI** | Insights y predicciones | Análisis de patrones históricos |
| **Smart Pricing** | Optimización de precios | Análisis de demanda y tendencias |
| **Predictor Financiero** | Proyecciones futuras | Regresión lineal simple |

## 📡 API REST

### Estructura de Endpoints

```
/api
├── /inventario          # Gestión de productos
├── /ventas              # Registro de ventas
├── /tablero             # Dashboard y estadísticas
└── /ia                  # Servicios de IA
    ├── /panda           # Insights de Panda AI
    ├── /precios         # Smart Pricing
    └── /proyeccion      # Predictor Financiero
```

### Formato de Respuestas

Todas las respuestas siguen este formato consistente:

**Éxito:**
```json
{
  "exito": true,
  "mensaje": "Descripción amigable",
  "datos": { ... }
}
```

**Error:**
```json
{
  "exito": false,
  "mensaje": "Descripción del error en español claro"
}
```

## 🧠 Arquitectura de IA

### Configuración Centralizada

Todos los parámetros de IA están en `src/config/ai.config.ts`:

- Umbrales de demanda
- Factores de ajuste de precios
- Períodos de análisis histórico
- Límites de confianza

Esto permite ajustar el comportamiento de la IA sin modificar el código de los servicios.

### Flujo de Análisis

```
[Datos históricos] 
    ↓
[Análisis de patrones]
    ↓
[Cálculo de tendencias]
    ↓
[Generación de insights]
    ↓
[Priorización]
    ↓
[Respuesta al cliente]
```

## 🔐 Seguridad

### Implementadas

- ✅ Rate limiting (100 req/15min)
- ✅ Validación de inputs con Joi
- ✅ Sanitización de consultas MongoDB
- ✅ CORS configurado
- ✅ Manejo seguro de errores

### Por implementar

- ⏳ Autenticación JWT
- ⏳ Roles y permisos
- ⏳ Encriptación de datos sensibles
- ⏳ HTTPS en producción

## 📊 Modelos de Datos

### Product (Producto)

```typescript
{
  nombre: string
  codigo: string (único)
  categoria: string
  precio: number
  cantidadDisponible: number
  cantidadMinima: number
  unidadMedida: string
  descripcion?: string
  activo: boolean
}
```

### Sale (Venta)

```typescript
{
  numeroVenta: string (auto-generado)
  fecha: Date
  cliente: {
    nombre: string
    documento?: string
    telefono?: string
    email?: string
  }
  items: [{
    producto: ObjectId
    nombreProducto: string
    cantidad: number
    precioUnitario: number
    subtotal: number
  }]
  subtotal: number
  descuento: number
  impuestos: number
  total: number
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia' | 'otro'
  estado: 'completada' | 'pendiente' | 'cancelada'
  notas?: string
}
```

## 🚀 Deployment

### Desarrollo

```bash
npm run dev
```

Corre backend (puerto 3000) y frontend (puerto 5173) simultáneamente.

### Producción

```bash
npm run build
npm start
```

Compila TypeScript y sirve el build optimizado.

## 📝 Convenciones de Código

- **Idioma**: Código en inglés, mensajes al usuario en español
- **Formato**: Prettier con 2 espacios
- **Lint**: ESLint con reglas TypeScript
- **Commits**: Mensajes descriptivos en español
- **Testing**: Al menos 80% coverage (objetivo futuro)

## 🔄 Ciclo de Desarrollo

```
1. Crear rama feature
2. Desarrollar con npm run dev
3. Hacer tests con npm test
4. Lint con npm run lint:all
5. Commit y push
6. Pull Request
7. Code Review
8. Merge a main
```

## 📚 Documentación Adicional

- **[README.md](README.md)**: Introducción y quick start
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)**: Referencia completa de API
- **[PANDA_AI_DOCS.md](PANDA_AI_DOCS.md)**: Documentación de IA
- **[DEVELOPMENT.md](DEVELOPMENT.md)**: Guía para desarrolladores
- **[CONTRIBUTING.md](CONTRIBUTING.md)**: Guía de contribución

---

*Última actualización: Enero 2026*
