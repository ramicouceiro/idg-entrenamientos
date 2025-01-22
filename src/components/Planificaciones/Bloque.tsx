import { EjercicioComponent } from "./Ejercicio";
import { Bloque } from "../../lib/mockPlanificaciones";

interface BloqueProps {
  bloque: Bloque;
}

export function BloqueComponent({ bloque }: BloqueProps) {
  return (
    <div className="bg-gray-700 p-4 rounded-md mb-4">
      <h2 className="text-lg font-bold">{bloque.nombre}</h2>

      {bloque.ejercicios.length > 0 ? (
        bloque.ejercicios.map((ejercicio) => (
          <EjercicioComponent key={ejercicio.id} ejercicio={ejercicio} />
        ))
      ) : (
        <p className="text-gray-400">No hay ejercicios en este bloque.</p>
      )}
    </div>
  );
}
