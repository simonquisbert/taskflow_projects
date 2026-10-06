import { apiFetch } from './api';

export interface Project { id: string; name: string; description: string; status: string }
export interface ProjectDTO { name: string; description: string }

export async function getProjectsRequest() {
  const response = await apiFetch<Project[]>('/projects');
  // DELETE hace un borrado lógico; el listado del backend también incluye los eliminados.
  return response.data.filter((project) => project.status !== 'deleted');
}
export async function createProjectRequest(data: ProjectDTO) {
  return (await apiFetch<Project>('/projects', { method: 'POST', body: JSON.stringify(data) })).data;
}
export async function updateProjectRequest(id: string, data: ProjectDTO) {
  return (await apiFetch<Project>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) })).data;
}
export function deleteProjectRequest(id: string) {
  return apiFetch(`/projects/${id}`, { method: 'DELETE' });
}
