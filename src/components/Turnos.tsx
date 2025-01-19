import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;

interface Horario {
    id: number;
    dia_semana: string;
    hora: string;
    cupo_disponible: number;
}

// Genera los días restantes del mes
const generateMonthDays = () => {
    const today = new Date().getDate();
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth - today + 1 }, (_, i) => {
        const date = new Date(new Date().getFullYear(), new Date().getMonth(), today + i);
        const dayName = date.toLocaleDateString("es-ES", { weekday: "long" });
        return { day: today + i, name: dayName.charAt(0).toUpperCase() + dayName.slice(1).toLowerCase() };
    });
};

// Obtiene la hora actual en minutos
const getCurrentTime = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
};

const Turnos: React.FC = () => {
    const [horariosDisponibles, setHorariosDisponibles] = useState<Horario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const days = generateMonthDays();
    const currentTime = getCurrentTime();

    useEffect(() => {
        const fetchHorarios = async () => {
            try {
                const data: Horario[] = await getCuposDisponibles();
                setHorariosDisponibles(data);
            } catch (err) {
                setError("Error obteniendo horarios" + err);
            } finally {
                setLoading(false);
            }
        };

        fetchHorarios();
    }, []);

    // Filtrar los días con horarios futuros
    const filteredDays = days.filter(({ day, name }) => {
        const horarios = horariosDisponibles.filter(horario => horario.dia_semana === name);

        // Filtrar los horarios que aún no han pasado y tienen cupos disponibles
        const horariosFuturos = horarios.filter(horario => {
            const [hour, minute] = horario.hora.split(":").map(Number);
            const turnoTime = hour * 60 + minute;
            return (day !== new Date().getDate() || turnoTime >= currentTime) && horario.cupo_disponible > 0;
        });

        return horariosFuturos.length > 0;
    });

    if (loading) return <p className="text-white">Cargando horarios...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-4 bg-gray-900 mt-0 xl:mt-5 rounded-xl h-auto">
            <h2 className="text-xl font-bold text-white">Agenda</h2>
            <p className="mb-2 text-gray-400">Agenda tu turno aquí</p>
            <div className="relative overflow-x-hidden">
                <div className="flex overflow-x-auto space-x-4 p-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 w-full max-w-full no-scrollbar snap-x snap-mandatory">
                    {filteredDays.map(({ day, name }) => (
                        <div key={day} className="bg-gray-800 shadow-md rounded-lg p-4 min-w-[250px] flex-shrink-0 snap-start">
                            <h3 className="text-lg font-semibold text-white mb-3">{name} {day}</h3>
                            <div className="flex flex-col gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 h-auto">
                                {horariosDisponibles
                                    .filter(horario => horario.dia_semana === name && horario.cupo_disponible > 0)
                                    .map((horario, index) => (
                                        <div key={index} className="p-2 xl:p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-700 cursor-pointer">
                                            <p className="text-lg font-semibold text-green-400">{horario.hora}</p>
                                            <p className="text-md text-white">Fuerza y Acondicionamiento</p>
                                            <p className="text-sm text-gray-400">Cupos disponibles: {horario.cupo_disponible}</p>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

async function getCuposDisponibles(): Promise<Horario[]> {
    try {
        const response = await fetch(`${API_URL}/api/reservas/getCuposDisponibles`);
        if (!response.ok) throw new Error("Error obteniendo horarios");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default Turnos;
