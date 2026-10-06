import { useState, type SubmitEvent } from 'react';
import type { Project, ProjectDTO } from '@/services/project.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  project?: Project | null;
  onSave: (data: ProjectDTO) => Promise<void>;
  onCancel: () => void;
}

// Las props traen los valores anteriores; useState conserva lo que se escribe.
export default function ProjectForm({ project, onSave, onCancel }: Props) {
  const [name, setName] = useState(project?.name ?? '');
  const [description, setDescription] = useState(project?.description ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError('Completa el nombre y la descripción.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await onSave({ name: name.trim(), description: description.trim() });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No se pudo guardar');
    } finally {
      setSaving(false);
    }
  }

  return <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-700 bg-slate-900 p-5">
    <h2 className="text-lg font-semibold">{project ? 'Editar proyecto' : 'Nuevo proyecto'}</h2>
    <div className="space-y-2">
      <label htmlFor="project-name">Nombre del proyecto</label>
      <Input id="project-name" autoFocus required maxLength={255} value={name}
        onChange={(event) => setName(event.target.value)} disabled={saving} placeholder="Ej. Cierre contable de octubre" />
    </div>
    <div className="space-y-2">
      <label htmlFor="project-description">Descripción del proyecto</label>
      <textarea id="project-description" required maxLength={255} rows={3} value={description}
        onChange={(event) => setDescription(event.target.value)} disabled={saving}
        className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3" />
    </div>
    {error && <p role="alert" className="text-rose-300">{error}</p>}
    <div className="flex gap-3">
      <Button type="submit" disabled={saving} className="bg-indigo-600 text-white">{saving ? 'Guardando...' : 'Guardar proyecto'}</Button>
      <Button type="button" variant="outline" disabled={saving} onClick={onCancel}>Cancelar</Button>
    </div>
  </form>;
}
