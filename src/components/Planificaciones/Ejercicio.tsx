import { useState } from "react";
import { motion } from "framer-motion";
import { Ejercicio } from "../../lib/mockPlanificaciones";

export interface Serie {
  numero: number;
  repeticiones: number;
  peso: number;
}

interface EjercicioProps {
  ejercicio: Ejercicio;
}

export function EjercicioComponent({ ejercicio }: EjercicioProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-600 p-3 rounded-md mt-2">
      {/* Botón para abrir/cerrar el desplegable */}
      <button
        className="w-full text-left bg-gray-800 flex justify-between items-center text-lg font-semibold focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {ejercicio.nombre}
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* Contenido desplegable con animación */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="mt-2 bg-gray-700 p-2 rounded-md">
          <p className="text-gray-300">⏳ <strong>Descanso entre series:</strong> {ejercicio.descanso}s</p>

          {/* Tabla de Series */}
          <table className="w-full mt-2 border-collapse">
            <thead>
              <tr className="border-b border-gray-500">
                <th className="text-left p-2">Serie</th>
                <th className="text-left p-2">Repeticiones</th>
                <th className="text-left p-2">Peso (kg)</th>
              </tr>
            </thead>
            <tbody>
              {ejercicio.series.map((serie) => (
                <tr key={serie.numero} className="border-b border-gray-500">
                  <td className="p-2">#{serie.numero}</td>
                  <td className="p-2">{serie.repeticiones}</td>
                  <td className="p-2">{serie.peso} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
