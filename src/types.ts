export type Contact = {
  id: string;
  nombre: string;
  correo?: string;
  telefono?: string;
  empresa?: string;
  notas?: string;
  etiquetas: string[];
  createdAt: string;
  updatedAt: string;
};

export type OpportunityState = 'nuevo' | 'en_progreso' | 'ganado' | 'perdido';

export type Opportunity = {
  id: string;
  contactId: string;
  titulo: string;
  valor: number;
  estado: OpportunityState;
  cierreEstimado?: string;
  createdAt: string;
  updatedAt: string;
};

export type ActivityType = 'llamada' | 'correo' | 'reunion' | 'tarea';

export type Activity = {
  id: string;
  contactId?: string;
  opportunityId?: string;
  tipo: ActivityType;
  fechaHora: string;
  descripcion?: string;
  resultado?: string;
  completado?: boolean;
  createdAt: string;
};
