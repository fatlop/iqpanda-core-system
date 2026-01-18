# 🐼 IQpanda Core System

Sistema administrativo amigable y escalable, desarrollado por IQpanda Tecnovador, enfocado en pequeñas y medianas empresas. Diseñado para ser claro, humano y adaptable, con base sólida para futuras integraciones inteligentes.

## 🎯 Propósito

IQpanda Core System es el corazón digital de IQpanda Tecnovador. Es un sistema administrativo pensado para negocios reales y personas reales, creado para:

- 📊 **Organizar ventas** de forma clara y ordenada
- 📦 **Gestionar inventario** con control de stock inteligente
- 🎨 **Visualizar el estado del negocio** de manera amigable
- 💡 **Ayudar a tomar mejores decisiones** sin usar lenguaje técnico

## ✨ Características Principales

### Gestión de Ventas
- Registro completo de ventas con información del cliente
- Seguimiento de productos vendidos
- Cálculo automático de totales, descuentos e impuestos
- Múltiples métodos de pago (efectivo, tarjeta, transferencia)
- Cancelación de ventas con reposición automática de inventario

### Control de Inventario
- Gestión completa de productos con código único
- Seguimiento de cantidades disponibles
- Alertas de stock bajo
- Categorización de productos
- Búsqueda rápida por nombre, código o categoría

### Tablero de Control
- Vista general del negocio en tiempo real
- Estadísticas de ventas por período
- Productos más vendidos
- Análisis por método de pago
- Valor total del inventario
- Reportes personalizables

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js (v18 o superior)
- MongoDB (v6 o superior)
- npm o yarn

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/fatlop/iqpanda-core-system.git
cd iqpanda-core-system
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:
```
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/iqpanda-core
LOG_LEVEL=info
```

4. **Iniciar el servidor**
```bash
# Desarrollo (con recarga automática)
npm run dev

# Producción
npm run build
npm start
```

El servidor estará disponible en `http://localhost:3000`

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

### Ejemplos de Uso

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
