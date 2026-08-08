# CONTEXT.md — Contexto del Proyecto TaskManagement

> **Última actualización:** 2026-08-08
> **Archivo de referencia:** `.opencode/plans/1784932145450-silent-river.md`

---

## 1. Objetivo

Sistema completo de gestión de tareas estilo Jira/Trello/Azure DevOps. Permite a equipos organizar proyectos, crear y asignar tareas, rastrear progreso, comentar, adjuntar archivos y mantener un historial completo de auditoría.

---

## 2. Arquitectura

**Patrón:** Clean Architecture + CQRS + MediatR

```
API (Controllers, Middleware)
    ↓
Application (Commands, Queries, Handlers, Validators)
    ↓
Domain (Entities, Enums, Exceptions)  ←→  Shared (DTOs, Interfaces)
    ↑
Infrastructure (EF Core, JWT, Services, Repositories)
```

**Regla:** Las dependencias solo apuntan hacia adentro. Domain nunca depende de Application. API es el único proyecto que referencia a todos.

---

## 3. Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular 20, Standalone Components, Signals, PrimeNG, TailwindCSS, RxJS |
| Backend | .NET 8, ASP.NET Core Web API, MediatR, CQRS, FluentValidation, EF Core, Mapster |
| Auth | JWT + Refresh Tokens, ASP.NET Core Identity |
| BD | SQL Server Local (Dev_Todo) |
| Logs | Serilog (Console + File) |
| i18n | .NET Localization (.resx), Angular i18n (Signals) |
| Dev | Swagger/OpenAPI |

---

## 4. Estado Actual

### 4.1 Backend — Completado

| Módulo | Estado | Archivos |
|--------|--------|----------|
| Domain Entities | ✅ | User, Role, Project, ProjectMember, TaskItem, TaskComment, TaskAttachment, TaskHistory, Notification, AuditLog, RefreshToken |
| Enums | ✅ | TaskStatus, TaskPriority, ProjectRole, NotificationType |
| Auth | ✅ | Login, Register, Logout, RefreshToken, GetCurrentUser |
| Users | ✅ | UpdateUser, DeleteUser, ChangeRole, GetUsers, GetUserById |
| Projects | ✅ | CreateProject, UpdateProject, DeleteProject, AddMember, RemoveMember, GetProjects, GetProjectById, GetProjectMembers |
| Tasks | ✅ | CreateTask, UpdateTask, DeleteTask, ChangeStatus, AssignTask, ReorderTask, AddComment, UploadAttachment, DeleteAttachment |
| Notifications | ✅ | CreateNotification, MarkAsRead, MarkAllAsRead, DeleteNotification, GetNotificationsByUser, GetUnreadCount |
| Dashboard | ✅ | GetDashboardData |
| Profile | ✅ | GetProfile, UpdateProfile, ChangePassword |
| Audit | ✅ | GetAuditLogs, GetAuditSummary, IAuditService |
| i18n | ✅ | Messages.es.resx, Messages.en.resx, Localizer |
| Application Common | ✅ | IUnitOfWork, IRepository, IJwtTokenService, ICurrentUserService, IFileStorageService, IAuditService, Behaviors (Validation, Performance, Logging) |
| Infrastructure | ✅ | AppDbContext, JwtTokenService, CurrentUserService, UnitOfWork, FileStorageService, AuditService, Seeds (Roles, Admin) |
| API Controllers | ✅ | AuthController, UsersController, ProjectsController, TasksController, DashboardController, NotificationsController, ProfileController, AuditController |
| Middleware | ✅ | ExceptionHandlingMiddleware |
| Swagger | ✅ | CustomSchemaIds (FullName) para evitar conflictos de schemaId |

### 4.2 Backend — Pendiente

| Módulo | Estado | Notas |
|--------|--------|-------|
| Repositories específicos | ❌ | Solo Base/IRepository + UnitOfWork |

### 4.3 Frontend — Completado

| Módulo | Estado | Componentes |
|--------|--------|------------|
| Auth | ✅ | Login, Register |
| Users | ✅ | UserList, UserDetail, UserService |
| Projects | ✅ | ProjectList, ProjectDetail, ProjectService |
| Core | ✅ | AuthService, Guards (auth, role), Interceptors (auth, error), Models |
| Layout | ✅ | MainLayout, AuthLayout |
| State | ✅ | AuthStore (Signals) |

### 4.4 Frontend — Completado

