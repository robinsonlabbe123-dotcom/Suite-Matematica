# CRM liviano (Suite Matematica)

Aplicación web simple para gestionar contactos, oportunidades y actividades con persistencia local. Pensada como MVP usable para pymes.

## Stack elegido
- **React + Vite + TypeScript (Opción B)**: elimina la complejidad de un backend y usa `localStorage` para persistir. Es rápido de arrancar, fácil de desplegar como sitio estático y suficiente para un MVP. Se deja preparado el contenedor de datos para conectar autenticación o una API en el futuro.

## Estructura del proyecto
```
├─ index.html
├─ package.json
├─ src
│  ├─ App.tsx                # Layout y navegación principal
│  ├─ types.ts               # Modelos de datos
│  ├─ hooks/useLocalStorage  # Persistencia local
│  ├─ context/DataContext.tsx# Estado global, seed y CRUD
│  ├─ components
│  │  ├─ ContactsSection.tsx
│  │  ├─ PipelineSection.tsx
│  │  └─ ActivitiesSection.tsx
│  └─ styles/index.css       # Estilos base
```

## Cómo correr
1. Instalar dependencias
   ```bash
   npm install
   ```
2. Ejecutar en modo desarrollo
   ```bash
   npm run dev
   ```
   Abrir la URL indicada por Vite (por defecto http://localhost:5173).
3. Build opcional
   ```bash
   npm run build
   ```

## Uso de la app
- **Contactos**: CRUD completo con validación de nombre y correo, búsqueda con debounce, agrupación por empresa o etiqueta, chips de etiquetas con autocompletado implícito al reusar etiquetas previas, exportación CSV y panel de detalle.
- **Pipeline**: Kanban por estado (Nuevo, En progreso, Ganado, Perdido) con arrastrar/soltar o cambio desde un selector. Totales por columna y total general (excluye "perdido"). Oportunidades vinculadas a un contacto.
- **Actividades**: Registro asociado a contacto u oportunidad (heredando contacto), tipos (llamada/correo/reunión/tarea), filtros por tipo, fecha, contacto u oportunidad y timeline descendente.
- **Persistencia**: Todos los datos viven en `localStorage` y se cargan con datos de demostración la primera vez. Hook listo para reemplazar por autenticación o backend futuro.

## Checklist de criterios de aceptación
- [x] Crear/editar/eliminar/buscar contactos
- [x] Agrupar/filtrar contactos por empresa y etiqueta
- [x] Crear oportunidades y verlas en pipeline por estado
- [x] Cambiar estado de una oportunidad (drag & drop o selector)
- [x] Registrar actividades vinculadas y filtrarlas por tipo/fecha
- [x] Datos persisten al recargar
- [x] Exportar contactos a CSV
