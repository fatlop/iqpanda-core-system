# 📝 Ejemplos de Uso - IQpanda Core System

Este documento contiene ejemplos prácticos de cómo usar el sistema IQpanda Core.

## 🚀 Iniciar el Sistema

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar en modo desarrollo
npm run dev
```

## 📦 Ejemplos de Productos

### Crear Productos de Ejemplo

#### Producto 1: Café Premium
```bash
curl -X POST http://localhost:3000/api/inventario \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Café Premium Chiapas",
    "codigo": "CAF001",
    "categoria": "Bebidas",
    "descripcion": "Café de grano selecto de Chiapas, México",
    "precio": 159.00,
    "cantidadDisponible": 50,
    "cantidadMinima": 10,
    "unidadMedida": "bolsa"
  }'
```

#### Producto 2: Pan Dulce
```bash
curl -X POST http://localhost:3000/api/inventario \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Pan Dulce Surtido",
    "codigo": "PAN001",
    "categoria": "Panadería",
    "descripcion": "Variedad de pan dulce mexicano",
    "precio": 35.00,
    "cantidadDisponible": 100,
    "cantidadMinima": 20,
    "unidadMedida": "pieza"
  }'
```

#### Producto 3: Leche Entera
```bash
curl -X POST http://localhost:3000/api/inventario \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Leche Entera",
    "codigo": "LEC001",
    "categoria": "Lácteos",
    "descripcion": "Leche entera pasteurizada",
    "precio": 25.50,
    "cantidadDisponible": 75,
    "cantidadMinima": 15,
    "unidadMedida": "litro"
  }'
```

## 💰 Ejemplos de Ventas

### Venta 1: Compra Sencilla
```bash
curl -X POST http://localhost:3000/api/ventas \
  -H "Content-Type: application/json" \
  -d '{
    "cliente": {
      "nombre": "María González Pérez",
      "telefono": "55-1234-5678",
      "email": "maria.gonzalez@email.com"
    },
    "items": [
      {
        "producto": "ID_DEL_CAFE",
        "cantidad": 2
      }
    ],
    "metodoPago": "efectivo",
    "descuento": 0,
    "impuestos": 30.00
  }'
```

### Venta 2: Compra Múltiple
```bash
curl -X POST http://localhost:3000/api/ventas \
  -H "Content-Type: application/json" \
  -d '{
    "cliente": {
      "nombre": "Juan Martínez López",
      "documento": "MALJ850320ABC",
      "telefono": "55-9876-5432",
      "email": "juan.martinez@email.com"
    },
    "items": [
      {
        "producto": "ID_DEL_CAFE",
        "cantidad": 1
      },
      {
        "producto": "ID_DEL_PAN",
        "cantidad": 5
      },
      {
        "producto": "ID_DE_LA_LECHE",
        "cantidad": 2
      }
    ],
    "metodoPago": "tarjeta",
    "descuento": 25.00,
    "impuestos": 50.00,
    "notas": "Cliente frecuente - Aplicar descuento especial"
  }'
```

## 📊 Consultar Información

### Ver Todos los Productos
```bash
curl http://localhost:3000/api/inventario
```

### Buscar Productos por Categoría
```bash
curl "http://localhost:3000/api/inventario?categoria=Bebidas"
```

### Ver Productos con Stock Bajo
```bash
curl http://localhost:3000/api/inventario/stock-bajo
```

### Ver Todas las Ventas
```bash
curl http://localhost:3000/api/ventas
```

### Filtrar Ventas por Fecha
```bash
curl "http://localhost:3000/api/ventas?fechaInicio=2024-01-01&fechaFin=2024-12-31"
```

### Ver Dashboard General (últimos 30 días)
```bash
curl "http://localhost:3000/api/tablero?periodo=30"
```

### Generar Reporte de Ventas
```bash
curl "http://localhost:3000/api/tablero/reporte-ventas?fechaInicio=2024-01-01&fechaFin=2024-12-31"
```

## 🔄 Actualizar Información

### Actualizar Precio de un Producto
```bash
curl -X PUT http://localhost:3000/api/inventario/ID_DEL_PRODUCTO \
  -H "Content-Type: application/json" \
  -d '{
    "precio": 179.00
  }'
```

### Actualizar Stock de un Producto
```bash
curl -X PUT http://localhost:3000/api/inventario/ID_DEL_PRODUCTO \
  -H "Content-Type: application/json" \
  -d '{
    "cantidadDisponible": 150
  }'
```

### Cancelar una Venta
```bash
curl -X PUT http://localhost:3000/api/ventas/ID_DE_LA_VENTA/cancelar
```

## 🗑️ Desactivar Productos

```bash
# Desactivar un producto (no lo elimina, solo lo marca como inactivo)
curl -X DELETE http://localhost:3000/api/inventario/ID_DEL_PRODUCTO
```

## 💡 Flujo de Trabajo Típico

### 1. Configurar el Inventario Inicial
```bash
# Agregar todos tus productos al sistema
# Ejemplo: Agregar 10-20 productos diferentes
```

### 2. Registrar Ventas Diarias
```bash
# Cada vez que haces una venta, regístrala en el sistema
# El sistema automáticamente:
# - Calcula el total
# - Actualiza el inventario
# - Genera un número de venta único
```

### 3. Monitorear el Negocio
```bash
# Revisar el dashboard diariamente
curl http://localhost:3000/api/tablero

# Verificar productos con stock bajo
curl http://localhost:3000/api/inventario/stock-bajo

# Generar reportes mensuales
curl "http://localhost:3000/api/tablero/reporte-ventas?fechaInicio=2024-01-01&fechaFin=2024-01-31"
```

### 4. Mantener el Inventario
```bash
# Actualizar precios según sea necesario
# Actualizar cantidades cuando recibas nueva mercancía
# Desactivar productos que ya no vendas
```

## 🎯 Casos de Uso Reales

### Tienda de Abarrotes
- Registra productos como: arroz, frijol, aceite, galletas, refrescos
- Métodos de pago: efectivo, tarjeta
- Monitorea qué productos se venden más
- Alertas cuando se acaba la mercancía

### Cafetería
- Productos: café, té, pan, pasteles, sandwiches
- Seguimiento de ventas por horario
- Control de inventario de ingredientes
- Reportes de productos más populares

### Tienda de Ropa
- Productos con diferentes tallas y colores
- Métodos de pago variados
- Control de temporadas
- Análisis de ventas por categoría

## 🔍 Tips y Mejores Prácticas

1. **Códigos de Producto**: Usa códigos únicos y descriptivos (ej: CAF001, PAN001)
2. **Categorías**: Define categorías claras desde el inicio
3. **Stock Mínimo**: Configura alertas de stock bajo apropiadas
4. **Backups**: Respalda tu base de datos regularmente
5. **Reportes**: Genera reportes al final de cada mes para análisis
6. **Cliente**: Registra información básica para seguimiento
7. **Notas**: Usa el campo de notas para información importante

## 📱 Próximos Pasos

Una vez que domines el uso básico, puedes:
- Integrar con un sistema de punto de venta (POS)
- Conectar con una aplicación móvil
- Agregar usuarios y permisos
- Implementar facturación electrónica
- Crear reportes personalizados avanzados
