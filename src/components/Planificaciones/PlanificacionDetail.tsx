import { Dias } from "../../lib/mockPlanificaciones";
import { BloqueComponent } from "./Bloque";

interface PlanificacionDetailProps {
  dia: Dias;
}

export function PlanificacionDetail({ dia }: PlanificacionDetailProps) {
  return (
    <div>
      {/* <h2 className="text-xl font-bold mb-2">{dia.nombre}</h2> */}
      {dia.bloques.length > 0 ? (
        dia.bloques.map((bloque) => (
          <BloqueComponent key={bloque.id} bloque={bloque} />
        ))
      ) : (
        <p>No hay bloques en este día.</p>
      )}
    </div>
  );
}

