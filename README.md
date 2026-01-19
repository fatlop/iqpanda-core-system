# 🐼 IQpanda Core System v2.0 - Con Inteligencia Artificial

Sistema administrativo revolucionario con IA, desarrollado por IQpanda Tecnovador, enfocado en pequeñas y medianas empresas. No es solo un sistema administrativo, **es tu socio digital inteligente**.

## 🎯 Visión Revolucionaria

IQpanda Core System es el corazón digital de IQpanda Tecnovador. Es un **Co-Piloto de Negocios con IA** pensado para negocios reales y personas reales, creado para:

- 📊 **Organizar ventas** de forma clara y ordenada
- 📦 **Gestionar inventario** con control de stock inteligente  
- 🎨 **Visualizar el estado del negocio** de manera amigable
- 💡 **Ayudar a tomar mejores decisiones** sin usar lenguaje técnico
- 🧠 **Predecir y sugerir** estrategias con Inteligencia Artificial
- 🔮 **Proyectar tu futuro financiero** con precisión

## 🌟 NUEVAS Características con IA

### 🐼 Panda AI - Tu Asesor Virtual Inteligente

**No es un chatbot... es tu socio de negocios 24/7**

```
🐼 Panda AI dice:
"Noté que los viernes vendes 40% más café que otros días.
¿Qué tal si preparas más stock los jueves? Te ahorrarías 3 ventas 
perdidas por semana. Eso son $1,200 MXN al mes."
```

**Capacidades:**
- 🎯 **Predicción de demanda**: Anticipa qué productos se venderán más
- 💰 **Alertas inteligentes**: "Estás a punto de quedarte sin tu producto estrella"
- 📊 **Análisis de patrones**: Detecta tendencias que tú no ves
- 🗣️ **Insights accionables**: Sugerencias claras y específicas

### 💰 Smart Pricing - Precios Inteligentes

**La IA sugiere el precio perfecto para maximizar ganancias**

```
🐼 Análisis de "Café Americano":
   
   Tu precio actual: $25
   Demanda: Alta y creciente
   
   💡 Sugerencia:
   Precio sugerido: $28.75
   Razón: Alta demanda y creciente. Los clientes valoran mucho este producto.
   Impacto: +15% en margen sin perder clientes
```

### 🔮 Predictor Financiero

**Ve el futuro de tu negocio**

```
📅 PROYECCIÓN - Próximos 30 días:

┌────────────────────────────────────┐
│  Si sigues así:                    │
│  💰 Ventas estimadas: $37,500      │
│  📊 Crecimiento: +8.5%             │
│  ⚠️  Riesgo: Stock-out en 3 items  │
│                                     │
│  Si aplicas sugerencias de Panda:  │
│  💰 Ventas estimadas: $52,500      │
│  📊 Crecimiento: +48.5%            │
│  🎯 Ganancia extra: $15,000        │
└────────────────────────────────────┘
```

## ✨ Características Principales (Core)

### Gestión de Ventas
- Registro completo de ventas con información del cliente
- Seguimiento de productos vendidos
- Cálculo automático de totales, descuentos e impuestos
- Múltiples métodos de pago (efectivo, tarjeta, transferencia)
- Cancelación de ventas con reposición automática de inventario

### Control de Inventario
- Gestión completa de productos con código único
- Seguimiento de cantidades disponibles
- Alertas de stock bajo + **predicción IA de agotamiento**
- Categorización de productos
- Búsqueda rápida por nombre, código o categoría

### Tablero de Control
- Vista general del negocio en tiempo real
- Estadísticas de ventas por período
- Productos más vendidos + **análisis predictivo**
- Análisis por método de pago
- Valor total del inventario
- Reportes personalizables

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js v24.13.0 o superior
- MongoDB v6 o superior
- npm (incluido con Node.js)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/fatlop/iqpanda-core-system.git
cd iqpanda-core-system

# 2. Instalar dependencias (backend + frontend)
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus valores

# 4. Iniciar el proyecto completo
npm run dev
```

El servidor backend estará en `http://localhost:3000`  
El frontend estará en `http://localhost:5173`

### Scripts Principales

```bash
npm run dev          # Desarrollo (backend + frontend)
npm run build        # Build producción
npm start            # Iniciar en producción
npm test             # Correr tests
npm run lint:all     # Verificar código
```

