# CHANGELOG_TASKS.md - Tasks Feature

## Resumen

Implementación completa de la funcionalidad de **Tasks** incluyendo backend (.NET) y frontend (Angular).

---

## Funcionalidades Implementadas

### Backend (.NET)

#### Commands (Escritura)
- **CreateTaskCommand**: Crear tareas con título, descripción, prioridad, story points, fecha límite y tags
- **UpdateTaskCommand**: Actualizar información de tareas existentes
- **DeleteTaskCommand**: Soft delete de tareas
- **ChangeStatusCommand**: Cambiar estado (Todo, In Progress, In Review, Done, Cancelled)
- **AssignTaskCommand**: Asignar/desasignar tareas a usuarios
- **ReorderTaskCommand**: Reordenar tareas y cambiar estado (para drag-and-drop)
- **AddCommentCommand**: Agregar comentarios a tareas

#### Queries (Lectura)
- **GetTasksByProjectQuery**: Obtener tareas por proyecto con filtros (status, priority, search, assignedTo)
- **GetTaskByIdQuery**: Obtener detalle completo de una tarea (con comentarios, adjuntos e historial)
- **GetMyTasksQuery**: Obtener tareas asignadas al usuario actual

#### Controller
- **TasksController**: API REST completa con 10 endpoints

### Frontend (Angular)

#### Componentes
- **TaskBoardComponent**: Vista Kanban con 4 columnas (Todo, In Progress, In Review, Done) y drag-and-drop
- **TaskListComponent**: Vista de tabla con paginación, filtros y CRUD completo
- **TaskDetailComponent**: Vista detallada con información, comentarios, historial y gestión de asignación

#### Servicios
- **TaskService**: Servicio HTTP completo para interactuar con la API
- **TaskStore**: State management con Signals para manejo de estado reactivo

#### Rutas
- `/projects/:id/board` - Tablero Kanban del proyecto
- `/projects/:id/list` - Lista de tareas del proyecto
- `/tasks/:id` - Detalle de tarea

---

## Archivos Creados

### Backend
```
src/TaskManagement.Shared/DTOs/Tasks/
├── TaskDto.cs
├── CreateTaskRequest.cs
├── UpdateTaskRequest.cs
├── ChangeStatusRequest.cs
├── AssignTaskRequest.cs
├── ReorderTaskRequest.cs
└── AddCommentRequest.cs

src/TaskManagement.Application/Features/Tasks/
├── Commands/
│   ├── CreateTask/
│   │   ├── CreateTaskCommand.cs
│   │   ├── CreateTaskHandler.cs
│   │   └── CreateTaskValidator.cs
│   ├── UpdateTask/
│   │   ├── UpdateTaskCommand.cs
│   │   ├── UpdateTaskHandler.cs
│   │   └── UpdateTaskValidator.cs
│   ├── DeleteTask/
│   │   ├── DeleteTaskCommand.cs
│   │   └── DeleteTaskHandler.cs
│   ├── ChangeStatus/
│   │   ├── ChangeStatusCommand.cs
│   │   ├── ChangeStatusHandler.cs
│   │   └── ChangeStatusValidator.cs
│   ├── AssignTask/
│   │   ├── AssignTaskCommand.cs
│   │   └── AssignTaskHandler.cs
│   ├── ReorderTask/
│   │   ├── ReorderTaskCommand.cs
│   │   └── ReorderTaskHandler.cs
│   └── AddComment/
│       ├── AddCommentCommand.cs
│       ├── AddCommentHandler.cs
│       └── AddCommentValidator.cs
└── Queries/
    ├── GetTasksByProject/
    │   ├── GetTasksByProjectQuery.cs
    │   └── GetTasksByProjectHandler.cs
    ├── GetTaskById/
    │   ├── GetTaskByIdQuery.cs
    │   └── GetTaskByIdHandler.cs
    └── GetMyTasks/
        ├── GetMyTasksQuery.cs
        └── GetMyTasksHandler.cs

src/TaskManagement.Api/Controllers/
└── TasksController.cs
```

### Frontend
```
frontend/src/app/
├── core/models/
│   └── task.model.ts (actualizado)
├── features/tasks/
│   ├── task.service.ts
│   ├── task.store.ts
│   ├── task-board.component.ts
│   ├── task-list.component.ts
│   └── task-detail.component.ts (mejorado)
└── app.routes.ts (actualizado)
```

---

## Archivos Modificados

### Backend
- `src/TaskManagement.Application/Common/Interfaces/IUnitOfWork.cs` - Ya incluía repositorios de Tasks

### Frontend
- `frontend/src/app/core/models/task.model.ts` - Agregadas propiedades faltantes
- `frontend/src/app/app.routes.ts` - Agregadas rutas para Board y List
- `frontend/src/app/features/projects/project-detail.component.ts` - Agregados botones de navegación a Board/List
- `frontend/src/app/features/tasks/task-detail.component.ts` - Implementación completa

---

## Decisiones Técnicas

1. **Soft Delete**: Las tareas se eliminan lógicamente (DeletedAt) para preservar datos
2. **Historial completo**: Cada cambio de estado, asignación o edición genera un registro en TaskHistory
3. **State Management**: Se utilizó Signals (Angular 17+) para manejo de estado reactivo
4. **Drag-and-drop**: Implementado nativo sin dependencias externas
5. **Validación**: FluentValidation en backend, validación por defecto en frontend
6. **Patrón CQRS**: Commands y Queries separados siguiendo la arquitectura del proyecto

---

## Endpoints API

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/tasks` | Crear tarea |
| GET | `/api/tasks/project/{projectId}` | Obtener tareas por proyecto |
| GET | `/api/tasks/my` | Obtener mis tareas |
| GET | `/api/tasks/{id}` | Obtener detalle de tarea |
| PUT | `/api/tasks/{id}` | Actualizar tarea |
| DELETE | `/api/tasks/{id}` | Eliminar tarea |
| PATCH | `/api/tasks/{id}/status` | Cambiar estado |
| PATCH | `/api/tasks/{id}/assign` | Asignar tarea |
| PATCH | `/api/tasks/{id}/reorder` | Reordenar tarea |
| POST | `/api/tasks/{taskId}/comments` | Agregar comentario |

---

## Pendientes / Mejoras Futuras

1. **Adjuntos**: Implementar subida y gestión de archivos adjuntos
2. **Notificaciones**: Enviar notificaciones al asignar o comentar tareas
3. **Filtros avanzados**: Agregar filtros por fecha, etiquetas y miembros
4. **Vista de calendario**: Mostrar tareas en vista de calendario
5. **Exportar**: Exportar tareas a CSV/PDF
6. **Bulk actions**: Acciones masivas (cambiar estado, asignar múltiples)
7. **Subtareas**: Soporte para subtareas o checklists
8. **Tiempo registrado**: Tracking de tiempo en tareas

---

## Estado

✅ Backend compilado exitosamente  
✅ Frontend compilado exitosamente  
✅ Integración completa con arquitectura existente  
✅ Patrones y convenciones mantenidos  
