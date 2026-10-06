import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import ProjectForm from '@/components/projects/ProjectForm';
import ProjectTasks from '@/components/projects/ProjectTasks';
import { getProjectsRequest, createProjectRequest, updateProjectRequest, deleteProjectRequest, type Project, type ProjectDTO } from '@/services/project.service';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [reload, setReload] = useState(0);
  const selected = projects.find((project) => project.id === selectedId);

  // useEffect consulta la API al abrir el panel o al pulsar Reintentar.
  useEffect(() => {
    let ignore = false;
    getProjectsRequest().then((data) => {
      if (ignore) return;
      setProjects(data);
      setSelectedId((previous) => data.some((item) => item.id === previous) ? previous : data[0]?.id ?? '');
    }).catch((error: Error) => {
      if (!ignore) setError(error.message);
    }).finally(() => {
      if (!ignore) setLoading(false);
    });
    return () => { ignore = true; };
  }, [reload]);

  async function saveProject(data: ProjectDTO) {
    if (editing) {
      const updated = await updateProjectRequest(editing.id, data);
      setProjects((previous) => previous.map((item) => item.id === updated.id ? updated : item));
    } else {
      const created = await createProjectRequest(data);
      setProjects((previous) => [...previous, created]);
      setSelectedId(created.id);
    }
    setFormOpen(false);
    setEditing(null);
    toast.success('Proyecto guardado');
  }

  async function removeProject() {
    if (!selected) return;
    setDeleting(true);
    try {
      await deleteProjectRequest(selected.id);
      const remaining = projects.filter((item) => item.id !== selected.id);
      setProjects(remaining);
      setSelectedId(remaining[0]?.id ?? '');
      setConfirmDelete(false);
      toast.success('Proyecto eliminado del listado');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo eliminar');
    } finally {
      setDeleting(false);
    }
  }

  return <div className="min-h-screen bg-slate-950 text-slate-100">
    <header className="border-b border-slate-800 bg-slate-900">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4">
        <span className="text-xl font-bold">Task<span className="text-indigo-400">Flow</span></span>
        <div className="flex items-center gap-4"><span>{user?.name}</span><Button variant="outline" onClick={logout}>Cerrar sesión</Button></div>
      </div>
    </header>
    <main className="mx-auto max-w-6xl px-5 py-8">
      <p className="text-sm text-indigo-300">MI ESPACIO DE TRABAJO</p>
      <h1 className="mt-2 text-3xl font-bold">Dashboard de proyectos</h1>
      <p className="mt-2 text-slate-400">Selecciona un proyecto para organizar sus tareas y revisar su avance.</p>
      <section aria-label="Proyectos" className="mt-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">Mis proyectos {loading || error ? '' : `(${projects.length})`}</h2>
          <Button disabled={loading || Boolean(error) || formOpen || confirmDelete} className="bg-indigo-600 text-white" onClick={() => { setEditing(null); setFormOpen(true); }}>Nuevo proyecto</Button>
        </div>
        {loading && <p role="status">Cargando proyectos...</p>}
        {error && <div role="alert" className="rounded-lg border border-rose-900 p-4 text-rose-300">
          <p>{error}</p><Button className="mt-3" onClick={() => { setLoading(true); setError(''); setReload((value) => value + 1); }}>Reintentar</Button>
        </div>}
        {formOpen && <ProjectForm key={editing?.id ?? 'new'} project={editing} onSave={saveProject} onCancel={() => setFormOpen(false)} />}
        {!loading && !error && projects.length === 0 && !formOpen && <p className="rounded-xl border border-dashed border-slate-700 p-8 text-center text-slate-400">Todavía no tienes proyectos. Pulsa «Nuevo proyecto» para comenzar.</p>}
        {!loading && !error && projects.length > 0 && <>
          <label className="block space-y-2"><span>Proyecto seleccionado</span>
            <select value={selectedId} disabled={formOpen || confirmDelete} onChange={(event) => setSelectedId(event.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-900 p-3">
              {projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
            </select>
          </label>
          {selected && <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="break-words text-xl font-semibold">{selected.name}</h2>
            <p className="mt-2 whitespace-pre-wrap break-words text-slate-400">{selected.description}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button variant="outline" disabled={formOpen || confirmDelete} onClick={() => { setEditing(selected); setFormOpen(true); }}>Editar proyecto</Button>
              <Button variant="outline" disabled={formOpen || confirmDelete} onClick={() => setConfirmDelete(true)}>Eliminar proyecto</Button>
            </div>
            {confirmDelete && <div className="mt-4 space-y-3 rounded-lg border border-rose-900 p-4" role="alert">
              <p>¿Eliminar «{selected.name}» del listado? Sus tareas dejarán de verse en esta aplicación. La API conserva el proyecto con estado «deleted».</p>
              <div className="flex gap-3"><Button disabled={deleting} onClick={removeProject} variant="destructive">{deleting ? 'Eliminando...' : 'Confirmar eliminación'}</Button><Button variant="outline" disabled={deleting} onClick={() => setConfirmDelete(false)}>Cancelar</Button></div>
            </div>}
          </div>}
        </>}
      </section>
      {/* key reinicia la lista y sus formularios al cambiar de proyecto. */}
      {!loading && !error && selected && <ProjectTasks key={selected.id} projectId={selected.id} />}
    </main>
  </div>;
}
