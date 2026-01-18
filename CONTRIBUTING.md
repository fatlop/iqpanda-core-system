# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a IQpanda Core System! Este documento te guiará en el proceso.

## 🌟 Cómo Contribuir

### 1. Reportar Problemas

Si encuentras un bug o tienes una sugerencia:

1. Revisa si ya existe un issue similar
2. Crea un nuevo issue con:
   - Título claro y descriptivo
   - Descripción detallada del problema
   - Pasos para reproducir (si es un bug)
   - Comportamiento esperado vs actual
   - Capturas de pantalla si aplica

### 2. Proponer Nuevas Características

Para proponer una nueva característica:

1. Abre un issue describiendo:
   - El problema que resuelve
   - Cómo beneficia a los usuarios
   - Propuesta de implementación
2. Espera feedback antes de empezar a codificar

### 3. Enviar Pull Requests

#### Preparación

1. **Fork el repositorio**
```bash
git clone https://github.com/TU_USUARIO/iqpanda-core-system.git
cd iqpanda-core-system
```

2. **Crea una rama para tu feature**
```bash
git checkout -b feature/nombre-descriptivo
# o para bugs:
git checkout -b fix/nombre-del-bug
```

3. **Instala las dependencias**
```bash
npm install
```

#### Desarrollo

1. **Haz tus cambios**
   - Escribe código limpio y legible
   - Sigue las convenciones del proyecto
   - Añade comentarios cuando sea necesario

2. **Escribe tests**
   - Añade tests para nuevas funcionalidades
   - Asegúrate de que todos los tests pasen
```bash
npm test
```

3. **Verifica el código**
```bash
npm run lint
npm run format
```

4. **Compila el proyecto**
```bash
npm run build
```

#### Envío

1. **Commit tus cambios**
```bash
git add .
git commit -m "feat: añade nueva funcionalidad X"
```

Usa prefijos convencionales:
- `feat:` - Nueva característica
- `fix:` - Corrección de bug
- `docs:` - Cambios en documentación
- `style:` - Cambios de formato
- `refactor:` - Refactorización de código
- `test:` - Añadir o modificar tests
- `chore:` - Tareas de mantenimiento

2. **Push a tu fork**
```bash
git push origin feature/nombre-descriptivo
```

3. **Crea un Pull Request**
   - Título claro y descriptivo
   - Descripción detallada de los cambios
   - Referencias a issues relacionados
   - Screenshots si hay cambios visuales

## 📋 Estándares de Código

### TypeScript

- Usa tipos explícitos cuando sea posible
- Evita `any` excepto cuando sea absolutamente necesario
- Documenta funciones complejas

### Nombres

- Variables y funciones: `camelCase`
- Clases e interfaces: `PascalCase`
- Constantes: `UPPER_SNAKE_CASE`
- Nombres descriptivos en español para el dominio del negocio

### Estructura

```typescript
// ✅ Bueno
export const calcularTotalVenta = (items: ISaleItem[]): number => {
  return items.reduce((total, item) => total + item.subtotal, 0);
};

// ❌ Evitar
export const calc = (i: any): any => {
  return i.reduce((t: any, x: any) => t + x.s, 0);
};
```

### Mensajes y Textos

- Todos los mensajes al usuario en español
- Lenguaje claro y amigable
- Sin jerga técnica innecesaria

```typescript
// ✅ Bueno
mensaje: 'Stock insuficiente para Café Premium. Disponible: 5'

// ❌ Evitar
mensaje: 'InsufficientInventoryException: stock_level < requested_qty'
```

## 🧪 Testing

- Escribe tests para nuevas funcionalidades
- Los tests deben ser claros y autoexplicativos
- Usa nombres descriptivos en español

```typescript
describe('Gestión de Ventas', () => {
  it('debe calcular el total correctamente', () => {
    // Test implementation
  });
  
  it('debe validar stock disponible', () => {
    // Test implementation
  });
});
```

## 📝 Documentación

- Actualiza el README si cambias funcionalidades principales
- Actualiza API_DOCUMENTATION.md para cambios en endpoints
- Añade comentarios para lógica compleja
- Documenta decisiones de diseño importantes

## ✅ Checklist para PR

Antes de enviar tu PR, verifica:

- [ ] El código compila sin errores
- [ ] Todos los tests pasan
- [ ] Se añadieron tests para nuevas funcionalidades
- [ ] El código sigue los estándares del proyecto
- [ ] La documentación está actualizada
- [ ] Los mensajes de commit son claros
- [ ] No hay archivos innecesarios (node_modules, .env, etc.)

## 🎯 Áreas de Contribución

Estamos especialmente interesados en:

### Alta Prioridad
- Autenticación y autorización de usuarios
- Mejoras en reportes y analytics
- Optimización de performance
- Tests adicionales

### Media Prioridad
- Exportación de datos (Excel, PDF)
- Notificaciones automáticas
- Dashboard web/frontend
- Integración con APIs de pago

### Ideas Bienvenidas
- Módulo de clientes y proveedores
- Aplicación móvil
- Generación de facturas
- Gestión de múltiples sucursales

## 🐛 Reportar Problemas de Seguridad

Si encuentras una vulnerabilidad de seguridad, **NO** abras un issue público. En su lugar:

1. Envía un email a [email de contacto]
2. Describe el problema en detalle
3. Espera respuesta antes de hacer público

## 📞 Contacto

¿Tienes preguntas? 

- Abre un issue con la etiqueta `question`
- Contacta al equipo de IQpanda Tecnovador

## 📄 Licencia

Al contribuir, aceptas que tus contribuciones se licencien bajo la misma licencia del proyecto (MIT).

---

¡Gracias por ayudar a hacer IQpanda Core System mejor para todos! 🐼
