# 🧠 Guía del Orquestador - IQPanda Core System

## Filosofía

> **"Aquí las inteligencias conviven, no se devoran."**

El Orquestador permite que los demos compartan contexto útil sin contaminar datos. Es un **traductor semántico**, no un bus de datos libre.

---

## 📊 Conceptos Core

### Ritual Logs (Telemetría)
- **Propósito**: Observabilidad operativa
- **Retención**: 30 días (luego se compactan)
- **Qué registra**: Interacciones, latencia, resultados
- **Qué NO registra**: Prompts completos, respuestas IA, datos de negocio

### Soul Logs (Evolución)
- **Propósito**: Eventos significativos de usuario
- **Retención**: Permanente (bajo volumen)
- **Qué registra**: Cambios de nivel, hitos, transformaciones
- **Qué NO registra**: Cada acción individual

### User Activity Snapshots
- **Propósito**: Clasificación de perfiles
- **Actualización**: Diaria (via cron)
- **Contenido**: Agregados de actividad por demo
- **Uso**: Input para clasificación de perfiles

---

## 🔧 Cómo Usar desde un Demo

### 1. Loguear una Interacción (Ritual)

```typescript
import { LoggerService } from '../services/logger.service';

const logger = new LoggerService();

// Al inicio de una operación
const startTime = Date.now();

try {
  // ... lógica del demo ...
  
  // Al finalizar exitosamente
  await logger.logRitual({
    user_id: 'user-uuid-here',
    demo: 'diagnostico_mecanico',
    ritual_type: 'diagnostico_completo',
    outcome: 'completed',
    latency_ms: Date.now() - startTime,
    metadata: {
      vehicle_type: 'sedan',
      symptoms_count: 3
    }
  });
} catch (error) {
  // En caso de error
  await logger.logRitual({
    user_id: 'user-uuid-here',
    demo: 'diagnostico_mecanico',
    ritual_type: 'diagnostico_completo',
    outcome: 'error',
    latency_ms: Date.now() - startTime,
    metadata: {
      error_type: error.message
    }
  });
}
```

### 2. Loguear un Evento Significativo (Soul)

```typescript
// Solo para eventos importantes (no cada acción)
await logger.logSoul({
  user_id: 'user-uuid-here',
  event_type: 'first_diagnostic_completed',
  metadata: {
    demo: 'diagnostico_mecanico',
    achievement: 'primer_diagnostico'
  }
});

// Ejemplos de eventos Soul válidos:
// - first_demo_completed
// - level_up
// - conversion_to_premium
// - milestone_reached
```

### 3. Consultar Contexto de Usuario

```typescript
import { Orchestrator } from '../services/orchestrator';

const orchestrator = new Orchestrator();

const context = await orchestrator.getContext('user-uuid-here', {
  requesting_demo: 'crm_inteligente',
  need: 'contexto_tecnico_usuario'
});

console.log(context);
// {
//   user_profile: 'tecnico_activo',
//   confidence: 0.85,
//   metadata: {
//     snapshots_count: 4,
//     most_active_demo: 'diagnostico_mecanico'
//   }
// }
```

### 4. Usar el Contexto en tu Demo

```typescript
// En el CRM, al mostrar recomendaciones personalizadas
if (context.user_profile === 'tecnico_activo' && context.confidence > 0.7) {
  // Mostrar features técnicos avanzados
  recommendations.push({
    type: 'technical_integration',
    message: 'Conecta tu taller con el CRM para seguimiento automático'
  });
} else if (context.user_profile === 'negocio_en_validacion') {
  // Enfoque en simplicidad y ROI
  recommendations.push({
    type: 'business_value',
    message: 'Empieza con 5 clientes clave para ver resultados rápidos'
  });
}
```

---

## 🎯 Perfiles Disponibles

