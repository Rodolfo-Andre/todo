# CHANGELOG_TASKS.md - TaskManagement

## Resumen

Implementación completa del sistema de gestión de tareas incluyendo backend (.NET) y frontend (Angular).

---

## Funcionalidades Implementadas

### Dashboard

#### Backend
- **GetDashboardDataQuery**: Query para obtener datos del dashboard (stats, charts, activity)
- **DashboardDto**: DTOs para estadísticas, gráficas y actividad reciente
- **DashboardController**: Endpoint `GET /api/dashboard`

#### Frontend
- **DashboardComponent**: Dashboard completo con:
  - Stats cards (Projects, Completed, In Progress, Overdue)
  - My Tasks summary
  - Doughnut chart: Tasks by Status
  - Bar chart: Tasks by Priority
  - Horizontal bar chart: Tasks by Member
  - Upcoming Deadlines list
  - Recent Activity feed
- **DashboardService**: Servicio HTTP para obtener datos del dashboard
- **Dashboard Models**: Interfaces TypeScript para datos del dashboard

---

### Notifications

#### Backend
- **NotificationDto**: DTOs para notificaciones (NotificationDto, CreateNotificationRequest, NotificationSummaryDto)
- **CreateNotificationCommand**: Crear notificaciones
- **MarkAsReadCommand**: Marcar notificación como leída
- **MarkAllAsReadCommand**: Marcar todas como leídas
- **DeleteNotificationCommand**: Eliminar notificación
- **GetNotificationsByUserQuery**: Obtener notificaciones del usuario
- **GetUnreadCountQuery**: Obtener cantidad de no leídas
- **NotificationsController**: API REST con 6 endpoints

#### Frontend
- **NotificationService**: Servicio HTTP para CRUD de notificaciones
- **NotificationStore**: State management con Signals
- **NotificationListComponent**: Lista completa con:
  - Sección de no leídas (highlight azul)
  - Sección de leídas (gray)
  - Mark as Read individual
  - Mark All as Read
  - Delete con confirmación
  - Iconos por tipo de notificación
- **Notification Model**: Interfaces TypeScript
- **MainLayout**: Bell icon con unread count en sidebar y header

#### Endpoints
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/notifications` | Obtener notificaciones |
| GET | `/api/notifications/unread-count` | Obtener cantidad no leídas |
| POST | `/api/notifications` | Crear notificación |
| PATCH | `/api/notifications/{id}/read` | Marcar como leída |
| PATCH | `/api/notifications/read-all` | Marcar todas como leídas |
| DELETE | `/api/notifications/{id}` | Eliminar notificación |

---

### Tasks (Fase 5-6)

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
- **GetDashboardDataQuery**: Obtener datos del dashboard (stats, charts, activity)

#### Controllers
- **TasksController**: API REST completa con 13 endpoints
- **DashboardController**: Endpoint para datos del dashboard

### Frontend (Angular)

#### Componentes
- **DashboardComponent**: Dashboard completo con stats, gráficas y actividad reciente
- **TaskBoardComponent**: Vista Kanban con 4 columnas (Todo, In Progress, In Review, Done) y drag-and-drop mejorado
- **TaskListComponent**: Vista de tabla con paginación, filtros y CRUD completo
- **TaskDetailComponent**: Vista detallada con información, comentarios, historial y gestión de asignación
- **MyTasksComponent**: Vista personal de tareas asignadas al usuario actual

#### Servicios
- **DashboardService**: Servicio HTTP para obtener datos del dashboard
- **TaskService**: Servicio HTTP completo para interactuar con la API (incluye upload/delete attachments)
- **TaskStore**: State management con Signals para manejo de estado reactivo (incluye attachments)

#### Models
- **Dashboard Models**: Interfaces TypeScript (DashboardData, DashboardStats, TaskByStatus, etc.)
- **Task Models**: Interfaces TypeScript (Task, TaskDetail, TaskComment, TaskAttachment)

#### Rutas
- `/dashboard` - Dashboard principal (ruta por defecto)
- `/projects/:id/board` - Tablero Kanban del proyecto
- `/projects/:id/list` - Lista de tareas del proyecto
- `/tasks/:id` - Detalle de tarea
- `/my-tasks` - Mis tareas (tareas asignadas al usuario)

---

## Archivos Creados

### Backend
```
src/TaskManagement.Shared/DTOs/
├── Tasks/
│   ├── TaskDto.cs
│   ├── CreateTaskRequest.cs
│   ├── UpdateTaskRequest.cs
│   ├── ChangeStatusRequest.cs
│   ├── AssignTaskRequest.cs
│   ├── ReorderTaskRequest.cs
│   └── AddCommentRequest.cs
├── Dashboard/
│   └── DashboardDto.cs
└── Notifications/
    └── NotificationDto.cs (nuevo)

