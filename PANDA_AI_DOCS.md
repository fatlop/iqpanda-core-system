# 🧠 IQpanda AI - Documentación de Funciones Inteligentes

## 🐼 Panda AI - Tu Asesor Virtual Inteligente

Panda AI es un sistema de inteligencia artificial que analiza automáticamente tu negocio y te proporciona insights accionables para tomar mejores decisiones.

### GET /api/ia/panda

Obtiene todos los insights inteligentes generados por Panda AI.

**Respuesta:**
```json
{
  "exito": true,
  "mensaje": "🐼 Panda AI ha analizado tu negocio",
  "totalInsights": 4,
  "insights": [
    {
      "tipo": "prediccion",
      "prioridad": "media",
      "titulo": "🔮 Predicción para hoy",
      "mensaje": "Basándome en los últimos 30 días, hoy podrías vender aproximadamente $1,250.50 con alrededor de 15 transacciones.",
      "datos": {
        "ventaEstimada": 1250.50,
        "transaccionesEstimadas": 15,
        "confianza": "alta"
      }
    },
    {
      "tipo": "alerta",
      "prioridad": "alta",
      "titulo": "Stock crítico: Café Premium",
      "mensaje": "¡Atención! A este ritmo de ventas, te quedarás sin 'Café Premium' en aproximadamente 2 días. Solo tienes 10 bolsas disponibles.",
      "accion": "Reabastecer Café Premium urgentemente",
      "impactoEstimado": "Evitarás perder aproximadamente 21 ventas"
    },
    {
      "tipo": "sugerencia",
      "prioridad": "media",
      "titulo": "Patrón de ventas por día detectado",
      "mensaje": "Noté que los Viernes vendes 45% más que los Lunes. ¿Qué tal si preparas más stock los días anteriores a Viernes?",
      "accion": "Optimizar preparación de inventario según día de la semana",
      "impactoEstimado": "Podrías reducir ventas perdidas y aumentar ingresos hasta $1,800 al mes"
    },
    {
      "tipo": "oportunidad",
      "prioridad": "alta",
      "titulo": "⭐ Producto Estrella Detectado",
      "mensaje": "'Café Premium' es tu producto más rentable. Ha generado $4,750.00 en el último mes (150 unidades vendidas).",
      "accion": "Considera crear promociones o combos con este producto",
      "impactoEstimado": "Podrías aumentar ventas hasta 25% con estrategia correcta"
    }
  ]
}
```

**Tipos de Insights:**
- **prediccion**: Proyecciones de ventas para el día actual
- **alerta**: Problemas críticos que requieren atención inmediata
- **sugerencia**: Recomendaciones para optimizar operaciones
- **oportunidad**: Oportunidades de crecimiento detectadas

**Prioridades:**
- **alta**: Requiere acción inmediata
- **media**: Importante pero no urgente
- **baja**: Informativo

---

## 💰 Smart Pricing - Precios Inteligentes

El sistema de Smart Pricing analiza la demanda, tendencias y patrones de venta para sugerir precios óptimos que maximicen tus ganancias sin perder clientes.

### GET /api/ia/precios

Obtiene sugerencias de precios para todos los productos activos.

**Respuesta:**
```json
{
  "exito": true,
  "mensaje": "💡 Smart Pricing ha analizado tus productos",
  "totalSugerencias": 3,
  "sugerencias": [
    {
      "productoId": "65abc123def456789",
      "nombreProducto": "Café Americano",
      "precioActual": 25.00,
      "precioSugerido": 28.75,
      "razon": "Alta demanda y creciente. Los clientes valoran mucho este producto.",
      "impactoEstimado": "+15% en margen sin perder clientes",
      "confianza": "alta",
      "detalles": {
        "demanda": "alta",
        "tendencia": "creciente"
      }
    },
    {
      "productoId": "65abc123def456790",
      "nombreProducto": "Pan Integral",
      "precioActual": 35.00,
      "precioSugerido": 29.75,
      "razon": "Baja demanda. Precio más competitivo podría aumentar ventas.",
      "impactoEstimado": "+30-40% en volumen de ventas estimado",
      "confianza": "media",
      "detalles": {
        "demanda": "baja",
        "tendencia": "decreciente"
      }
    }
  ]
}
```

### GET /api/ia/precios/:id

