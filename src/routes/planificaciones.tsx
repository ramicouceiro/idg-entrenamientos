import { useEffect, useState } from "react";
import { Planificacion, Dias } from "../lib/mockPlanificaciones";
import Layout from "../layouts/Layout";
import { PlanificacionDetail } from "../components/Planificaciones/PlanificacionDetail";
import { useUser } from "@clerk/clerk-react";
import { usePlanificacionesStore } from "../stores/planificacionesStore";
const API_URL = import.meta.env.VITE_API_URL;

export default function PlanificacionesPage() {
  const [selectedPlan, setSelectedPlan] = useState<Planificacion | null>(null);
  const [selectedDia, setSelectedDia] = useState<Dias | null>(null);
  const { planificaciones, setPlanificaciones } = usePlanificacionesStore();
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useUser();
  const clerkUserId = user?.id;

  useEffect(() => {
    const fetchPlanificaciones = async () => {
      if (!clerkUserId) return; // ⬅ Evitar ejecutar la petición si aún no hay usuario
      setLoading(true);
      try {
          const planificaciones = await getPlanificacionesByIdUsr(clerkUserId);
          setPlanificaciones(planificaciones);
      } catch (err) {
          console.log(err);
      } finally {
          setLoading(false);
      }
  };
  if(!planificaciones){
    fetchPlanificaciones();
  }else{
    setLoading(false);
  }
  }, [clerkUserId, setPlanificaciones, planificaciones]);

  return (
    <Layout user={user} loading={loading}>
      <main className="bg-gray-800 text-white p-2 xl:p-6 mb-24 xl:mb-0">
        <h1 className="text-2xl font-bold mb-8">Planificaciones</h1>
        {loading ? (
          <p className="text-center">Cargando planificaciones...</p>
        ) : !selectedPlan ? (
          <div>
            {planificaciones.map((plan) => (
              <button
                key={plan.id}
                className="block bg-gray-700 hover:bg-gray-600 text-white p-10 rounded-md mb-2 w-full text-center text-xl font-bold"
                onClick={() => setSelectedPlan(plan)}
              >
                {plan.nombre}
              </button>
            ))}
          </div>
        ) : !selectedDia ? (
          <div>
            <button
              className="mb-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
              onClick={() => setSelectedPlan(null)}
            >
              ⬅ Planificaciones
            </button>
            <h2 className="text-xl font-semibold mb-3">{selectedPlan.nombre}</h2>
            {selectedPlan.dias.map((dia) => (
              <button
                key={dia.id}
                className="block bg-gray-700 hover:bg-gray-600 text-white p-10 rounded-md mb-2 w-full text-center text-xl font-bold"
                onClick={() => setSelectedDia(dia)}
              >
                {dia.nombre}
              </button>
            ))}
          </div>
        ) : (
          <div>
            <button
              className="mb-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
              onClick={() => setSelectedDia(null)}
            >
              ⬅ {selectedPlan.nombre}
            </button>
            <h2 className="text-xl font-semibold mb-3">{selectedDia.nombre}</h2>
            <PlanificacionDetail dia={selectedDia} />
          </div>
        )}
      </main>
    </Layout>
  );
}

const getPlanificacionesByIdUsr = async (clerkUserId : string) =>{
  try {
    const response = await fetch(`${API_URL}/api/planificaciones/getPlanificaciones`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({clerkUserId}),
    });
    if (!response.ok) {
      throw new Error(`Error al obtener planificaciones: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching planificaciones:", error);
    return [];
  }
}
