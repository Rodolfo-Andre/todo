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
backend/TaskManagement.Shared/DTOs/
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

backend/TaskManagement.Application/Common/Interfaces/
└── IFileStorageService.cs

backend/TaskManagement.Application/Features/
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

backend/TaskManagement.Infrastructure/Services/
└── FileStorageService.cs

backend/TaskManagement.Api/Controllers/
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
- `backend/TaskManagement.Application/Common/Interfaces/IUnitOfWork.cs` - Ya incluía repositorios de Tasks
- `backend/TaskManagement.Application/TaskManagement.Application.csproj` - Agregado FrameworkReference Microsoft.AspNetCore.App
- `backend/TaskManagement.Infrastructure/DependencyInjection.cs` - Registrado IFileStorageService
- `backend/TaskManagement.Api/Controllers/TasksController.cs` - Agregados endpoints de attachments

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

### Fase 10: Audit Log (Registro de Auditoría)

#### Backend
- **AuditLogDto**: DTOs para logs de auditoría (AuditLogDto, AuditLogFilterDto, AuditLogSummaryDto)
- **GetAuditLogsQuery**: Obtener logs con filtros (acción, entidad, usuario, fechas)
- **GetAuditSummaryQuery**: Obtener resumen de auditoría (totales, agrupaciones)
- **IAuditService**: Interfaz para registrar eventos de auditoría
- **AuditService**: Implementación del servicio de auditoría
- **AuditController**: API REST con 2 endpoints (solo Admin)

#### Frontend
- **AuditLogListComponent**: Página completa de auditoría con:
  - Tarjetas de resumen (Total Logs, Today, Action Types, Entity Types)
  - Filtros (Action, Entity, Start Date, End Date)
  - Tabla de logs con paginación
  - Detalles de cada log (old/new values)
- **AuditService**: Servicio HTTP para obtener logs y resumen

#### Endpoints
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/audit` | Obtener logs de auditoría con filtros |
| GET | `/api/audit/summary` | Obtener resumen de auditoría |

#### Seguridad
- Solo usuarios con rol **Admin** pueden acceder a los logs de auditoría
- Ruta protegida: `/admin/audit`

---

### Fase 11: i18n (Internacionalización)

#### Backend
- **Messages.es.resx**: Archivo de recursos en español para todos los mensajes
- **Messages.en.resx**: Archivo de recursos en inglés para todos los mensajes
- **ILocalizer**: Interfaz para localización de mensajes
- **Localizer**: Implementación del servicio de localización con soporte para Accept-Language
- **Program.cs**: Configuración de localization con soporte para español (es) e inglés (en)

#### Frontend
- **TranslationService**: Servicio de traducción con Angular Signals
  - Soporte para español (es) e inglés (en)
  - Carga dinámica de archivos de traducción
  - Persistencia de idioma en localStorage
  - Interpolación de parámetros
- **TranslatePipe**: Pipe para usar traducciones en templates
- **LanguageSwitcherComponent**: Componente para cambiar idioma
- **es.json**: Archivo de traducciones en español (todos los módulos)
- **en.json**: Archivo de traducciones en inglés (todos los módulos)
- **MainLayout**: Actualizado con traducciones y language switcher
- **Componentes traducidos**: Todos los componentes actualizados con `{{ t('key') }}`:
  - DashboardComponent
  - ProjectList, ProjectDetail
  - TaskBoard, TaskList, TaskDetail, MyTasks
  - UserList, UserDetail
  - NotificationList
  - AuditLogList
  - ProfileComponent
  - LoginComponent, RegisterComponent

#### Archivos de Traducción
```
frontend/src/assets/i18n/
├── es.json (Español - por defecto)
└── en.json (Inglés)

