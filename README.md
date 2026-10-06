# TaskFlow — Examen final de React

Aplicación para registrar usuarios y administrar proyectos y sus tareas.

## 1. Qué hace?

La APP registra, inicia y cierra sesión, ver dasboard, crea y lista proyectos, marca tareas pendientes, muestra carga listas vacías y confirmación de eliminación de registros.

Los proyectos y las tareas se guardan en la API. El navegador solo conserva el token y los datos básicos de sesión. Sin uso de una lista ficticia como base de datos.

## 2. Tomar nota en

como es base en be de Node es necesario Git, Node.js 24 LTS, npm y PostgreSQL.

| Programa | Función | Dirección local |
| Backend del docente | Autenticación y acceso a PostgreSQL | http://localhost:3000 |
| Frontend de esta entrega | Pantallas de React | http://localhost:5173 |

Este ejercicio utiliza el backend Node proporcionado.

## 3. Iniciar el backend del docente

### Paso A. Descargar la API

En una carpeta de trabajo, fuera de la carpeta del frontend:

git clone https://github.com/javieronishi/project-task-flow-api.git
cd project-task-flow-api
npm ci

### Paso B. Crear la base de datos

En pgAdmin, abre Query Tool sobre la base `postgres` y ejecuta una sola vez:

sql
CREATE DATABASE taskflow;

El servidor PostgreSQL debe estar iniciado. No necesitas crear tablas manualmente: la API las crea al arrancar.

### Paso C. Configurar la API

PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskflow
DB_USER=postgres
DB_PASSWORD=REEMPLAZA_CON_TU_CLAVE_DE_POSTGRESQL
JWT_SECRET=REEMPLAZA_CON_UN_SECRETO_LARGO
JWT_EXPIRES_IN=1d
LOG_LEVEL=info

Reemplaza los dos valores que comienzan con `REEMPLAZA`. `DB_PASSWORD` es la contraseña que elegiste al instalar PostgreSQL. Para generar el secreto, puedes ejecutar `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` y pegar su resultado en `JWT_SECRET`. No compartas el `.env`.

### Paso D. Encender la API

npm run dev

Las terminales abiertas: Visita http://localhost:3000/health; debe mostrar `{"status":"OK"}`

## 4. Iniciar el frontend

npm ci
Copy-Item .env.example .env
npm run dev

El archivo `.env` del frontend contiene:

VITE_API_URL=http://localhost:3000
VITE_TOKEN_KEY=taskflow_token
VITE_APP_NAME=TaskFlow

## 5. Organización de los archivos importantes

| Ruta                                       | Responsabilidad                                         |
| ------------------------------------------ | ------------------------------------------------------- |
| `src/App.tsx`                              | Rutas públicas y dashboard protegido                    |
| `src/context/`                             | Sesión compartida entre componentes                     |
| `src/hooks/useAuth.ts`                     | Acceso sencillo al contexto                             |
| `src/hooks/useTasks.ts`                    | Estado y operaciones de las tareas                      |
| `src/pages/DashboardPage.tsx`              | Lista y administración de proyectos                     |
| `src/components/projects/ProjectForm.tsx`  | Formulario de proyecto                                  |
| `src/components/projects/ProjectTasks.tsx` | Panel de tareas del proyecto elegido                    |
| `src/components/tasks/`                    | Formulario, tarjeta y carga de tareas del proyecto base |
| `src/services/`                            | Llamadas al backend                                     |

## 6. Comprobar y compilar

npm run lint
npm run build
npm run preview

- Base del docente: https://github.com/javieronishi/taskflow-front
- API del docente: https://github.com/javieronishi/project-task-flow-api
