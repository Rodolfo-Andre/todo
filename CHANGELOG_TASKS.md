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
- **UploadAttachmentCommand**: Subir archivos adjuntos a tareas
- **DeleteAttachmentCommand**: Eliminar archivos adjuntos

#### Queries (Lectura)
- **GetTasksByProjectQuery**: Obtener tareas por proyecto con filtros (status, priority, search, assignedTo)
- **GetTaskByIdQuery**: Obtener detalle completo de una tarea (con comentarios, adjuntos e historial)
- **GetMyTasksQuery**: Obtener tareas asignadas al usuario actual
- **GetAttachmentsByTaskQuery**: Obtener archivos adjuntos de una tarea

#### Controller
- **TasksController**: API REST completa con 13 endpoints

### Frontend (Angular)

#### Componentes
- **TaskBoardComponent**: Vista Kanban con 4 columnas (Todo, In Progress, In Review, Done) y drag-and-drop mejorado
- **TaskListComponent**: Vista de tabla con paginación, filtros y CRUD completo
- **TaskDetailComponent**: Vista detallada con información, comentarios, historial y gestión de asignación
- **MyTasksComponent**: Vista personal de tareas asignadas al usuario actual

#### Servicios
- **TaskService**: Servicio HTTP completo para interactuar con la API (incluye upload/delete attachments)
- **TaskStore**: State management con Signals para manejo de estado reactivo (incluye attachments)

#### Rutas
- `/projects/:id/board` - Tablero Kanban del proyecto
- `/projects/:id/list` - Lista de tareas del proyecto
- `/tasks/:id` - Detalle de tarea
- `/my-tasks` - Mis tareas (tareas asignadas al usuario)

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

src/TaskManagement.Application/Common/Interfaces/
└── IFileStorageService.cs (nuevo)

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
│   ├── AddComment/
│   │   ├── AddCommentCommand.cs
│   │   ├── AddCommentHandler.cs
│   │   └── AddCommentValidator.cs
│   ├── UploadAttachment/
│   │   ├── UploadAttachmentCommand.cs (nuevo)
│   │   └── UploadAttachmentHandler.cs (nuevo)
│   └── DeleteAttachment/
│       ├── DeleteAttachmentCommand.cs (nuevo)
│       └── DeleteAttachmentHandler.cs (nuevo)
└── Queries/
    ├── GetTasksByProject/
    │   ├── GetTasksByProjectQuery.cs
    │   └── GetTasksByProjectHandler.cs
    ├── GetTaskById/
    │   ├── GetTaskByIdQuery.cs
    │   └── GetTaskByIdHandler.cs
    ├── GetMyTasks/
    │   ├── GetMyTasksQuery.cs
    │   └── GetMyTasksHandler.cs
    └── GetAttachmentsByTask/
        ├── GetAttachmentsByTaskQuery.cs (nuevo)
        └── GetAttachmentsByTaskHandler.cs (nuevo)

src/TaskManagement.Infrastructure/Services/
└── FileStorageService.cs (nuevo)