Obtiene sugerencia de precio para un producto específico.

**Parámetros:**
- `id`: ID del producto

**Ejemplo:**
```bash
curl http://localhost:3000/api/ia/precios/65abc123def456789
```

**Respuesta:**
```json
{
  "exito": true,
  "mensaje": "💡 Análisis de precio completado",
  "sugerencia": {
    "productoId": "65abc123def456789",
    "nombreProducto": "Café Americano",
    "precioActual": 25.00,
    "precioSugerido": 28.75,
    "razon": "Alta demanda y creciente. Los clientes valoran mucho este producto.",
    "impactoEstimado": "+15% en margen sin perder clientes",
    "confianza": "alta",
    "detalles": {
      "demanda": "alta",
      "tendencia": "creciente"
    }
  }
}
```

**Niveles de Demanda:**
- **alta**: Más de 50 unidades vendidas en 30 días
- **media**: Entre 20 y 50 unidades
- **baja**: Menos de 20 unidades

**Tendencias:**
- **creciente**: Aumento de +15% en ventas vs período anterior
- **estable**: Cambio entre -15% y +15%
- **decreciente**: Disminución de más del 15%

---

## 🔮 Predictor Financiero

El Predictor Financiero utiliza datos históricos para proyectar tus ventas futuras y te muestra cuánto más podrías ganar aplicando las sugerencias de Panda AI.

### GET /api/ia/proyeccion?dias=30

Genera una proyección financiera para los próximos días.

**Parámetros de Query:**
- `dias` (opcional): Número de días a proyectar (default: 30, máx: 365)

**Ejemplo:**
```bash
curl "http://localhost:3000/api/ia/proyeccion?dias=30"
```

**Respuesta:**
```json
{
  "exito": true,
  "mensaje": "🔮 Proyección financiera generada para los próximos 30 días",
  "proyeccion": {
    "periodo": {
      "inicio": "2024-01-18T00:00:00.000Z",
      "fin": "2024-02-17T00:00:00.000Z",
      "dias": 30
    },
    "escenarioActual": {
      "ventasEstimadas": 37500.00,
      "transaccionesEstimadas": 450,
      "crecimientoEstimado": 8.5,
      "riesgos": [
        "3 producto(s) con stock bajo podrían causar ventas perdidas"
      ]
    },
    "escenarioOptimizado": {
      "ventasEstimadas": 52500.00,
      "transaccionesEstimadas": 630,
      "crecimientoEstimado": 48.5,
      "gananciaExtra": 15000.00,
      "cambiosSugeridos": [
        {
          "tipo": "Inventario",
          "descripcion": "Reabastecer 3 producto(s) con stock bajo",
          "impacto": "+5% en ventas al evitar stock-outs"
        },
        {
          "tipo": "Marketing",
          "descripcion": "Implementar promociones estratégicas en días de baja demanda",
          "impacto": "+8% en ventas en días valle"
        },
        {
          "tipo": "Precios",
          "descripcion": "Aplicar sugerencias de Smart Pricing para productos clave",
          "impacto": "+12% en margen sin afectar volumen"
        },
        {
          "tipo": "Clientes",
          "descripcion": "Programa de lealtad para clientes frecuentes",
          "impacto": "+10% en frecuencia de compra"
        }
      ]
    },
    "confianza": "alta"
  }
}
```

**Niveles de Confianza:**
- **alta**: Más de 90 días de datos históricos
- **media**: Entre 30 y 90 días de datos
- **baja**: Menos de 30 días de datos

---

## 📊 Interpretación de Resultados

### Cómo Usar los Insights de Panda AI

1. **Revisa diariamente** los insights al inicio de tu jornada
2. **Prioriza alertas rojas** (prioridad alta) - actúa inmediatamente
3. **Planifica sugerencias** (prioridad media) - implementa en la semana
4. **Considera oportunidades** - evalúa para crecimiento a largo plazo

### Cómo Aplicar Smart Pricing

1. **Revisa las sugerencias** semanalmente
2. **Prueba cambios graduales** - no cambies todos los precios de golpe
3. **Monitorea el impacto** - observa cómo responden tus clientes
4. **Ajusta según necesites** - la IA aprende de tus cambios

### Cómo Interpretar la Proyección Financiera

**Escenario Actual:**
- Muestra dónde llegarás si todo sigue igual
- Identifica riesgos potenciales
- Te da un baseline para comparar

