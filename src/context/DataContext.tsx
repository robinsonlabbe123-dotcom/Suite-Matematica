import React, { createContext, useContext, useMemo } from 'react';
import { nanoid } from 'nanoid';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Activity, ActivityType, Contact, Opportunity, OpportunityState } from '../types';

const currency = 'CLP';

const seedContacts: Contact[] = [
  {
    id: 'c1',
    nombre: 'Ana Pérez',
    correo: 'ana@acme.com',
    telefono: '+56 9 1111 1111',
    empresa: 'ACME',
    notas: 'Cliente interesada en renovar licencias.',
    etiquetas: ['vip', 'santiago'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'c2',
    nombre: 'Carlos Díaz',
    correo: 'carlos@innovate.cl',
    telefono: '+56 9 2222 2222',
    empresa: 'Innovate',
    notas: 'Le interesa implementación rápida.',
    etiquetas: ['prospecto'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const seedOpportunities: Opportunity[] = [
  {
    id: 'o1',
    contactId: 'c1',
    titulo: 'Renovación 2025',
    valor: 2500000,
    estado: 'en_progreso',
    cierreEstimado: new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'o2',
    contactId: 'c2',
    titulo: 'Implementación inicial',
    valor: 1500000,
    estado: 'nuevo',
    cierreEstimado: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const seedActivities: Activity[] = [
  {
    id: 'a1',
    contactId: 'c1',
    opportunityId: 'o1',
    tipo: 'correo',
    fechaHora: new Date().toISOString(),
    descripcion: 'Envío de propuesta renovada',
    resultado: 'Esperando respuesta',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'a2',
    contactId: 'c2',
    tipo: 'llamada',
    fechaHora: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    descripcion: 'Llamada de presentación',
    resultado: 'Agendar demo',
    createdAt: new Date().toISOString(),
  },
];

export type DataContextType = {
  contacts: Contact[];
  opportunities: Opportunity[];
  activities: Activity[];
  currency: string;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  addOpportunity: (opportunity: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void;
  deleteOpportunity: (id: string) => void;
  addActivity: (activity: Omit<Activity, 'id' | 'createdAt'>) => void;
  deleteActivity: (id: string) => void;
};

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [contacts, setContacts] = useLocalStorage<Contact[]>('crm_contacts', seedContacts);
  const [opportunities, setOpportunities] = useLocalStorage<Opportunity[]>('crm_opportunities', seedOpportunities);
  const [activities, setActivities] = useLocalStorage<Activity[]>('crm_activities', seedActivities);

  const addContact: DataContextType['addContact'] = (contact) => {
    const timestamp = new Date().toISOString();
    setContacts((prev) => [
      ...prev,
      { ...contact, id: nanoid(), createdAt: timestamp, updatedAt: timestamp },
    ]);
  };

  const updateContact: DataContextType['updateContact'] = (id, updates) => {
    const timestamp = new Date().toISOString();
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates, updatedAt: timestamp } : c)));
  };

  const deleteContact: DataContextType['deleteContact'] = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    setOpportunities((prev) => prev.filter((o) => o.contactId !== id));
    setActivities((prev) => prev.filter((a) => a.contactId !== id));
  };

  const addOpportunity: DataContextType['addOpportunity'] = (opportunity) => {
    const timestamp = new Date().toISOString();
    setOpportunities((prev) => [
      ...prev,
      { ...opportunity, id: nanoid(), createdAt: timestamp, updatedAt: timestamp },
    ]);
  };

  const updateOpportunity: DataContextType['updateOpportunity'] = (id, updates) => {
    const timestamp = new Date().toISOString();
    setOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates, updatedAt: timestamp } : o)));
  };

  const deleteOpportunity: DataContextType['deleteOpportunity'] = (id) => {
    setOpportunities((prev) => prev.filter((o) => o.id !== id));
    setActivities((prev) => prev.filter((a) => a.opportunityId !== id));
  };

  const addActivity: DataContextType['addActivity'] = (activity) => {
    const timestamp = new Date().toISOString();
    setActivities((prev) => [
      { ...activity, id: nanoid(), createdAt: timestamp },
      ...prev,
    ]);
  };

  const deleteActivity: DataContextType['deleteActivity'] = (id) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  const value = useMemo(
    () => ({
      contacts,
      opportunities,
      activities,
      currency,
      addContact,
      updateContact,
      deleteContact,
      addOpportunity,
      updateOpportunity,
      deleteOpportunity,
      addActivity,
      deleteActivity,
    }),
    [contacts, opportunities, activities],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData debe usarse dentro de DataProvider');
  return ctx;
};

export const statusLabels: Record<OpportunityState, string> = {
  nuevo: 'Nuevo',
  en_progreso: 'En progreso',
  ganado: 'Ganado',
  perdido: 'Perdido',
};

export const activityLabels: Record<ActivityType, string> = {
  llamada: 'Llamada',
  correo: 'Correo',
  reunion: 'Reunión',
  tarea: 'Tarea',
};