📖 **Para más detalles**, consulta [DEVELOPMENT.md](DEVELOPMENT.md)

## 📚 Uso de la API

### Endpoints Principales

#### 🏠 General
```
GET  /              - Información del sistema
GET  /health        - Estado del servidor
```

#### 📦 Inventario
```
GET    /api/inventario              - Listar todos los productos
GET    /api/inventario/:id          - Obtener un producto
GET    /api/inventario/stock-bajo   - Productos con stock bajo
POST   /api/inventario              - Crear producto
PUT    /api/inventario/:id          - Actualizar producto
DELETE /api/inventario/:id          - Desactivar producto
```

#### 💰 Ventas
```
GET  /api/ventas              - Listar ventas
GET  /api/ventas/:id          - Obtener una venta
POST /api/ventas              - Registrar nueva venta
PUT  /api/ventas/:id/cancelar - Cancelar venta
```

#### 📊 Tablero de Control
```
GET /api/tablero                - Dashboard general
GET /api/tablero/reporte-ventas - Reporte de ventas por período
```

#### 🧠 Inteligencia Artificial (NUEVO)
```
GET /api/ia/panda           - Insights inteligentes de Panda AI
GET /api/ia/precios         - Sugerencias de precios para todos los productos
GET /api/ia/precios/:id     - Sugerencia de precio para un producto específico
GET /api/ia/proyeccion?dias=30 - Proyección financiera a futuro
```

### Ejemplos de Uso

#### Consultar Panda AI
```bash
curl http://localhost:3000/api/ia/panda
```

**Respuesta:**
```json
{
  "exito": true,
  "mensaje": "🐼 Panda AI ha analizado tu negocio",
  "totalInsights": 4,
  "insights": [
    {
      "tipo": "prediccion",
      "titulo": "🔮 Predicción para hoy",
      "mensaje": "Basándome en los últimos 30 días, hoy podrías vender aproximadamente $1,250.50",
      "prioridad": "media"
    },
    {
      "tipo": "alerta",
      "titulo": "Stock crítico: Café Premium",
      "mensaje": "¡Atención! Te quedarás sin 'Café Premium' en aproximadamente 2 días",
      "prioridad": "alta",
      "impactoEstimado": "Evitarás perder aproximadamente 21 ventas"
    }
  ]
}
```

#### Obtener Smart Pricing
```bash
curl http://localhost:3000/api/ia/precios
```

**Respuesta:**
```json
{
  "exito": true,
  "mensaje": "💡 Smart Pricing ha analizado tus productos",
  "totalSugerencias": 3,
  "sugerencias": [
    {
      "nombreProducto": "Café Americano",
      "precioActual": 25.00,
      "precioSugerido": 28.75,
      "razon": "Alta demanda y creciente",
      "impactoEstimado": "+15% en margen sin perder clientes"
    }
  ]
}
```

#### Ver Proyección Financiera
```bash
curl "http://localhost:3000/api/ia/proyeccion?dias=30"
```

#### Crear un Producto
```bash
curl -X POST http://localhost:3000/api/inventario \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Café Premium",
    "codigo": "CAF001",
    "categoria": "Bebidas",
    "precio": 15.99,
    "cantidadDisponible": 50,
    "cantidadMinima": 10,
    "unidadMedida": "bolsa",
    "descripcion": "Café de grano selecto"
  }'
```

#### Registrar una Venta
```bash
curl -X POST http://localhost:3000/api/ventas \
  -H "Content-Type: application/json" \
  -d '{
    "cliente": {
      "nombre": "María González",
      "telefono": "555-0123",
      "email": "maria@email.com"
    },
    "items": [
      {
        "producto": "ID_DEL_PRODUCTO",
        "cantidad": 2
      }
    ],
    "metodoPago": "tarjeta",
    "descuento": 0,
    "impuestos": 3.20
  }'
```

#### Ver Dashboard
```bash
curl http://localhost:3000/api/tablero?periodo=30
```

## 🏗️ Arquitectura

El sistema está construido con:

- **Backend**: Node.js + TypeScript + Express
- **Base de Datos**: MongoDB con Mongoose
- **Validación**: Joi
- **Logging**: Winston
- **Arquitectura**: MVC (Model-View-Controller)

