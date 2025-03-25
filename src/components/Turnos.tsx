import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useTurnosStore } from "../stores/turnosStore";
import { useHorariosStore } from "../stores/horariosStore";
const API_URL = import.meta.env.VITE_API_URL;

interface Horario {
    id: number;
    dia_semana: string;
    hora: string;
    cupo_disponible: number;
    disciplina_id: number;
}

interface Disciplina {
    id: number;
    nombre: string;
}

// Genera los días restantes del mes y, a partir del día 28, también los días del mes siguiente
const generateMonthDays = () => {
    const today = new Date().getDate();
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const days = Array.from({ length: daysInMonth - today + 1 }, (_, i) => {
        const date = new Date(new Date().getFullYear(), new Date().getMonth(), today + i);
        const dayName = date.toLocaleDateString("es-ES", { weekday: "long" });
        return { day: today + i, name: dayName.charAt(0).toUpperCase() + dayName.slice(1).toLowerCase() };
    });

    // Si hoy es 28 o más, agregar los días del mes siguiente
    if (today >= 27) {
        const nextMonthDays = Array.from({ length: 30 }, (_, i) => {
            const date = new Date(new Date().getFullYear(), new Date().getMonth() + 1, i + 1);
            const dayName = date.toLocaleDateString("es-ES", { weekday: "long" });
            return { day: i + 1, name: dayName.charAt(0).toUpperCase() + dayName.slice(1).toLowerCase() };
        });
        days.push(...nextMonthDays);
    }

    return days;
};

// Obtiene la hora actual en minutos
const getCurrentTime = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
};

