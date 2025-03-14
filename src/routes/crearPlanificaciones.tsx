import { useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

interface Serie {
  numero: number;
  repeticiones: string;
  peso: number;
}

interface Ejercicio {
  id: string;
  nombre: string;
  series: Serie[];
  descanso: number;
}

interface Bloque {
  id: string;
  nombre: string;
  ejercicios: Ejercicio[];
}

interface Dia {
  id: string;
  nombre: string;
  bloques: Bloque[];
}

export default function CrearPlanificacionesPage() {
  const [nombrePlan, setNombrePlan] = useState("");
  const [dias, setDias] = useState<Dia[]>([]);
  const [diaActivo, setDiaActivo] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const agregarDia = () => {
    const nuevoDia = { id: crypto.randomUUID(), nombre: "Nuevo Día", bloques: [] };
    setDias([...dias, nuevoDia]);
    setDiaActivo(dias.length);
  };

  const agregarBloque = (diaIndex: number) => {
    const nuevosDias = [...dias];
    nuevosDias[diaIndex].bloques.push({ id: crypto.randomUUID(), nombre: "", ejercicios: [] });
    setDias(nuevosDias);
  };

  const agregarEjercicio = (diaIndex: number, bloqueIndex: number) => {
    const nuevosDias = [...dias];
    nuevosDias[diaIndex].bloques[bloqueIndex].ejercicios.push({
      id: crypto.randomUUID(),
      nombre: "",
      series: [{ numero: 1, repeticiones: "", peso: 0 }],
      descanso: 0,
    });
    setDias(nuevosDias);
  };

  const agregarSerie = (diaIndex: number, bloqueIndex: number, ejercicioIndex: number) => {
    const nuevosDias = [...dias];
    const ejercicio = nuevosDias[diaIndex].bloques[bloqueIndex].ejercicios[ejercicioIndex];
    ejercicio.series.push({
      numero: ejercicio.series.length + 1,
      repeticiones: "",
      peso: 0,
    });
    setDias(nuevosDias);
  };

  const enviarPlanificacion = async () => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(`${API_URL}/api/planificaciones/createPlanificacion`, {
        nombre: nombrePlan,
        dias: dias
      });
      
      if (response.status === 201) {
        alert('Planificación guardada exitosamente');
        // Reset form
        setNombrePlan('');
        setDias([]);
        setDiaActivo(null);
      }
    } catch (error: unknown) {
      console.error('Error al guardar la planificación:', error);
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.error || 'Error al guardar la planificación'
        : 'Error al guardar la planificación';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-gray-200 rounded-xl mt-5">
      <h1 className="text-2xl font-bold">Crear Nueva Planificación</h1>
      <input
        type="text"
        placeholder="Nombre de la planificación"
        value={nombrePlan}
        onChange={(e) => setNombrePlan(e.target.value)}
        className="block w-full p-2 mt-2 bg-gray-800 text-gray-300 rounded placeholder-gray-500"
      />

      <button
        onClick={agregarDia}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        + Agregar Día
      </button>

      <div className="flex space-x-2 mt-4 overflow-x-auto">
        {dias.map((dia, index) => (
          <button
            key={dia.id}
            onClick={() => setDiaActivo(index)}
            className={`px-4 py-2 rounded-t-md ${diaActivo === index ? "bg-gray-700 text-white" : "bg-gray-600 text-gray-300"}`}
          >
            {dia.nombre}
          </button>
        ))}
      </div>

      {diaActivo !== null && dias[diaActivo] && (
        <div className="p-4 bg-gray-800 rounded-b-md mt-2">
          <input
            type="text"
            placeholder="Nombre del día"
            value={dias[diaActivo].nombre}
            onChange={(e) => {
              const nuevosDias = [...dias];
              nuevosDias[diaActivo].nombre = e.target.value;
              setDias(nuevosDias);
            }}
            className="block w-full p-2 bg-gray-700 text-gray-300 rounded"
          />
          <button
            onClick={() => agregarBloque(diaActivo)}
            className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded"
          >
            + Agregar Bloque
          </button>

          {dias[diaActivo].bloques.map((bloque, bloqueIndex) => (
            <div key={bloque.id} className="mt-4 p-4 bg-gray-700 rounded">
              <input
                type="text"
                placeholder="Nombre del bloque"
                value={bloque.nombre}
                onChange={(e) => {
                  const nuevosDias = [...dias];
                  nuevosDias[diaActivo].bloques[bloqueIndex].nombre = e.target.value;
                  setDias(nuevosDias);
                }}
                className="block w-full p-2 bg-gray-600 text-gray-300 rounded"
              />
              <button
                onClick={() => agregarEjercicio(diaActivo, bloqueIndex)}
                className="mt-2 bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
              >
                + Agregar Ejercicio
              </button>
              {bloque.ejercicios.map((ejercicio, ejercicioIndex) => (
                <div key={ejercicio.id} className="mt-2 p-3 bg-gray-600 rounded">
                  <input
                    type="text"
                    placeholder="Nombre del ejercicio"
                    value={ejercicio.nombre}
                    onChange={(e) => {
                      const nuevosDias = [...dias];
                      nuevosDias[diaActivo].bloques[bloqueIndex].ejercicios[ejercicioIndex].nombre = e.target.value;
                      setDias(nuevosDias);
                    }}
                    className="block w-full p-2 bg-gray-500 text-gray-300 rounded"
                  />
                  {ejercicio.series.map((serie, serieIndex) => (
                    <div key={serie.numero} className="mt-2 flex space-x-2 items-center">
                      <p>Serie {serie.numero}</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Repeticiones"
                          value={serie.repeticiones}
                          onChange={(e) => {
                            const nuevosDias = [...dias];
                            nuevosDias[diaActivo].bloques[bloqueIndex].ejercicios[ejercicioIndex].series[serieIndex].repeticiones = e.target.value;
                            setDias(nuevosDias);
                          }}
                          className="w-1/3 p-2 bg-gray-500 text-gray-300 rounded placeholder-gray-500"
                        />
                        <input
                          type="number"
                          placeholder="Peso (kg)"
                          value={serie.peso}
                          onChange={(e) => {
                            const nuevosDias = [...dias];
                            nuevosDias[diaActivo].bloques[bloqueIndex].ejercicios[ejercicioIndex].series[serieIndex].peso = Number(e.target.value);
                            setDias(nuevosDias);
                          }}
                          className="w-1/3 p-2 bg-gray-500 text-gray-300 rounded placeholder-gray-500"
                        />
                        </div>
                    </div>
                  ))}
                  <button
                    onClick={() => agregarSerie(diaActivo, bloqueIndex, ejercicioIndex)}
                    className="mt-2 bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded"
                  >
                    + Agregar Serie
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 flex justify-end">
        <button
          onClick={enviarPlanificacion}
          disabled={isSubmitting || !nombrePlan || dias.length === 0}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar Planificación'}
        </button>
      </div>
    </div>
  );
}
