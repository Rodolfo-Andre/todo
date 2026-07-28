# CONTEXT.md — Contexto del Proyecto TaskManagement

> **Última actualización:** 2026-07-28
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
| Application Common | ✅ | IUnitOfWork, IRepository, IJwtTokenService, ICurrentUserService, Behaviors (Validation, Performance, Logging) |
| Infrastructure | ✅ | AppDbContext, JwtTokenService, CurrentUserService, UnitOfWork, Seeds (Roles, Admin) |
| API Controllers | ✅ | AuthController, UsersController, ProjectsController |
| Middleware | ✅ | ExceptionHandlingMiddleware |

### 4.2 Backend — Pendiente

| Módulo | Estado | Notas |
|--------|--------|-------|
| Tasks | ❌ Vacío | Solo carpetas Commands/Queries sin código |
| Comments | ❌ Vacío | Solo carpetas vacías |
| Attachments | ❌ Vacío | Solo carpetas vacías |
| Notifications | ❌ Vacío | Solo carpetas vacías |
| Dashboard | ❌ Vacío | Solo carpetas vacías |
| Audit | ❌ Vacío | Solo carpetas vacías |
| Profile | ❌ Vacío | Solo carpetas vacías |
| Repositories específicos | ❌ | Solo Base/IRepository + UnitOfWork |
| Services | ❌ | Solo CurrentUserService |
| DTOs Tasks/Comments/etc | ❌ | Solo DTOs de Auth, Users, Projects |

### 4.3 Frontend — Completado

| Módulo | Estado | Componentes |
|--------|--------|------------|
| Auth | ✅ | Login, Register |
| Users | ✅ | UserList, UserDetail, UserService |
| Projects | ✅ | ProjectList, ProjectDetail, ProjectService |
| Core | ✅ | AuthService, Guards (auth, role), Interceptors (auth, error), Models |
| Layout | ✅ | MainLayout, AuthLayout |
| State | ✅ | AuthStore (Signals) |

### 4.4 Frontend — Pendiente

| Módulo | Estado | Notas |
|--------|--------|-------|
| Task Board (Kanban) | ❌ | Componente task-detail existe pero no board |
| Task List | ❌ | No implementado |
| Task Create/Edit | ❌ | No implementado |
| Task Service | ❌ | No implementado |
| Task Store | ❌ | No implementado |
| Project Create/Edit | ❌ | Solo list y detail |
| Project Settings/Members | ❌ | No implementado |
| Comments | ❌ | No implementado |
| Attachments | ❌ | No implementado |
| Shared Components | ❌ | Header, Sidebar, ConfirmDialog, LoadingSpinner, etc. |

---

## 5. Git History

```
dcf7258 feat: implement Users Management and improve UI
23056a6 feat: implement Authentication feature (backend)
6b03ce1 feat: initial project setup with Clean Architecture
```

**Rama actual:** `master`
**Último commit:** Users Management + UI improvements

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

1. **Fase 4 — Projects Frontend:** Create/Edit, Settings, Members
2. **Fase 5 — Tasks Backend:** Commands + Queries + Validators
3. **Fase 5 — Tasks Frontend:** Kanban Board, Task List, Task Detail
4. **Fase 6 — Comments & Attachments:** Backend + Frontend
5. **Fase 7 — Notifications & Dashboard:** Backend + Frontend
6. **Fase 8 — Audit & Profile:** Backend + Frontend

---

## 9. Configuración Base de Datos

- **Server:** localhost
- **Database:** Dev_Todo
- **User:** sa / sql
- **MCP SQL Server:** Configurado en opencode.json

---

## 10. Archivos Clave de Referencia

- Plan maestro: `.opencode/plans/1784932145450-silent-river.md`
- Config OpenCode: `.opencode/opencode.json`
- API Config: `src/TaskManagement.Api/appsettings.json`
- Frontend Config: `frontend/package.json`, `frontend/angular.json`
