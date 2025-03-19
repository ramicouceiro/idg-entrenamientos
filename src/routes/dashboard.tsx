import { useUser } from '@clerk/clerk-react'
import DashboardContent from '../components/DashboardContent';
import Layout from '../layouts/Layout';
import { usePlanificacionesStore } from '../stores/planificacionesStore';
import { useTurnosStore } from '../stores/turnosStore';
import { useEffect } from 'react';
import { getHoraDisciplinaById, getPlanificacionesByIdUsr, getTurnosByUser } from '../lib/api';

export default function DashboardPage() {
  const { user } = useUser();
  const clerkUserId = user?.id;
  const { planificaciones, setPlanificaciones } = usePlanificacionesStore();
  const { turnos, setTurnos } = useTurnosStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!clerkUserId) return;
      try {
        if(!planificaciones){
          const planificaciones = await getPlanificacionesByIdUsr(clerkUserId);
          setPlanificaciones(planificaciones);
        }

        if(!turnos){
          const turnos = await getTurnosByUser(clerkUserId);
          for (const turno of turnos) {
            const horaDisciplina = await getHoraDisciplinaById(turno.horario_id);
            turno.hora = horaDisciplina.hora;
            turno.disciplina = horaDisciplina.disciplina; 
          } 
          setTurnos(turnos);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [clerkUserId, planificaciones, setPlanificaciones, setTurnos, turnos]);

  return (
    <Layout user={user}>
      <main className="bg-gray-800 text-white p-6 w-full">
        <h1 className="text-2xl font-bold">👋 Buenos días {user?.firstName}!</h1>
        <DashboardContent user={user} />
      </main>
    </Layout>
  );
}