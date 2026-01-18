# 📖 Documentación de la API - IQpanda Core System

## Información General

- **Base URL**: `http://localhost:3000`
- **Formato**: JSON
- **Codificación**: UTF-8

## Respuestas Estándar

### Respuesta Exitosa
```json
{
  "exito": true,
  "mensaje": "Operación completada",
  "datos": { ... }
}
```

### Respuesta de Error
```json
{
  "exito": false,
  "mensaje": "Descripción del error"
}
```

## Endpoints

### 🏠 Sistema

#### GET /
Información general del sistema
```bash
curl http://localhost:3000/
```

**Respuesta:**
```json
{
  "nombre": "IQpanda Core System",
  "descripcion": "Sistema administrativo amigable para tu negocio",
  "version": "1.0.0",
  "estado": "activo"
}
```

#### GET /health
Estado de salud del servidor
```bash
curl http://localhost:3000/health
```

**Respuesta:**
```json
{
  "estado": "saludable",
  "fecha": "2024-01-18T12:00:00.000Z"
}
```

---

## 📦 Inventario

### GET /api/inventario
Obtener lista de productos

**Parámetros de consulta:**
- `categoria` (opcional): Filtrar por categoría
- `activo` (opcional): true/false
- `buscar` (opcional): Búsqueda por texto

```bash
curl "http://localhost:3000/api/inventario?categoria=Bebidas&activo=true"
```

**Respuesta:**
```json
{
  "exito": true,
  "total": 10,
  "productos": [
    {
      "_id": "...",
      "nombre": "Café Premium",
      "codigo": "CAF001",
      "categoria": "Bebidas",
      "precio": 15.99,
      "cantidadDisponible": 50,
      "cantidadMinima": 10,
      "unidadMedida": "bolsa",
      "activo": true
    }
  ]
}
```

### GET /api/inventario/:id
Obtener un producto específico

```bash
curl http://localhost:3000/api/inventario/PRODUCT_ID
```

### GET /api/inventario/stock-bajo
Productos con stock bajo o agotado

```bash
curl http://localhost:3000/api/inventario/stock-bajo
```

**Respuesta:**
```json
{
  "exito": true,
  "total": 3,
  "mensaje": "3 producto(s) con stock bajo",
  "productos": [...]
}
```

### POST /api/inventario
Crear un nuevo producto

**Body:**
```json
{
  "nombre": "Café Premium",
  "codigo": "CAF001",
  "categoria": "Bebidas",
  "precio": 15.99,
  "cantidadDisponible": 50,
  "cantidadMinima": 10,
  "unidadMedida": "bolsa",
  "descripcion": "Café de grano selecto"
}
```

```bash
curl -X POST http://localhost:3000/api/inventario \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Café Premium","codigo":"CAF001","categoria":"Bebidas","precio":15.99,"cantidadDisponible":50,"cantidadMinima":10,"unidadMedida":"bolsa"}'
```

**Respuesta:**
```json
{
  "exito": true,
  "mensaje": "Producto creado exitosamente",
  "producto": { ... }
}
```

### PUT /api/inventario/:id
Actualizar un producto

```bash
curl -X PUT http://localhost:3000/api/inventario/PRODUCT_ID \
  -H "Content-Type: application/json" \
  -d '{"precio":17.99,"cantidadDisponible":100}'
```

### DELETE /api/inventario/:id
Desactivar un producto (no se elimina, solo se marca como inactivo)

```bash
curl -X DELETE http://localhost:3000/api/inventario/PRODUCT_ID
```

---

## 💰 Ventas

### GET /api/ventas
Listar ventas

**Parámetros de consulta:**
- `fechaInicio` (opcional): Fecha inicio (ISO 8601)
- `fechaFin` (opcional): Fecha fin (ISO 8601)
- `estado` (opcional): completada, pendiente, cancelada
- `cliente` (opcional): Buscar por nombre de cliente

```bash
curl "http://localhost:3000/api/ventas?estado=completada&fechaInicio=2024-01-01"
```

**Respuesta:**
```json
{
  "exito": true,
  "total": 25,
  "ventas": [
    {
      "_id": "...",
      "numeroVenta": "V-20240118-123456",
      "fecha": "2024-01-18T12:00:00.000Z",
      "cliente": {
        "nombre": "María González",
        "telefono": "555-0123",
        "email": "maria@email.com"
      },
      "items": [...],
      "subtotal": 50.00,
      "descuento": 5.00,
      "impuestos": 4.50,
      "total": 49.50,
      "metodoPago": "tarjeta",
      "estado": "completada"
    }
  ]
}
```

