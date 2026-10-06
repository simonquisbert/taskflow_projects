import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskSkeleton } from '@/components/tasks/TaskSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useTasks } from '@/hooks/useTasks';
import type { Task } from '@/services/task.service';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Inbox,
  ListTodo,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { useState } from 'react';

export default function ProjectTasks({ projectId }: { projectId: string }) {
  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    addTask,
    toggleTask,
    editTask,
    removeTask,
  } = useTasks(projectId);

  // Estado para controlar la apertura del modal de creación
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // Estado para la tarea que se está editando (null cuando no hay edición activa)
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Métricas calculadas en tiempo de render
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="text-slate-100">
      {/* Contenedor principal del Dashboard */}
      <main className="container mx-auto px-4 py-8 sm:px-8">
        {/* Cabecera del Dashboard */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Tareas del proyecto
            </h1>
            <p className="text-sm text-slate-400">
              El resumen corresponde únicamente al proyecto seleccionado.
            </p>
          </div>

          {/* Grupo de botones de acción principal (más grandes y espaciados) */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="default"
              onClick={fetchTasks}
              disabled={isLoading}
              className="gap-2 border-slate-800 text-slate-300 hover:bg-slate-900"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
              />
              <span>Actualizar</span>
            </Button>

            <Button
              size="default"
              onClick={() => setIsCreateModalOpen(true)}
              className="gap-2 bg-indigo-600 font-semibold text-white shadow-md hover:bg-indigo-500"
            >
              <Plus className="h-4 w-4" />
              <span>Nueva Tarea</span>
            </Button>
          </div>
        </div>

        {/* Tarjetas de Métricas / Resumen */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Métrica 1: Total de Tareas */}
          <Card className="border-slate-800 bg-slate-900/60">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-indigo-500/10 p-3 text-indigo-400">
                <ListTodo className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                  Total Tareas
                </p>
                {isLoading ? (
                  <Skeleton className="mt-1 h-8 w-12" />
                ) : (
                  <p className="text-2xl font-bold text-slate-100">
                    {error ? "—" : totalTasks}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Métrica 2: Tareas Completadas */}
          <Card className="border-slate-800 bg-slate-900/60">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                  Completadas
                </p>
                {isLoading ? (
                  <Skeleton className="mt-1 h-8 w-12" />
                ) : (
                  <p className="text-2xl font-bold text-emerald-400">
                    {error ? "—" : completedTasks}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Métrica 3: Tareas Pendientes */}
          <Card className="border-slate-800 bg-slate-900/60">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-amber-500/10 p-3 text-amber-400">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                  Pendientes
                </p>
                {isLoading ? (
                  <Skeleton className="mt-1 h-8 w-12" />
                ) : (
                  <p className="text-2xl font-bold text-amber-400">
                    {error ? "—" : pendingTasks}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sección de Estados de Interfaz */}

        {/* 1. Estado de Carga: Grilla con 6 Skeletons pulsantes */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <TaskSkeleton key={index} />
            ))}
          </div>
        )}

        {/* 2. Estado de Error */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-rose-900/50 bg-rose-950/20 p-8 text-center">
            <AlertCircle className="h-10 w-10 text-rose-500" />
            <h3 className="mt-3 text-lg font-semibold text-rose-300">
              Error al cargar tareas
            </h3>
            <p className="mt-1 max-w-md text-sm text-rose-400/80">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchTasks}
              className="mt-4 border-rose-800 text-rose-300 hover:bg-rose-950"
            >
              Reintentar
            </Button>
          </div>
        )}

        {/* 3. Estado Vacío (Empty State) */}
        {!isLoading && !error && tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 py-16 text-center">
            <div className="rounded-full bg-slate-800/80 p-4 text-slate-400">
              <Inbox className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-200">
              No tienes tareas registradas
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-400">
              Crea tu primera tarea con el botón de abajo.
            </p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
            >
              <Plus className="h-4 w-4" />
              <span>Crear primera tarea</span>
            </Button>
          </div>
        )}

        {/* 4. Lista de Tareas */}
        {!isLoading && !error && tasks.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={removeTask}
                onEdit={setTaskToEdit}
              />
            ))}
          </div>
        )}

        {/* Modal de Creación de Tareas */}
        <TaskForm
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSubmit={addTask}
        />

        {/* Modal de Edición de Tareas */}
        <TaskForm
          open={Boolean(taskToEdit)}
          onOpenChange={(isOpen) => {
            if (!isOpen) setTaskToEdit(null);
          }}
          initialData={taskToEdit}
          onSubmit={async (data) => {
            if (taskToEdit) {
              await editTask(taskToEdit.id, data);
            }
          }}
        />
      </main>
    </div>
  );
}