**Escenario Optimizado:**
- Muestra tu potencial máximo
- Lista cambios específicos a implementar
- Cuantifica el beneficio de cada cambio

**Ganancia Extra:**
- Es el dinero adicional que podrías ganar
- Representa la "oportunidad perdida" si no optimizas
- Motivación para implementar cambios

---

## 💡 Ejemplos de Uso Real

### Caso 1: Cafetería de Barrio

**Problema:** Ventas inconsistentes y productos que se echan a perder

**Solución con Panda AI:**
```bash
# Consultar insights
curl http://localhost:3000/api/ia/panda

# Resultado:
# - Detecta que los sábados venden 60% más
# - Alerta de stock bajo en pan dulce
# - Sugiere preparar más inventario viernes en la tarde
```

**Impacto:** +35% en ventas, -20% en desperdicio

### Caso 2: Tienda de Abarrotes

**Problema:** Precios no competitivos pero tampoco rentables

**Solución con Smart Pricing:**
```bash
# Ver sugerencias de precios
curl http://localhost:3000/api/ia/precios

# Aplicar cambios sugeridos:
# - Subir precio de productos estrella 10-15%
# - Bajar precio de productos de baja rotación 15%
# - Mantener precios competitivos en básicos
```

**Impacto:** +22% en margen de ganancia

### Caso 3: Boutique de Ropa

**Problema:** No saben cuánto invertir en nueva mercancía

**Solución con Predictor:**
```bash
# Proyección a 60 días
curl "http://localhost:3000/api/ia/proyeccion?dias=60"

# Decisión:
# - Escenario actual: $45,000 en ventas
# - Escenario optimizado: $63,000 en ventas
# - Inversión sugerida: $18,000 en inventario
# - ROI esperado: 100% en 60 días
```

**Impacto:** Decisión de inversión informada, +40% en ventas

---

## 🎯 Mejores Prácticas

### Frecuencia de Consulta

- **Panda AI**: Diario (al inicio del día)
- **Smart Pricing**: Semanal o cuando notes cambios en demanda
- **Proyección Financiera**: Mensual o antes de decisiones importantes

### Implementación de Sugerencias

1. **Empieza con una**: No implementes todo a la vez
2. **Mide el impacto**: Dale 1-2 semanas para ver resultados
3. **Itera**: Ajusta basándote en resultados
4. **Escala**: Cuando funcione, aplica a más productos/áreas

### Monitoreo de Resultados

```bash
# Antes de implementar cambios
curl http://localhost:3000/api/tablero > baseline.json

# Después de 2 semanas
curl http://localhost:3000/api/tablero > resultados.json

# Compara los resultados
diff baseline.json resultados.json
```

---

## 🚀 Próximas Funcionalidades IA

- 🎙️ **VoiceCommerce**: Ventas por comando de voz
- 📸 **VisionStock**: Conteo de inventario con cámara
- 📲 **WhatsApp AI**: Respuestas automáticas inteligentes
- 🌦️ **Weather Impact**: Ajustes por clima
- 🎮 **Gamificación**: Misiones y logros
- 🤖 **AutoPilot**: Sistema autónomo de gestión

---

## ❓ Preguntas Frecuentes

**P: ¿Qué tan precisa es la IA?**
R: Con 90+ días de datos, la precisión es del 85-90%. Mejora con más datos.

**P: ¿Puedo ignorar las sugerencias?**
R: ¡Claro! Son sugerencias, tú decides qué aplicar.

**P: ¿La IA aprende de mis decisiones?**
R: Sí, se adapta a tu negocio específico con el tiempo.

**P: ¿Funciona sin internet?**
R: No, las funciones de IA requieren conexión para el análisis.

**P: ¿Es seguro?**
R: Sí, todos los datos se procesan de forma segura y privada.

---

## 🐼 El Compromiso de Panda AI

> **"Panda AI nunca reemplaza tu intuición de negocio.  
> La complementa con datos que no puedes ver solo."**

- Siempre transparente en sus cálculos
- Nunca toma decisiones por ti
- Aprende constantemente de tu negocio
- Se adapta a tu estilo y necesidades
- Está aquí 24/7 para ayudarte

---

**¡El futuro de tu negocio comienza con Panda AI! 🐼🚀**