src/TaskManagement.Application/Common/Interfaces/
└── IFileStorageService.cs

src/TaskManagement.Application/Features/
├── Tasks/
│   ├── Commands/
│   │   ├── CreateTask/
│   │   ├── UpdateTask/
│   │   ├── DeleteTask/
│   │   ├── ChangeStatus/
│   │   ├── AssignTask/
│   │   ├── ReorderTask/
│   │   ├── AddComment/
│   │   ├── UploadAttachment/
│   │   └── DeleteAttachment/
│   └── Queries/
│       ├── GetTasksByProject/
│       ├── GetTaskById/
│       ├── GetMyTasks/
│       └── GetAttachmentsByTask/
├── Dashboard/
│   └── GetDashboardData/
└── Notifications/ (nuevo)
    ├── Commands/
    │   ├── CreateNotification/
    │   ├── MarkAsRead/
    │   ├── MarkAllAsRead/
    │   └── DeleteNotification/
    └── Queries/
        ├── GetNotificationsByUser/
        └── GetUnreadCount/

src/TaskManagement.Infrastructure/Services/
└── FileStorageService.cs

src/TaskManagement.Api/Controllers/
├── TasksController.cs
├── DashboardController.cs
└── NotificationsController.cs (nuevo)
```

### Frontend
```
frontend/src/app/
├── core/models/
│   ├── task.model.ts
│   ├── dashboard.model.ts
│   └── notification.model.ts (nuevo)
├── features/
│   ├── dashboard/
│   │   ├── dashboard.component.ts
│   │   └── dashboard.service.ts
│   ├── notifications/ (nuevo)
│   │   ├── notification-list.component.ts (actualizado)
│   │   ├── notification.service.ts (nuevo)
│   │   └── notification.store.ts (nuevo)
│   └── tasks/
│       ├── task.service.ts
│       ├── task.store.ts
│       ├── task-board.component.ts
│       ├── task-list.component.ts
│       ├── task-detail.component.ts
│       └── my-tasks.component.ts
├── layout/main-layout/
│   └── main-layout.component.ts (actualizado - notification bell)
└── app.routes.ts
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
| **Dashboard** | | |
| GET | `/api/dashboard` | Obtener datos del dashboard |
| **Tasks** | | |
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

### Fase 9: Profile (Gestión de Perfil)

#### Backend
- **ProfileDto**: DTOs para perfil de usuario (ProfileDto, UpdateProfileRequest, ChangePasswordRequest)
- **GetProfileQuery**: Obtener perfil del usuario actual
- **UpdateProfileCommand**: Actualizar nombre, email y avatar del usuario
- **ChangePasswordCommand**: Cambiar contraseña con validación de contraseña actual
- **ProfileController**: API REST con 3 endpoints

#### Frontend
- **ProfileComponent**: Página de perfil completa con:
  - Tarjeta de perfil con avatar, nombre, email, roles y fecha de registro
  - Formulario de edición de perfil (nombre, email, avatar URL)
  - Formulario de cambio de contraseña con validación
  - Información de cuenta (username, estado, ID)
- **ProfileService**: Servicio HTTP para obtener, actualizar perfil y cambiar contraseña
- **Profile Store**: Signal para estado reactivo del perfil

#### Endpoints
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/profile` | Obtener perfil del usuario actual |
| PUT | `/api/profile` | Actualizar perfil |
| POST | `/api/profile/change-password` | Cambiar contraseña |

---

## Pendientes / Mejoras Futuras

1. **Project Create/Edit**: Formulario para crear y editar proyectos
2. **Project Settings/Members**: Configuración de proyecto y gestión de miembros
3. **Audit Log**: Log de auditoría del sistema (solo admin)
4. **Filtros avanzados**: Agregar filtros por fecha, etiquetas y miembros
5. **Vista de calendario**: Mostrar tareas en vista de calendario
6. **Exportar**: Exportar tareas a CSV/PDF
7. **Bulk actions**: Acciones masivas (cambiar estado, asignar múltiples)
8. **Subtareas**: Soporte para subtareas o checklists
9. **Tiempo registrado**: Tracking de tiempo en tareas
10. **File serving**: Implementar descarga y preview de archivos

---

## Estado

✅ Backend compilado exitosamente  
✅ Frontend compilado exitosamente  
✅ Integración completa con arquitectura existente  
✅ Patrones y convenciones mantenidos  