| Módulo | Estado | Componentes |
|--------|--------|------------|
| Dashboard | ✅ | DashboardComponent (stats, charts, activity) |
| Tasks | ✅ | TaskBoard, TaskList, TaskDetail, MyTasks |
| Notifications | ✅ | NotificationListComponent, NotificationStore |
| Profile | ✅ | ProfileComponent (edit profile, change password) |
| Audit | ✅ | AuditLogListComponent (Admin only) |
| Auth | ✅ | Login, Register |
| Users | ✅ | UserList, UserDetail, UserService |
| Projects | ✅ | ProjectList, ProjectDetail, ProjectService |
| Core | ✅ | AuthService, Guards, Interceptors, Models |
| Layout | ✅ | MainLayout, AuthLayout |
| State | ✅ | AuthStore, TaskStore, NotificationStore (Signals) |
| i18n | ✅ | TranslationService, TranslatePipe, LanguageSwitcher |

### 4.5 Frontend — Pendiente

| Módulo | Estado | Notas |
|--------|--------|-------|
| Shared Components | ✅ | LanguageSwitcher, Todos los componentes traducidos |

---

## 5. Git History

```
feat: restructure repo folders + fix Swagger schemaId conflict
feat: i18n - traducir todos los componentes frontend
bd9e6d1 feat: fix compilation errors (Audit handlers, Localizer, angular.json)
5a27386 feat: implement i18n (backend + frontend)
bb3383f feat: implement Audit Log feature (backend + frontend)
5b54c1f feat: implement Profile feature (backend + frontend)
e6ce1af feat: implement Notifications feature (backend + frontend)
6f834ff feat: implement Dashboard feature (backend + frontend)
d23f374 feat: implement Attachments feature + fix task reactivity
3f64f83 feat: implement Tasks feature (Phase 5)
dcf7258 feat: implement Users Management and improve UI
23056a6 feat: implement Authentication feature (backend)
6b03ce1 feat: initial project setup with Clean Architecture
```

**Rama actual:** `master`
**Último commit:** reestructura del repositorio + fix Swagger

---

## 6. Decisiones Técnicas

| Decisión | Elección | Razón |
|----------|----------|-------|
| Arquitectura | Clean Architecture | Separación clara de responsabilidades |
| Patrón | CQRS con MediatR | Commands (escritura) separados de Queries (lectura) |
| Validación | FluentValidation | Integrado con MediatR pipeline |
| State Management | Angular Signals | Moderno, reactivo, sin dependencias externas |
| UI Components | PrimeNG | Componentes ricos, buena documentación |
| Estilos | TailwindCSS | Utility-first, rápido de desarrollar |
| Auth | JWT + Refresh Tokens | Stateless, escalable |
| Soft Delete | AuditableEntity con DeletedAt | Preservación de datos |
| DB | SQL Server Local | Robusto, integración nativa con .NET |

---

## 7. Convenciones del Código

### Backend (.NET)
- **Entidades:** Heredan de `AuditableEntity` (con CreatedAt, UpdatedAt, DeletedAt)
- **Cada feature:** Carpeta Commands/Queries con Command/Query + Handler + Validator
- **DTOs:** En `TaskManagement.Shared/DTOs/{Module}/`
- **Nomenclatura:** `CreateXCommand`, `GetXQuery`, `XHandler`, `XValidator`
- **Respuestas:** Siempre `BaseResponse<T>` con Success, Message, Data, Errors

### Frontend (Angular)
- **Componentes:** Standalone (no NgModules)
- **Estado:** Signals stores en `state/`
- **Rutas:** Lazy loading con `loadComponent`
- **Estilos:** TailwindCSS + PrimeNG
- **HTTP:** Servicios inyectados con `inject()`
- **Guards:** Funcionales (`CanActivateFn`)

---

## 8. Próximos Pasos (Prioridad)

1. **Shared Components:** Componentes reutilizables (ConfirmDialog, LoadingSpinner, etc.)
2. **Integrar AuditService:** Logging automático en commands principales
3. **Mejoras futuras:** Filtros avanzados, calendario, exportar, bulk actions

---

## 9. Configuración Base de Datos

- **Server:** localhost
- **Database:** Dev_Todo
- **User:** sa / sql
- **MCP SQL Server:** Configurado en opencode.json

---

## 10. Estructura del Repositorio

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

---

## 11. Archivos Clave de Referencia

- Plan maestro: `.opencode/plans/1784932145450-silent-river.md`
- Config OpenCode: `.opencode/opencode.json`
- Solución: `backend/TaskManagement.slnx`
- API Config: `backend/TaskManagement.Api/appsettings.json`
- Frontend Config: `frontend/package.json`, `frontend/angular.json`
- Documentación: `docs/CHANGELOG_TASKS.md`, `docs/CONTEXT.md`