### Estructura del Proyecto
```
iqpanda-core-system/
├── src/
│   ├── config/          # Configuración (DB, logger)
│   ├── controllers/     # Lógica de negocio
│   ├── models/          # Modelos de datos
│   ├── routes/          # Definición de rutas
│   └── index.ts         # Punto de entrada
├── dist/                # Código compilado
├── package.json         # Dependencias
├── tsconfig.json        # Configuración TypeScript
└── .env                 # Variables de entorno
```

## 🔒 Seguridad

- Validación de datos en todas las entradas
- Manejo seguro de errores
- Logs detallados de operaciones
- Sanitización de consultas MongoDB

## 🧪 Testing

```bash
npm test
```

## 📝 Scripts Disponibles

```bash
npm run dev      # Ejecutar en modo desarrollo
npm run build    # Compilar TypeScript
npm start        # Ejecutar en producción
npm test         # Ejecutar tests
npm run lint     # Verificar código
npm run format   # Formatear código
```

## 🚀 Funcionalidades Revolucionarias Implementadas

### ✅ Fase 1: Fundación con IA (COMPLETADO)
- ✅ Core system funcional
- ✅ 🧠 **Panda AI** - Asesor virtual inteligente
- ✅ 💰 **Smart Pricing** - Precios inteligentes basados en IA
- ✅ 🔮 **Predictor Financiero** - Proyecciones a 30+ días
- ✅ 📊 Dashboard con insights en tiempo real

### 🔜 Fase 2: Magia (Próximamente)
- [ ] 🎙️ Control por voz completo (VoiceCommerce)
- [ ] 📸 VisionStock con IA - Inventario por cámara
- [ ] 🤖 AutoPilot mode - Sistema autónomo
- [ ] 📲 WhatsApp Business Integration

### 🌟 Fase 3: Ecosistema (Futuro)
- [ ] 🌐 Multi-sucursal inteligente
- [ ] 🎮 Gamificación total
- [ ] 🎓 IQpanda Academy
- [ ] 🤝 Red IQpanda de negocios

## 📖 Documentación Adicional

- **[PANDA_AI_DOCS.md](PANDA_AI_DOCS.md)**: Guía completa de funciones de IA
- **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)**: Documentación completa de API REST
- **[EJEMPLOS.md](EJEMPLOS.md)**: Ejemplos prácticos de uso
- **[CONTRIBUTING.md](CONTRIBUTING.md)**: Guía para contribuir al proyecto

## 🎯 Por Qué IQpanda es Revolucionario

### Antes (Sistemas tradicionales):
❌ Aprender a usar el sistema = 2 semanas
❌ Formularios complicados
❌ Reportes que no entiendes
❌ Tú haces todo el trabajo
❌ Software frío y robótico

### Ahora (IQpanda Core con IA):
✅ Listo para usar en 3 minutos
✅ IA que te asesora 24/7
✅ Insights que SÍ entiendes
✅ La IA trabaja para ti
✅ Predicciones precisas
✅ El sistema piensa contigo

## 🌟 Diseño Centrado en el Usuario

Este sistema está diseñado para personas reales que manejan negocios reales:

- ✅ **Lenguaje claro**: Sin jerga técnica complicada
- ✅ **Mensajes amigables**: Respuestas comprensibles en español
- ✅ **Procesos simples**: Flujos de trabajo intuitivos
- ✅ **Visual y organizado**: Datos presentados de forma clara
- ✅ **Adaptable**: Fácil de personalizar y extender

## 🚀 Futuras Mejoras

- [ ] Autenticación y autorización de usuarios
- [ ] Reportes avanzados con gráficos
- [ ] Notificaciones automáticas
- [ ] API REST completa con documentación Swagger
- [ ] Exportación de datos (Excel, PDF)
- [ ] Integración con sistemas de pago
- [ ] Módulo de clientes y proveedores
- [ ] Dashboard web con interfaz visual
- [ ] Aplicación móvil

## 👥 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 📞 Contacto

IQpanda Tecnovador - Sistema desarrollado con ❤️ para pequeñas y medianas empresas

---

**¡Hecho para ayudarte a tomar mejores decisiones en tu negocio!** 🐼
