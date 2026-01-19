# 👨‍💻 Guía de Desarrollo - IQpanda Core System

## 🚀 Inicio Rápido

### Prerrequisitos

- **Node.js**: v24.13.0 o superior ([Descargar](https://nodejs.org/))
- **MongoDB**: v6.0 o superior ([Descargar](https://www.mongodb.com/try/download/community))
- **Git**: Para control de versiones

### Instalación Inicial

```bash
# 1. Clonar el repositorio
git clone https://github.com/fatlop/iqpanda-core-system.git
cd iqpanda-core-system

# 2. Asegurar la versión correcta de Node.js
node --version  # Debe mostrar v24.13.0 o superior

# 3. Instalar todas las dependencias (backend + frontend)
npm install

# 4. Configurar variables de entorno
cp .env.example .env

# 5. Editar .env con tus valores
nano .env  # o usa tu editor favorito

# 6. Asegurar que MongoDB esté corriendo
# Si usas MongoDB local:
sudo systemctl start mongod  # Linux
# o
brew services start mongodb-community  # macOS

# 7. ¡Iniciar el proyecto!
npm run dev
```

### Verificar que todo funciona

Después de `npm run dev`, deberías ver:

```
✓ Conectado exitosamente a la base de datos
Servidor IQpanda Core System escuchando en puerto 3000
Ambiente: development

VITE v5.x.x ready in xxx ms
➜ Local: http://localhost:5173/
```

Abre tu navegador en:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

## 📝 Scripts Disponibles

### Desarrollo

```bash
# Correr todo el proyecto (backend + frontend)
npm run dev

# Solo backend
npm run dev:server

# Solo frontend
npm run dev:client
```

### Producción

```bash
# Build completo
npm run build

# Iniciar en producción
npm start

# o con variable de entorno
npm run start:prod
```

### Testing

```bash
# Correr todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Coverage report
npm run test:coverage
```

### Code Quality

```bash
# Lint backend
npm run lint

# Lint frontend
npm run lint:client

# Lint todo
npm run lint:all

# Format código backend
npm run format

# Format código frontend
npm run format:client

# Format todo
npm run format:all
```

### Utilidades

```bash
# Limpiar builds y node_modules
npm run clean

# Instalación fresca (clean + install)
npm run fresh
```

## 🗂️ Estructura de Trabajo

### Crear una nueva feature

```bash
# 1. Crear rama desde main
git checkout main
git pull origin main
git checkout -b feature/nombre-descriptivo

# 2. Desarrollar
npm run dev
# Hacer cambios...

# 3. Verificar calidad
npm run lint:all
npm test

# 4. Commit
git add .
git commit -m "Descripción clara del cambio"

# 5. Push y crear PR
git push origin feature/nombre-descriptivo
```

## 🔧 Trabajar con el Backend

### Agregar un nuevo endpoint

1. **Crear el modelo** (si es necesario) en `src/models/`
2. **Crear el controlador** en `src/controllers/`
3. **Crear la ruta** en `src/routes/`
4. **Registrar la ruta** en `src/index.ts`
5. **Documentar** en `API_DOCUMENTATION.md`

Ejemplo:

```typescript
// src/controllers/example.controller.ts
import { Request, Response } from 'express';
import { logger } from '../config/logger';

export const getExample = async (req: Request, res: Response) => {
  try {
    // Lógica aquí
    res.json({
      exito: true,
      mensaje: 'Todo bien',
      datos: { ... }
    });
  } catch (error: any) {
    logger.error('Error en ejemplo:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al procesar solicitud'
    });
  }
};
```

### Trabajar con MongoDB

```bash
# Conectar a MongoDB shell
mongosh

# Usar la base de datos
use iqpanda-core

# Ver colecciones
show collections

# Ver productos
db.products.find().pretty()

# Ver ventas
db.sales.find().limit(5).pretty()
```

## 🎨 Trabajar con el Frontend

### Agregar una nueva página

1. **Crear componente** en `client/src/pages/`
2. **Agregar ruta** en `client/src/App.tsx`
3. **Crear componentes necesarios** en `client/src/components/`

Ejemplo:

```typescript
// client/src/pages/NewPage.tsx
import { Card } from "@/components/ui/card";

export default function NewPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nueva Página</h1>
      <Card>
        {/* Contenido */}
      </Card>
    </div>
  );
}
```

### Consumir API del backend

```typescript
// client/src/lib/api.ts
export const api = {
  async getPanda() {
    const res = await fetch('/api/ia/panda');
    return res.json();
  }
};

// Usar en componente
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

function Component() {
  const { data, isLoading } = useQuery({
    queryKey: ['panda'],
    queryFn: api.getPanda
  });
  
  if (isLoading) return <div>Cargando...</div>;
  
  return <div>{data.mensaje}</div>;
}
```

## 🧪 Testing

### Escribir un test

```typescript
// src/__tests__/controllers/inventory.test.ts
import { getAllProducts } from '../../controllers/inventory.controller';

describe('Inventory Controller', () => {
  it('should return all products', async () => {
    // Mock request
    const req = {} as any;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    } as any;
    
    await getAllProducts(req, res);
    
    expect(res.json).toHaveBeenCalled();
  });
});
```

## 🐛 Debugging

### Backend

```bash
# Correr con debugger
node --inspect dist/index.js

# Ver logs detallados
LOG_LEVEL=debug npm run dev:server
```

### Frontend

- Usa React DevTools en el navegador
- Console.log estratégicos
- TanStack Query DevTools (ya incluido)

## 🔍 Troubleshooting

### Error: Cannot find module

```bash
npm run fresh
```

### Error: MongoDB connection failed

```bash
# Verificar que MongoDB está corriendo
sudo systemctl status mongod

# Verificar MONGODB_URI en .env
cat .env | grep MONGODB_URI
```

### Error: Port 3000 already in use

```bash
# Cambiar puerto en .env
PORT=3001

# o matar el proceso
lsof -ti:3000 | xargs kill -9
```

### Frontend no carga

```bash
# Limpiar cache de Vite
cd client
rm -rf node_modules/.vite
npm run dev
```

## 📚 Recursos Útiles

- [Documentación Express](https://expressjs.com/)
- [Documentación React](https://react.dev/)
- [Documentación MongoDB](https://www.mongodb.com/docs/)
- [Documentación TypeScript](https://www.typescriptlang.org/docs/)
- [Guía Mongoose](https://mongoosejs.com/docs/guide.html)

## 💡 Tips

1. **Usa el modo watch para tests** mientras desarrollas
2. **Commits frecuentes** con mensajes descriptivos
3. **Revisa los logs** cuando algo no funciona
4. **Documenta código complejo** con comentarios
5. **Pregunta si no entiendes algo** - mejor preguntar que romper

## 🤝 Ayuda

¿Problemas? 
- Revisa los logs en la consola
- Verifica las variables de entorno
- Consulta la documentación
- Abre un issue en GitHub

---

*Happy coding! 🐼*
