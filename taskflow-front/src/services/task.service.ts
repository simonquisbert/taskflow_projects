import { apiFetch } from './api';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt?: string;
}
export interface CreateTaskDTO { title: string; description: string }
export interface UpdateTaskDTO { title?: string; description?: string }
interface TaskPage {
  items: Task[];
  pagination: { page: number; totalPages: number; totalItems: number };
}

// La API entrega páginas de tareas. Las reunimos para no perder las posteriores a la décima.
export async function getTasksRequest(projectId: string) {
  const tasks: Task[] = [];
  let page = 1;
  let totalPages: number;
  do {
    const response = await apiFetch<TaskPage>(`/tasks/${projectId}?page=${page}&limit=100`);
    tasks.push(...response.data.items);
    totalPages = response.data.pagination.totalPages;
    page += 1;
  } while (page <= totalPages);
  return { data: tasks };
}
export function createTaskRequest(projectId: string, data: CreateTaskDTO) {
  return apiFetch<Task>(`/tasks/${projectId}`, { method: 'POST', body: JSON.stringify(data) });
}
export function updateTaskRequest(projectId: string, id: string, data: UpdateTaskDTO) {
  return apiFetch<Task>(`/tasks/${projectId}`, { method: 'PATCH', body: JSON.stringify({ id, ...data }) });
}
export function completeTaskRequest(projectId: string, id: string) {
  return apiFetch<Task>(`/tasks/${projectId}/complete`, { method: 'PATCH', body: JSON.stringify({ id }) });
}
export function pendingTaskRequest(projectId: string, id: string) {
  return apiFetch<Task>(`/tasks/${projectId}/pending`, { method: 'PATCH', body: JSON.stringify({ id }) });
}
export function deleteTaskRequest(projectId: string, id: string) {
  return apiFetch<null>(`/tasks/${projectId}`, { method: 'DELETE', body: JSON.stringify({ id }) });
}
