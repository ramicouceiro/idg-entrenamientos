export interface Reserva {
  id: number;
  fecha: string;
  horario_id: number;
  clerk_user_id: string;
  disciplina: string;
  hora: string;
}

export interface HoraDisciplina {
    hora: string;
    disciplina: string;
}