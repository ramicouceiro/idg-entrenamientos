import { Planificacion } from "../../lib/mockPlanificaciones";
import { BloqueComponent } from "./Bloque";

interface PlanificacionDetailProps {
  planificacion: Planificacion;
}

export function PlanificacionDetail({ planificacion }: PlanificacionDetailProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-2">{planificacion.nombre}</h2>
      {planificacion.bloques.length > 0 ? (
        planificacion.bloques.map((bloque) => (
          <BloqueComponent key={bloque.id} bloque={bloque} />
        ))
      ) : (
        <p>No hay bloques en esta planificación.</p>
      )}
    </div>
  );
}
