import { useState } from "react";
import { mockPlanificaciones, Planificacion } from "../lib/mockPlanificaciones";
import Layout from "../layouts/Layout";
import { PlanificacionDetail } from "../components/Planificaciones/PlanificacionDetail";
import { useUser } from "@clerk/clerk-react";

export default function PlanificacionesPage() {
  const [selectedPlan, setSelectedPlan] = useState<Planificacion | null>(null);
  const { user } = useUser();
  return (
    <Layout user={user}>
      <main className="bg-gray-800 text-white p-2 xl:p-6 mb-24 xl:mb-0">
        <h1 className="text-2xl font-bold mb-4">Planificaciones</h1>

        {/* Mostrar la lista de días */}
        {!selectedPlan ? (
          <div>
            {mockPlanificaciones.map((plan) => (
              <button
                key={plan.id}
                className="block bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md mb-2 w-full text-left"
                onClick={() => setSelectedPlan(plan)}
              >
                {plan.nombre}
              </button>
            ))}
          </div>
        ) : (
          // Mostrar los bloques de un día si se seleccionó
          <div>
            <button
              className="mb-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
              onClick={() => setSelectedPlan(null)}
            >
              ⬅ Volver
            </button>
            <PlanificacionDetail planificacion={selectedPlan} />
          </div>
        )}
      </main>
    </Layout>
  );
}