src/TaskManagement.Api/Controllers/
└── TasksController.cs (actualizado)
```

### Frontend
```
frontend/src/app/
├── core/models/
│   └── task.model.ts (actualizado)
├── features/tasks/
│   ├── task.service.ts (actualizado - métodos attachments)
│   ├── task.store.ts (actualizado - métodos attachments)
│   ├── task-board.component.ts (fix drag-and-drop)
│   ├── task-list.component.ts
│   ├── task-detail.component.ts (mejorado - sección attachments)
│   └── my-tasks.component.ts (nuevo)
├── layout/main-layout/
│   └── main-layout.component.ts (sidebar actualizado)
└── app.routes.ts (actualizado)
```

---

## Archivos Modificados

### Backend
- `src/TaskManagement.Application/Common/Interfaces/IUnitOfWork.cs` - Ya incluía repositorios de Tasks
- `src/TaskManagement.Application/TaskManagement.Application.csproj` - Agregado FrameworkReference Microsoft.AspNetCore.App
- `src/TaskManagement.Infrastructure/DependencyInjection.cs` - Registrado IFileStorageService
- `src/TaskManagement.Api/Controllers/TasksController.cs` - Agregados endpoints de attachments

### Frontend
- `frontend/src/app/core/models/task.model.ts` - Agregadas propiedades faltantes
- `frontend/src/app/app.routes.ts` - Agregadas rutas para Board, List y My Tasks
- `frontend/src/app/features/projects/project-detail.component.ts` - Agregados botones de navegación a Board/List
- `frontend/src/app/features/tasks/task-board.component.ts` - Fix drag-and-drop: handlers en columnas, visual feedback
- `frontend/src/app/features/tasks/task.service.ts` - Agregados métodos uploadAttachment, getAttachments, deleteAttachment
- `frontend/src/app/features/tasks/task.store.ts` - Agregados métodos uploadAttachment, deleteAttachment
- `frontend/src/app/features/tasks/task-detail.component.ts` - Agregada sección de attachments con upload y lista
- `frontend/src/app/layout/main-layout/main-layout.component.ts` - Agregado link "My Tasks" en sidebar

---

## Decisiones Técnicas

1. **Soft Delete**: Las tareas se eliminan lógicamente (DeletedAt) para preservar datos
2. **Historial completo**: Cada cambio de estado, asignación o edición genera un registro en TaskHistory
3. **State Management**: Se utilizó Signals (Angular 17+) para manejo de estado reactivo
4. **Drag-and-drop**: Implementado nativo sin dependencias externas
5. **Validación**: FluentValidation en backend, validación por defecto en frontend
6. **Patrón CQRS**: Commands y Queries separados siguiendo la arquitectura del proyecto
7. **File Storage**: Archivos guardados en directorio local /Uploads con estructura por taskId
8. **Clean Architecture**: IFileStorageService en Application, implementación en Infrastructure

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
| POST | `/api/tasks/{taskId}/attachments` | Subir archivo adjunto |
| GET | `/api/tasks/{taskId}/attachments` | Obtener archivos adjuntos |
| DELETE | `/api/tasks/attachments/{attachmentId}` | Eliminar archivo adjunto |

---

## Última Actualización (2026-07-28)

### Fase 6: Attachments (Archivos Adjuntos)

#### Backend
- **IFileStorageService**: Interfaz para manejo de archivos
- **FileStorageService**: Implementación para guardado local en /Uploads
- **UploadAttachmentCommand**: Subir archivos con validación
- **DeleteAttachmentCommand**: Eliminar archivos del storage y BD
- **GetAttachmentsByTaskQuery**: Obtener lista de adjuntos
- **TasksController**: 3 nuevos endpoints para attachments
- **DependencyInjection**: Registro del FileStorageService

#### Frontend
- **TaskService**: Métodos uploadAttachment, getAttachments, deleteAttachment
- **TaskStore**: Métodos uploadAttachment, deleteAttachment con state management
- **TaskDetailComponent**: Sección de attachments con upload y lista
- **FileUploadModule**: Integrado PrimeNG para upload de archivos

### Fix: Drag-and-drop en Task Board
- **Problema**: El drop solo funcionaba sobre otras tareas, no sobre columnas vacías
- **Solución**: Se movieron los handlers `(dragover)` y `(drop)` al contenedor de la columna
- **Mejoras visuales**:
  - Highlight de columna al hacer drag sobre ella
  - Feedback visual con ring y fondo cambiado
  - Mensaje "Drop here" en columnas vacías durante drag
- **Archivos modificados**: `task-board.component.ts`

### Nuevos Componentes
- **MyTasksComponent**: Vista personal de tareas asignadas al usuario actual
- **Ruta**: `/my-tasks`
- **Sidebar**: Agregado link "My Tasks" en la navegación

---

## Pendientes / Mejoras Futuras

1. **Notificaciones**: Enviar notificaciones al asignar o comentar tareas
2. **Filtros avanzados**: Agregar filtros por fecha, etiquetas y miembros
3. **Vista de calendario**: Mostrar tareas en vista de calendario
4. **Exportar**: Exportar tareas a CSV/PDF
5. **Bulk actions**: Acciones masivas (cambiar estado, asignar múltiples)
6. **Subtareas**: Soporte para subtareas o checklists
7. **Tiempo registrado**: Tracking de tiempo en tareas
8. **File serving**: Implementar descarga y preview de archivos

---

## Estado

✅ Backend compilado exitosamente  
✅ Frontend compilado exitosamente  
✅ Integración completa con arquitectura existente  
✅ Patrones y convenciones mantenidos  