backend/TaskManagement.Api/Resources/
├── Messages.es.resx (Español - por defecto)
├── Messages.en.resx (Inglés)
└── Localizer.cs (Servicio de localización)
```

#### Configuración
- **Backend**: Localización basada en header `Accept-Language`, por defecto español
- **Frontend**: Localización almacenada en `localStorage`, por defecto español
- **Idiomas soportados**: Español (es), Inglés (en)

---

### Fase 12: Reestructura de Carpetas y Fix Swagger

#### Reestructura del Repositorio
- `src/` → `backend/`: La carpeta `src` (que contenía los 5 proyectos .NET) se renombró a `backend` para dejar claro el lado del servidor
- **TaskManagement.slnx**: Movido de la raíz a `backend/TaskManagement.slnx`, con rutas de proyectos relativas actualizadas
- **docs/**: `CHANGELOG_TASKS.md` y `CONTEXT.md` movidos a la nueva carpeta `docs/`
- Eliminadas carpetas vacías residuales (`src/src`, `TaskManagement.Api/src`)

#### Estructura final del repositorio
```
C:\Cursos\MimoCode\
├── backend/                 ← Backend (.NET) + solución
│   ├── TaskManagement.slnx
│   ├── TaskManagement.Api
│   ├── TaskManagement.Application
│   ├── TaskManagement.Domain
│   ├── TaskManagement.Infrastructure
│   └── TaskManagement.Shared
├── frontend/                ← Frontend (Angular)
├── docs/                    ← Documentación
│   ├── CHANGELOG_TASKS.md
│   └── CONTEXT.md
└── .opencode/               ← Configuración OpenCode
```

#### Fix: Swagger schemaId conflict
- **Problema**: `GET /swagger/index.html` fallaba con `SwaggerGeneratorException` al generar la operación `UsersController.GetUsers`
- **Causa**: Existían dos clases `UserDto` en namespaces distintos (`DTOs.Auth.UserDto` y `DTOs.Users.UserDto`) y Swashbuckle usaba el nombre corto de clase como `schemaId`, generando un conflicto
- **Solución**: En `Program.cs` se configuró `c.CustomSchemaIds(...)` para usar el `FullName` del tipo (namespace + clase) como identificador único de schema
- **Archivos modificados**: `backend/TaskManagement.Api/Program.cs`

---

### Fase 13: Limpieza de Backend + Localización de Respuestas API

#### Limpieza de archivos no utilizados
- Eliminados 4 archivos `Class1.cs` de plantilla (Application, Domain, Infrastructure, Shared)
- Eliminadas carpetas vacías residuales (Application/Common/Exceptions, Application/Features/Attachments, Api/Filters, etc.)

#### Localización de respuestas del backend (i18n completo)
- **ILocalizer movido a Application**: Nueva interfaz en `TaskManagement.Application/Common/Interfaces/ILocalizer.cs` para que los handlers puedan traducir sin referenciar `Api.Resources`. `Localizer` en `Api/Resources` ahora la implementa
- **38 handlers localizados**: Todos los mensajes de éxito/error de handlers (Auth, Users, Projects, Tasks, Notifications, Profile, Audit, Dashboard) ahora usan `_localizer.Get("Key")`
- **ExceptionHandlingMiddleware localizado**: Mensajes de validación, NotFound, reglas de negocio y errores internos traducidos según idioma
- **11 validators FluentValidation localizados**: Mensajes de validación de campos (EmailRequired, UsernameMinLength, InvalidRole, etc.) traducidos
- **~70 keys agregadas** a `Messages.es.resx` y `Messages.en.resx`
- **Fix RefreshToken**: Token de refresco malformado devolvía 500; ahora se captura la excepción y responde 400 con "InvalidRefreshToken"
- **Frontend**: El interceptor `auth.interceptor.ts` ahora envía el header `Accept-Language` (desde `localStorage['language']`) en TODAS las peticiones, incluidas las de login/register sin token

#### Verificación runtime
- Login fallido: `es` → "Credenciales inválidas" / `en` → "Invalid credentials"
- Validación: `es` → "El correo electrónico no es válido" / `en` → "The email is not valid"
- Refresh token inválido: `es` → "Token de refresco inválido" / `en` → "Invalid refresh token"
- Middleware de excepciones: `es` → "Ocurrió un error inesperado" / `en` → "An unexpected error occurred"

---

### Fase 14: Fix Language Switcher + Frontend i18n Completo

#### Fix del Language Switcher
- `language-switcher.component.ts`: `selectedLanguage` copiaba el signal una sola vez (no reactivo); ahora usa `[ngModel]="language()"` + `(ngModelChange)="onLanguageChange($event)"` con `language = this.translationService.language`
- Verificado con Playwright: muestra el idioma persistido en `localStorage['language']` tras recargar (F5), cambia en ambas direcciones y persiste

#### Fix NG0200 (dependencia circular)
- `TranslationService` usaba `HttpClient` y `errorInterceptor` ahora inyecta `TranslationService` → ciclo `TranslationService → HttpClient → errorInterceptor → TranslationService`
- Solución: `TranslationService` usa `fetch()` nativo (método privado `fetchTranslations`) en vez de HttpClient

#### Eliminación de texto hardcodeado (traducción completa del frontend)
- **Dashboard**: Usaba 9 claves inexistentes; reemplazadas por claves existentes (`dashboard.inProgressTasks`, `common.overdue/completed/pending`, `dashboard.daysRemaining` con `{count}`, `dashboard.noActivity`, `dashboard.loadFailed`). Agregados `getStatusLabel()` y `getPriorityLabelFromString()` que mapean los strings crudos del backend (Todo/In Progress/In Review/Done/Cancelled/Low/Medium/High/Critical) a claves de traducción; los labels de los charts ahora pasan por esos mappers
- **Settings**: Todo el componente traducido (`settings.title`, `settings.comingSoon`)
- **error.interceptor**: Inyecta `TranslationService` y usa claves `errors.*` (validation/unexpected/sessionExpired/forbidden/notFound/serverError); los errores 400 del backend se muestran tal cual (ya localizados)
- **main-layout**: Logo "TaskManager" → `t('common.appName')`
- **TaskBoard/TaskList**: `priorityOptions`/`stateOptions` como getters con `this.t(...)`; toasts, diálogos de confirmación y labels traducidos
- **TaskDetail/MyTasks**: `statusOptions`/`priorityOptions` como getters reactivos; `statusChangedTo` con placeholder; headers de comentarios/adjuntos; `chooseLabel` del uploader
- **AuditLogList**: `actionOptions`/`entityOptions` y columna de detalles traducidos; los datos crudos del backend (`log.action`, `entityName`, `userName`) se muestran tal cual
- **TaskStore/NotificationStore**: Errores mostrados via `TranslationService`

#### Claves nuevas en `es.json` / `en.json` (~25)
- `common.unknown`, `tasks.selectMember`, `tasks.downloadNotAvailable`, `tasks.loadFailed`, `tasks.reorderFailed`, `settings.title`, `settings.comingSoon`, `errors.*` (6), `audit.entityProject/entityTask/entityUser/entityComment/entityAttachment/oldValues/newValues/system`, `notifications.loadFailed/markFailed/markAllFailed/deleteFailed`
- Paridad ES/EN verificada con script de node (ninguna clave única en un solo idioma)

#### Verificación
- Script node: ninguna clave real faltante en `t('...')` (falsos positivos de lazy imports filtrados)
- `npm run build` OK (solo warnings preexistentes: NG8107, bundle budget)
- Runtime con Playwright: login/dashboard/my-tasks/task-board/task-detail/settings/audit/notifications/projects verificados en `es` y `en`; cambio de idioma reactivo en vivo (los getters se actualizan sin recargar); cero errores de consola
- Nota: errores transitorios `504 Outdated Optimize Dep` de Vite al reoptimizar deps tras borrar `.angular/cache`; se resuelven reiniciando el dev server

---

## Pendientes / Mejoras Futuras

1. **Filtros avanzados**: Agregar filtros por fecha, etiquetas y miembros
2. **Vista de calendario**: Mostrar tareas en vista de calendario
3. **Exportar**: Exportar tareas a CSV/PDF
4. **Bulk actions**: Acciones masivas (cambiar estado, asignar múltiples)
5. **Subtareas**: Soporte para subtareas o checklists
6. **Tiempo registrado**: Tracking de tiempo en tareas
7. **File serving**: Implementar descarga y preview de archivos
8. **Integrar AuditService**: Logging automático en commands principales

---

## Estado

✅ Backend compilado exitosamente  
✅ Frontend compilado exitosamente  
✅ Swagger funcionando (`/swagger/index.html`)  
✅ Integración completa con arquitectura existente  
✅ Patrones y convenciones mantenidos  
✅ Soporte i18n (es/en) implementado  
✅ Repositorio reestructurado (backend/, frontend/, docs/)
