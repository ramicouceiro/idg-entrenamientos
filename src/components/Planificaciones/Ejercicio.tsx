import { useState } from "react";
import { motion } from "framer-motion";
import { Ejercicio } from "../../lib/mockPlanificaciones";
import { FaClock } from "react-icons/fa";
import { useTimer } from "../../hooks/useTimerContext";

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
  const { startTimer, timerActive } = useTimer();

  return (
    <>
    <div className="bg-gray-600 p-3 rounded-md mt-2">
      <button
        className="w-full text-left bg-gray-800 flex justify-between items-center text-lg font-semibold focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {ejercicio.nombre}
        <span>{isOpen ? "▲" : "▼"}</span>
      </button>

      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="mt-2 bg-gray-700 p-2 rounded-md">
          <button 
            className="flex justify-end items-center text-blue-300 text-right text-sm font-bold gap-1 hover:text-blue-400 transition-colors" 
            onClick={() => startTimer(ejercicio.descanso)}
            disabled={timerActive}
          >
            <FaClock />{ejercicio.descanso}s
          </button>

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
                  <td className="p-2">{serie.numero}</td>
                  <td className="p-2">{serie.repeticiones}</td>
                  <td className="p-2">{serie.peso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
    </>
  );
}
