import { useEffect, useMemo, useState } from 'react';
import { useData } from '../context/DataContext';
import { Contact } from '../types';

const emailRegex = /.+@.+\..+/i;

const emptyContact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'> = {
  nombre: '',
  correo: '',
  telefono: '',
  empresa: '',
  notas: '',
  etiquetas: [],
};

function parseTags(text: string) {
  return text
    .split(/[\n,]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

export function ContactsSection() {
  const { contacts, addContact, updateContact, deleteContact } = useData();
  const [form, setForm] = useState(emptyContact);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [groupBy, setGroupBy] = useState<'none' | 'empresa' | 'etiqueta'>('none');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(search.toLowerCase()), 300);
    return () => clearTimeout(handler);
  }, [search]);

  const resetForm = () => {
    setForm(emptyContact);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim()) {
      alert('El nombre es obligatorio');
      return;
    }
    if (form.correo && !emailRegex.test(form.correo)) {
      alert('Correo inválido');
      return;
    }

    const payload = {
      ...form,
      etiquetas: form.etiquetas.map((t) => t.toLowerCase()),
    };

    if (editingId) {
      updateContact(editingId, payload);
    } else {
      addContact(payload);
    }
    resetForm();
  };

  const filtered = useMemo(() => {
    return contacts.filter((c) => {
      const hay = [
        c.nombre,
        c.correo,
        c.telefono,
        c.empresa,
        c.notas,
        c.etiquetas.join(' '),
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(debounced);
    });
  }, [contacts, debounced]);

  const grouped = useMemo(() => {
    if (groupBy === 'none') return { Todos: filtered } as Record<string, Contact[]>;
    return filtered.reduce((acc, contact) => {
      const claves =
        groupBy === 'empresa'
          ? [contact.empresa || 'Sin empresa']
          : contact.etiquetas.length
          ? contact.etiquetas
          : ['Sin etiqueta'];
      claves.forEach((clave) => {
        if (!acc[clave]) acc[clave] = [];
        acc[clave].push(contact);
      });
      return acc;
    }, {} as Record<string, Contact[]>);
  }, [filtered, groupBy]);

  const exportCsv = () => {
    const headers = ['nombre', 'correo', 'telefono', 'empresa', 'notas', 'etiquetas'];
    const rows = contacts.map((c) =>
      [c.nombre, c.correo || '', c.telefono || '', c.empresa || '', c.notas || '', c.etiquetas.join('|')]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(','),
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'contactos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <div>
          <h2>Contactos</h2>
          <p className="muted">Crea, busca, agrupa y exporta tus clientes.</p>
        </div>
        <div className="panel-actions">
          <button className="secondary" onClick={exportCsv}>
            Exportar CSV
          </button>
        </div>
      </div>

      <div className="grid two">
        <form className="card" onSubmit={handleSubmit}>
          <div className="card-header">
            <div>
              <h3>{editingId ? 'Editar contacto' : 'Nuevo contacto'}</h3>
              <p className="muted">Campos básicos y etiquetas (coma o enter).</p>
            </div>
            {editingId && (
              <button type="button" className="link" onClick={resetForm}>
                Cancelar
              </button>
            )}
          </div>
          <label>
            Nombre*
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
          </label>
          <label>
            Correo
            <input
              type="email"
              value={form.correo}
              onChange={(e) => setForm({ ...form, correo: e.target.value })}
              placeholder="correo@dominio.cl"
            />
          </label>
          <label>
            Teléfono
            <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} />
          </label>
          <label>
            Empresa
            <input value={form.empresa} onChange={(e) => setForm({ ...form, empresa: e.target.value })} />
          </label>
          <label>
            Notas
            <textarea
              rows={3}
              value={form.notas}
              onChange={(e) => setForm({ ...form, notas: e.target.value })}
            />
          </label>
          <label>
            Etiquetas
            <input
              value={form.etiquetas.join(', ')}
              onChange={(e) => setForm({ ...form, etiquetas: parseTags(e.target.value) })}
              placeholder="vip, fintech"
            />
            <small className="muted">Separa con coma o enter.</small>
          </label>
          <button type="submit" className="primary">
            {editingId ? 'Actualizar' : 'Crear contacto'}
          </button>
        </form>

        <div className="card">
          <div className="card-header">
            <div className="input-row">
              <input
                placeholder="Buscar por nombre, correo, teléfono, empresa, notas o etiqueta"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select value={groupBy} onChange={(e) => setGroupBy(e.target.value as any)}>
                <option value="none">Sin agrupar</option>
                <option value="empresa">Agrupar por empresa</option>
                <option value="etiqueta">Agrupar por etiqueta</option>
              </select>
            </div>
            <p className="muted">{filtered.length} contacto(s) encontrados</p>
          </div>
          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} className="group-block">
              <div className="group-header">{group}</div>
              <div className="table">
                <div className="table-head">
                  <span>Nombre</span>
                  <span>Contacto</span>
                  <span>Empresa</span>
                  <span>Etiquetas</span>
                  <span></span>
                </div>
                {items.map((c) => (
                  <div key={c.id} className="table-row" onClick={() => setSelectedContact(c)}>
                    <span className="strong">{c.nombre}</span>
                    <span>
                      {c.correo && <span className="chip muted">{c.correo}</span>} {c.telefono}
                    </span>
                    <span>{c.empresa || '—'}</span>
                    <span className="chip-row">
                      {c.etiquetas.map((t) => (
                        <span key={t} className="chip">
                          {t}
                        </span>
                      ))}
                    </span>
                    <span className="actions">
                      <button
                        className="link"
                        onClick={(e) => {
                          e.stopPropagation();
                          setForm({ ...c });
                          setEditingId(c.id);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="link danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('¿Eliminar contacto y registros asociados?')) deleteContact(c.id);
                        }}
                      >
                        Eliminar
                      </button>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="empty">Sin resultados. Crea el primer contacto.</div>}
        </div>
      </div>

      {selectedContact && (
        <div className="drawer" onClick={() => setSelectedContact(null)}>
          <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <h3>{selectedContact.nombre}</h3>
                <p className="muted">Detalle del contacto</p>
              </div>
              <button className="link" onClick={() => setSelectedContact(null)}>
                Cerrar
              </button>
            </div>
            <div className="info-grid">
              <div>
                <p className="label">Correo</p>
                <p>{selectedContact.correo || '—'}</p>
              </div>
              <div>
                <p className="label">Teléfono</p>
                <p>{selectedContact.telefono || '—'}</p>
              </div>
              <div>
                <p className="label">Empresa</p>
                <p>{selectedContact.empresa || '—'}</p>
              </div>
              <div>
                <p className="label">Etiquetas</p>
                <p className="chip-row">
                  {selectedContact.etiquetas.map((t) => (
                    <span className="chip" key={t}>
                      {t}
                    </span>
                  ))}
                </p>
              </div>
            </div>
            <p className="label">Notas</p>
            <p>{selectedContact.notas || 'Sin notas'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
