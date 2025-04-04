import { useUser } from '@clerk/clerk-react'
import DashboardContent from '../components/DashboardContent';
import Layout from '../layouts/Layout';
import { usePlanificacionesStore } from '../stores/planificacionesStore';
import { useTurnosStore } from '../stores/turnosStore';
import { useHorariosStore } from '../stores/horariosStore';
import { useEffect, useRef, useState } from 'react';
import { getHoraDisciplinaById, getPlanificacionesByIdUsr, getTurnosByUser, getCuposDisponibles } from '../lib/api';
import PullToRefresh from 'react-simple-pull-to-refresh';

export default function DashboardPage() {
  const { user } = useUser();
  const clerkUserId = user?.id;
  const { setPlanificaciones } = usePlanificacionesStore();
  const { setTurnos } = useTurnosStore();
  const { setHorarios } = useHorariosStore();
  const [loading, setLoading] = useState<boolean>(true);

  const planificacionesRef = useRef(usePlanificacionesStore((state) => state.planificaciones));
  const turnosRef = useRef(useTurnosStore((state) => state.turnos));
  const horariosRef = useRef(useHorariosStore((state) => state.horarios));  
  const handleRefresh = () => {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    }).then(() => {
      window.location.reload();
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!clerkUserId) return;
      try {
        setLoading(true);
        if(!planificacionesRef.current.length){
          planificacionesRef.current = await getPlanificacionesByIdUsr(clerkUserId);
          setPlanificaciones(planificacionesRef.current);
        }

        if(!turnosRef.current.length){
          turnosRef.current = await getTurnosByUser(clerkUserId);
          for (const turno of turnosRef.current) {
            const horaDisciplina = await getHoraDisciplinaById(turno.horario_id);
            turno.hora = horaDisciplina.hora;
            turno.disciplina = horaDisciplina.disciplina; 
          } 
          setTurnos(turnosRef.current);
        }
        if(!horariosRef.current.length){
          horariosRef.current = await getCuposDisponibles();
          setHorarios(horariosRef.current);
        }
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [clerkUserId, setPlanificaciones, setTurnos, setHorarios]);

  return (
    <PullToRefresh onRefresh={handleRefresh} resistance={2} className="bg-gray-800 text-gray-800 items-center" maxPullDownDistance={60} pullDownThreshold={60}>
      <Layout user={user} loading={loading}>
        <main className="bg-gray-800 text-white p-6 w-full">
          <h1 className="text-2xl font-bold">👋 Buenos días {user?.firstName}!</h1>
          <DashboardContent user={user} />
        </main>
      </Layout>
    </PullToRefresh>
  );
}