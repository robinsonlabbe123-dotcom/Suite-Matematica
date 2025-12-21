import { useMemo, useState } from 'react';
import { activityLabels, statusLabels, useData } from '../context/DataContext';
import { ActivityType } from '../types';

const defaultActivity = {
  tipo: 'llamada' as ActivityType,
  fechaHora: new Date().toISOString().slice(0, 16),
  descripcion: '',
  resultado: '',
  completado: false,
  contactId: '',
  opportunityId: '',
};

export function ActivitiesSection() {
  const { activities, contacts, opportunities, addActivity, deleteActivity } = useData();
  const [form, setForm] = useState(defaultActivity);
  const [typeFilter, setTypeFilter] = useState('');
  const [contactFilter, setContactFilter] = useState('');
  const [opportunityFilter, setOpportunityFilter] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fechaHora) {
      alert('Fecha y hora requeridas');
      return;
    }
    const resolvedContact = form.contactId || opportunities.find((o) => o.id === form.opportunityId)?.contactId || '';
    addActivity({ ...form, contactId: resolvedContact || undefined, opportunityId: form.opportunityId || undefined });
    setForm(defaultActivity);
  };

  const filtered = useMemo(() => {
    return activities
      .filter((a) => (typeFilter ? a.tipo === typeFilter : true))
      .filter((a) => (contactFilter ? a.contactId === contactFilter : true))
      .filter((a) => (opportunityFilter ? a.opportunityId === opportunityFilter : true))
      .filter((a) => (from ? a.fechaHora >= from : true))
      .filter((a) => (to ? a.fechaHora <= `${to}T23:59` : true))
      .sort((a, b) => b.fechaHora.localeCompare(a.fechaHora));
  }, [activities, contactFilter, from, opportunityFilter, to, typeFilter]);

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h2>Actividades</h2>
          <p className="muted">Timeline con filtros por tipo, fechas y vínculos.</p>
        </div>
      </div>
      <div className="grid two">
        <form className="card" onSubmit={handleSubmit}>
          <div className="card-header">
            <h3>Nueva actividad</h3>
          </div>
          <label>
            Tipo*
            <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as ActivityType })}>
              {Object.keys(activityLabels).map((t) => (
                <option key={t} value={t}>
                  {activityLabels[t as ActivityType]}
                </option>
              ))}
            </select>
          </label>
          <label>
            Fecha y hora*
            <input
              type="datetime-local"
              value={form.fechaHora}
              onChange={(e) => setForm({ ...form, fechaHora: e.target.value })}
              required
            />
          </label>
          <label>
            Descripción
            <textarea
              rows={3}
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </label>
          <label>
            Resultado
            <input value={form.resultado} onChange={(e) => setForm({ ...form, resultado: e.target.value })} />
          </label>
          {form.tipo === 'tarea' && (
            <label className="checkbox">
              <input
                type="checkbox"
                checked={form.completado}
                onChange={(e) => setForm({ ...form, completado: e.target.checked })}
              />
              <span>Marcar como completada</span>
            </label>
          )}
          <label>
            Contacto
            <select value={form.contactId} onChange={(e) => setForm({ ...form, contactId: e.target.value })}>
              <option value="">Opcional</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} {c.empresa && `(${c.empresa})`}
                </option>
              ))}
            </select>
          </label>
          <label>
            Oportunidad
            <select
              value={form.opportunityId}
              onChange={(e) => setForm({ ...form, opportunityId: e.target.value })}
            >
              <option value="">Opcional</option>
              {opportunities.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.titulo} · {statusLabels[o.estado]}
                </option>
              ))}
            </select>
          </label>
          <button className="primary" type="submit">
            Registrar actividad
          </button>
        </form>

        <div className="card">
          <div className="card-header">
            <h3>Filtros</h3>
            <div className="filters">
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="">Todos los tipos</option>
                {Object.keys(activityLabels).map((t) => (
                  <option key={t} value={t}>
                    {activityLabels[t as ActivityType]}
                  </option>
                ))}
              </select>
              <select value={contactFilter} onChange={(e) => setContactFilter(e.target.value)}>
                <option value="">Todos los contactos</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>
              <select value={opportunityFilter} onChange={(e) => setOpportunityFilter(e.target.value)}>
                <option value="">Todas las oportunidades</option>
                {opportunities.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.titulo}
                  </option>
                ))}
              </select>
              <div className="input-row">
                <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                <span className="muted">a</span>
                <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="timeline">
            {filtered.map((a) => {
              const contact = contacts.find((c) => c.id === a.contactId);
              const opp = opportunities.find((o) => o.id === a.opportunityId);
              return (
                <div key={a.id} className="timeline-item">
                  <div className="timeline-date">{new Date(a.fechaHora).toLocaleString('es-CL')}</div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="chip">{activityLabels[a.tipo]}</span>
                      <div className="timeline-actions">
                        {a.tipo === 'tarea' && a.completado && <span className="chip success">Completada</span>}
                        <button className="link danger" onClick={() => deleteActivity(a.id)}>
                          Eliminar
                        </button>
                      </div>
                    </div>
                    <p className="strong">{a.descripcion || 'Sin descripción'}</p>
                    <p className="muted">Resultado: {a.resultado || '—'}</p>
                    <p className="muted">
                      {contact ? `Contacto: ${contact.nombre}` : ''} {opp ? `· Oportunidad: ${opp.titulo}` : ''}
                    </p>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && <div className="empty">No hay actividades en este rango.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