const Turnos: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const { horarios, setHorarios } = useHorariosStore();  
    const { turnos, setTurnos } = useTurnosStore();      
    const { user } = useUser();
    const clerkUserId = user?.id;

    const days = generateMonthDays();
    const currentTime = getCurrentTime();

    useEffect(() => {
        const initializeDisciplinas = async () => {
            try {
                const dataDisciplinas = await getDisciplinas();
                setDisciplinas(dataDisciplinas);
            } catch (err) {
                setError("Error obteniendo disciplinas: " + err);
            } finally {
                setLoading(false);
            }
        };
        
        initializeDisciplinas();
    }, []);

    // Filtrar los días con horarios futuros
    const filteredDays = days.filter(({ day, name }) => {
        // Filtrar los horarios que aún no han pasado y tienen cupos disponibles
        const horariosFuturos = horarios.filter(horario => {
            if (horario.dia_semana !== name) return false;

            const [hours, minutes] = horario.hora.split(':').map(Number);
            const horarioMinutes = hours * 60 + minutes;

            return day === new Date().getDate() 
                ? horarioMinutes > currentTime && horario.cupo_disponible > 0
                : horario.cupo_disponible > 0;
        });

        return horariosFuturos.length > 0;
    });

    const handleReserva = async (horario: Horario, day: number) => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    
        console.log("Fecha de la reserva enviada:", formattedDate);
    
        const result = await Swal.fire({
            title: "Confirmar Reserva",
            text: `¿Quieres reservar el turno de ${horario.hora} para el ${formattedDate}?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Reservar",
            cancelButtonText: "Cancelar",
            background: "#1F2937",
            color: "#FFFFFF",
        });

        if (result.isConfirmed) {
            try {
                const turnoId = await reservarTurno(formattedDate, horario.id, clerkUserId);
    
                // 🔹 Actualizar cupos disponibles
                setHorarios((prevHorarios) =>
                    prevHorarios.map((h) =>
                        h.id === horario.id ? { ...h, cupo_disponible: h.cupo_disponible - 1 } : h
                    )
                );
    
                // 🔹 Agregar la nueva reserva al estado sin necesidad de recargar la página
                setTurnos((prevTurnos) => [
                    ...prevTurnos,
                    {
                        id: turnoId,
                        fecha: formattedDate,
                        horario_id: horario.id,
                        clerk_user_id: clerkUserId!,
                        disciplina: disciplinas.find(d => d.id === horario.disciplina_id)?.nombre || "",
                        hora: horario.hora,
                    },
                ]);
    
                Swal.fire({
                    title: "Reserva Confirmada",
                    text: "Tu turno fue reservado correctamente.",
                    icon: "success",
                    background: "#1F2937",
                    color: "#FFFFFF",
                });
            } catch (error) {
                console.error("Error al reservar el turno:", error);
                Swal.fire({
                    title: "Error",
                    text: "No se pudo reservar el turno.",
                    icon: "error",
                    background: "#1F2937",
                    color: "#FFFFFF",
                    confirmButtonColor: "#EF4444",
                });
            }
        }
    };

    const handleDeleteReserva = async (id: number, horarioId: number) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, cancelar turno",
            cancelButtonText: "No, mantener turno",
            background: "#1F2937",
            color: "#FFFFFF",
            customClass: {
                title: 'custom-swal-title',
                confirmButton: 'custom-swal-confirm',
                denyButton: 'custom-swal-deny',
            }
        });

        if (result.isConfirmed) {
            try {
                await deleteReserva(id);
                // Actualizar el estado de turnos
                setTurnos((prevTurnos) => prevTurnos.filter(turno => turno.id !== id));
                // Actualizar cupos disponibles
                setHorarios((prevHorarios) =>
                    prevHorarios.map((h) =>
                        h.id === horarioId ? { ...h, cupo_disponible: h.cupo_disponible + 1 } : h
                    )
                );
                Swal.fire({
                    title: "Turno cancelado",
                    text: "Tu turno fue cancelado correctamente.",
                    icon: "success",
                    background: "#1F2937",
                    color: "#FFFFFF",
                    confirmButtonColor: "#22C55E"
                });
            } catch (error) {
                console.error("Error eliminando la reserva:", error);
                Swal.fire({
                    title: "Error",
                    text: "No se pudo cancelar el turno.",
                    icon: "error",
                    background: "#1F2937",
                    color: "#FFFFFF",
                    confirmButtonColor: "#EF4444"
                });
            }
        }
    };
    

    if (loading && !clerkUserId) return <div className="w-full h-full flex justify-center items-center"><div
    className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"></div></div>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-4 bg-gray-900 mt-0 rounded-xl h-[calc(100vh-2rem)] flex flex-col">
            <h2 className="text-xl font-bold text-white">Agenda</h2>
            <p className="mb-2 text-gray-400">Agenda tu turno aquí</p>

            {/* Contenedor flexible para aprovechar el espacio restante */}
            <div className="relative flex-1 overflow-hidden">
                {/* Scroll horizontal en móviles */}
                <div className="flex overflow-x-auto space-x-4 p-2 w-full max-w-full no-scrollbar snap-x snap-mandatory">
                    {filteredDays.map(({ day, name }) => (
                        <div key={day} className="bg-gray-800 shadow-md rounded-lg p-4 min-w-[250px] flex-shrink-0 snap-start flex flex-col h-full max-h-full overflow-hidden">
                            <h3 className="text-lg font-semibold text-white mb-3">{name} {day}</h3>
                            {/* Contenedor con scroll si hay demasiados horarios */}
                            <div className="flex flex-col gap-4 overflow-y-auto flex-grow max-h-[60vh] sm:max-h-[75vh] custom-scroll">
                            {horarios
                                .filter(horario => horario.dia_semana === name && horario.cupo_disponible > 0)
                                .map((horario, index) => {
                                    const formattedDate = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
                                    const userReserva = turnos.find(turno => turno.horario_id === horario.id && turno.fecha === formattedDate);
                                    
                                    return (
                                        <div
                                            key={index}
                                            className={`p-2 xl:p-4 rounded-lg shadow-sm cursor-pointer transition ${userReserva ? 'bg-green-700' : 'bg-gray-700 hover:bg-gray-600'}`}
                                            onClick={() => {
                                                if (userReserva) {
                                                    handleDeleteReserva(userReserva.id, horario.id);
                                                } else {
                                                    handleReserva(horario, day);
                                                }
                                            }}
                                        >
                                            <p className="text-lg font-semibold text-green-400">{horario.hora}</p>
                                            <p className="text-md text-white">{disciplinas.find(disciplina => disciplina.id === horario.disciplina_id)?.nombre}</p>
                                            <p className="text-sm text-gray-400">Cupos disponibles: {horario.cupo_disponible}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Función para reservar un turno en la API
async function reservarTurno(fecha: string, horarioId: number, clerkUserId: string | undefined | null): Promise<number> {
    const response = await fetch(`${API_URL}/api/reservas/addReserva`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ fecha, horario_id: horarioId, clerk_user_id: clerkUserId }),
    });
    
    if (!response.ok) {
        throw new Error(`Error en la reserva: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.id; // Assuming the API returns an object with an 'id' field
}

// async function getCuposDisponibles(): Promise<Horario[]> {
//     try {
//         const response = await fetch(`${API_URL}/api/horarios/getCuposDisponibles`);
//         if (!response.ok) throw new Error("Error obteniendo horarios");
//         return await response.json();
//     } catch (error) {
//         console.error(error);
//         return [];
//     }
// }

async function getDisciplinas(): Promise<Disciplina[]> {
    try {
        const response = await fetch(`${API_URL}/api/disciplinas/getDisciplinas`);
        if (!response.ok) throw new Error("Error obteniendo disciplinas");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function deleteReserva(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/reservas/deleteReserva`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
    });

    if (!response.ok) {
        throw new Error(`Error en la eliminación: ${response.status} ${response.statusText}`);
    }
};

export default Turnos;