| Perfil | Criterios | Uso Típico |
|--------|-----------|------------|
| `tecnico_activo` | 10+ interacciones en demos técnicos | Ofrecer integraciones avanzadas |
| `usuario_explorador` | 3+ demos diferentes, 5+ interacciones | Guiar hacia especialización |
| `negocio_en_validacion` | 5+ en demos de negocio, 15+ totales | Enfatizar ROI y casos de éxito |
| `cliente_listo_para_conversion` | 20+ totales, 10+ en negocio | Mostrar planes premium |
| `creativo_recurrente` | 8+ en demos creativos | Ofrecer servicios de diseño |

---

## 🚫 Qué NO Hacer

### ❌ NO consultar ritual_logs directamente
```typescript
// MAL
const logs = await supabase.from('ritual_logs').select('*').eq('user_id', userId);
```

### ✅ SÍ usar snapshots o métricas agregadas
```typescript
// BIEN
const snapshots = await supabase.from('user_activity_snapshots').select('*').eq('user_id', userId);
```

### ❌ NO compartir datos crudos entre demos
```typescript
// MAL
const customerData = await demoA.getAllCustomers(userId);
await demoB.useCustomerData(customerData);
```

### ✅ SÍ compartir clasificaciones
```typescript
// BIEN
const context = await orchestrator.getContext(userId, { requesting_demo: 'demoB', need: 'perfil_comercial' });
// demoB solo recibe: { user_profile: 'negocio_en_validacion', confidence: 0.8 }
```

---

## 🔄 Pipeline de Agregación

El sistema ejecuta automáticamente cada día a las 2 AM:

1. **Agregar métricas**: `ritual_logs` → `daily_demo_metrics`
2. **Crear snapshots**: Calcular `user_activity_snapshots` de últimos 30 días
3. **Podar logs**: Eliminar `ritual_logs` mayores a 30 días

**No requiere intervención manual.**

Para ejecutar manualmente (testing):
```bash
# Invocar Edge Function directamente
curl -X POST $SUPABASE_URL/functions/v1/aggregate-logs \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY"
```

**Nota:** Asegúrate de tener estas variables en tu entorno:
```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_ANON_KEY="your-anon-key"
```

---

## 📈 Monitoreo

### Ver métricas agregadas
```sql
SELECT * FROM daily_demo_metrics 
WHERE demo = 'diagnostico_mecanico' 
ORDER BY date DESC 
LIMIT 30;
```

### Ver snapshots de un usuario
```sql
SELECT * FROM user_activity_snapshots 
WHERE user_id = 'user-uuid-here';
```

### Ver distribución de perfiles
```sql
SELECT profile_classification, COUNT(*) 
FROM user_activity_snapshots 
GROUP BY profile_classification;
```

---

## 🐼 Reglas de Oro

1. **Logs no son memoria, son sedimento**: Se compactan o mueren
2. **Solo ENUM y SCORE cruzan fronteras**: Nunca datos crudos
3. **El Orquestador traduce, no copia**: Transformación semántica
4. **Agregación temprana es obligatoria**: No análisis de logs crudos
5. **Cada demo es una isla**: Solo el Orquestador construye puentes

---

## ❓ FAQ

**P: ¿Puedo agregar nuevos perfiles?**  
R: Sí, edita `classifyUser()` en `orchestrator.ts` con criterios explícitos.

**P: ¿Qué pasa si un usuario no tiene actividad?**  
R: Retorna perfil `usuario_explorador` con confianza 0.3.

**P: ¿Cómo testeo sin usuarios reales?**  
R: Inserta datos sintéticos en `ritual_logs`, luego ejecuta la agregación.

**P: ¿El pipeline puede fallar?**  
R: Sí, revisa logs de la Edge Function en Supabase Dashboard.

**P: ¿Cuánto cuesta Supabase?**  
R: Free tier cubre hasta 500MB y 50K usuarios activos.

---

**🚀 El Orquestador está listo. Ahora cada demo puede aprender sin ver.**