### GET /api/ventas/:id
Obtener una venta específica

```bash
curl http://localhost:3000/api/ventas/SALE_ID
```

### POST /api/ventas
Registrar una nueva venta

**Body:**
```json
{
  "cliente": {
    "nombre": "María González",
    "documento": "12345678",
    "telefono": "555-0123",
    "email": "maria@email.com"
  },
  "items": [
    {
      "producto": "PRODUCT_ID",
      "cantidad": 2
    },
    {
      "producto": "PRODUCT_ID_2",
      "cantidad": 1
    }
  ],
  "metodoPago": "tarjeta",
  "descuento": 5.00,
  "impuestos": 4.50,
  "notas": "Cliente frecuente"
}
```

```bash
curl -X POST http://localhost:3000/api/ventas \
  -H "Content-Type: application/json" \
  -d @venta.json
```

**Respuesta:**
```json
{
  "exito": true,
  "mensaje": "Venta registrada exitosamente",
  "venta": {
    "numeroVenta": "V-20240118-123456",
    "total": 49.50,
    ...
  }
}
```

**Validaciones automáticas:**
- Verifica que los productos existan y estén activos
- Valida disponibilidad de stock
- Calcula automáticamente subtotales y total
- Genera número de venta único
- Actualiza el inventario automáticamente

### PUT /api/ventas/:id/cancelar
Cancelar una venta (revierte el inventario)

```bash
curl -X PUT http://localhost:3000/api/ventas/SALE_ID/cancelar
```

**Respuesta:**
```json
{
  "exito": true,
  "mensaje": "Venta cancelada exitosamente",
  "venta": { ... }
}
```

---

## 📊 Tablero de Control

### GET /api/tablero
Obtener dashboard con estadísticas generales

**Parámetros de consulta:**
- `periodo` (opcional): Días hacia atrás (default: 30)

```bash
curl "http://localhost:3000/api/tablero?periodo=30"
```

**Respuesta:**
```json
{
  "exito": true,
  "periodo": "Últimos 30 días",
  "resumen": {
    "ventas": {
      "total": 150,
      "ingresoTotal": 7500.50,
      "promedio": 50.00
    },
    "inventario": {
      "totalProductos": 45,
      "productosStockBajo": 3,
      "valorTotal": 15000.00
    }
  },
  "detalles": {
    "productosMasVendidos": [
      {
        "_id": "Café Premium",
        "cantidadVendida": 120,
        "ingresoGenerado": 1918.80
      }
    ],
    "ventasPorMetodoPago": [
      {
        "_id": "tarjeta",
        "cantidad": 85,
        "total": 4250.25
      },
      {
        "_id": "efectivo",
        "cantidad": 65,
        "total": 3250.25
      }
    ],
    "ventasPorDia": [
      {
        "_id": "2024-01-18",
        "cantidad": 12,
        "total": 600.00
      }
    ]
  }
}
```

### GET /api/tablero/reporte-ventas
Generar reporte de ventas por período

**Parámetros de consulta:**
- `fechaInicio` (requerido): Fecha inicio (ISO 8601)
- `fechaFin` (requerido): Fecha fin (ISO 8601)

```bash
curl "http://localhost:3000/api/tablero/reporte-ventas?fechaInicio=2024-01-01&fechaFin=2024-01-31"
```

**Respuesta:**
```json
{
  "exito": true,
  "periodo": {
    "inicio": "2024-01-01",
    "fin": "2024-01-31"
  },
  "resumen": {
    "totalVentas": 150,
    "ingresoTotal": 7500.50,
    "descuentosTotal": 250.00,
    "impuestosTotal": 750.05,
    "promedioVenta": 50.00
  },
  "ventas": [...]
}
```

---

## 🔍 Códigos de Estado HTTP

- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado exitosamente
- `400 Bad Request` - Datos inválidos o faltantes
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

## 💡 Consejos de Uso

1. **Búsquedas**: Usa parámetros de consulta para filtrar resultados
2. **Fechas**: Usa formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
3. **Paginación**: Los listados limitan resultados automáticamente
4. **Validación**: Todos los endpoints validan los datos de entrada
5. **Inventario**: Las ventas actualizan el stock automáticamente
6. **Cancelaciones**: Cancelar una venta restaura el inventario

## 🛡️ Manejo de Errores

Todos los errores incluyen:
- Campo `exito: false`
- Mensaje descriptivo en español
- Código HTTP apropiado

Ejemplo:
```json
{
  "exito": false,
  "mensaje": "Stock insuficiente para Café Premium. Disponible: 5"
}
```
