import { useState } from 'react';
import { ActivitiesSection } from './components/ActivitiesSection';
import { ContactsSection } from './components/ContactsSection';
import { PipelineSection } from './components/PipelineSection';
import { DataProvider } from './context/DataContext';

const views = [
  { id: 'contacts', label: 'Contactos', component: ContactsSection },
  { id: 'pipeline', label: 'Pipeline', component: PipelineSection },
  { id: 'activities', label: 'Actividades', component: ActivitiesSection },
] as const;

type ViewId = typeof views[number]['id'];

function AppContent() {
  const [view, setView] = useState<ViewId>('contacts');
  const Active = views.find((v) => v.id === view)?.component ?? ContactsSection;

  return (
    <div className="layout">
      <header className="topbar">
        <div>
          <p className="eyebrow">CRM simple</p>
          <h1>Suite CRM liviano</h1>
          <p className="muted">Contactos, oportunidades y actividades en una sola vista.</p>
        </div>
        <div className="top-actions">
          <button className="secondary" onClick={() => setView('contacts')}>
            Nuevo contacto
          </button>
          <button className="secondary" onClick={() => setView('pipeline')}>
            Nueva oportunidad
          </button>
          <button className="primary" onClick={() => setView('activities')}>
            Nueva actividad
          </button>
        </div>
      </header>

      <nav className="tabs">
        {views.map((v) => (
          <button
            key={v.id}
            className={view === v.id ? 'tab active' : 'tab'}
            onClick={() => setView(v.id)}
          >
            {v.label}
          </button>
        ))}
      </nav>

      <main className="content">
        <Active />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}
