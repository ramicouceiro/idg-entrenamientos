import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
const API_URL = import.meta.env.VITE_API_URL;

interface Horario {
    id: number;
    dia_semana: string;
    hora: string;
    cupo_disponible: number;
    disciplina_id: number;
}

interface Reserva {
    id: number;
    fecha: string;
    horario_id: number;
    clerk_user_id: string;
    disciplina: string;
    hora: string;
}

interface Disciplina {
    id: number;
    nombre: string;
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
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const { user } = useUser();
    const clerkUserId = user?.id;

    const days = generateMonthDays();
    const currentTime = getCurrentTime();

    useEffect(() => {
        const fetchHorarios = async () => {
            if (!clerkUserId) return; // ⬅ Evitar ejecutar la petición si aún no hay usuario
    
            setLoading(true);
            try {
                const reservasUsr = await getTurnosByUser(clerkUserId);
                setReservas(reservasUsr);
    
                const dataDisciplinas: Disciplina[] = await getDisciplinas();
                setDisciplinas(dataDisciplinas);
    
                const data: Horario[] = await getCuposDisponibles();
                setHorariosDisponibles(data);
            } catch (err) {
                setError("Error obteniendo horarios: " + err);
            } finally {
                setLoading(false);
            }
        };
    
        fetchHorarios();
    }, [clerkUserId]);

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
            confirmButtonColor: "#22C55E",
            cancelButtonColor: "#EF4444",
        });
    
        if (result.isConfirmed) {
            try {
                await reservarTurno(formattedDate, horario.id, clerkUserId);
    
                // 🔹 Actualizar cupos disponibles
                setHorariosDisponibles((prevHorarios) =>
                    prevHorarios.map((h) =>
                        h.id === horario.id ? { ...h, cupo_disponible: h.cupo_disponible - 1 } : h
                    )
                );
    
                // 🔹 Agregar la nueva reserva al estado sin necesidad de recargar la página
                setReservas((prevReservas) => [
                    ...prevReservas,
                    {
                        id: Date.now(), // Generar un ID temporal
                        fecha: formattedDate,
                        horario_id: horario.id,
                        clerk_user_id: clerkUserId!,
                        disciplina: disciplinas.find(d => d.id === horario.disciplina_id)?.nombre || "",
                        hora: horario.hora,
                    },
                ]);
    
                Swal.fire({
                    title: "Reserva Confirmada",
                    text: `Tu turno para el ${formattedDate} ha sido reservado.`,
                    icon: "success",
                    background: "#1F2937",
                    color: "#FFFFFF",
                    confirmButtonColor: "#22C55E",
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

    const handleDeleteReserva = async (id: number) => {
        const result = await Swal.fire({
            title: "¿Estás seguro de que quieres cancelar el turno?",
            showCancelButton: true,
            confirmButtonText: "Cancelar Turno",
            cancelButtonText: "Cancelar",
            icon: "warning",
            background: "#1F2937",
            color: "#FFFFFF",
            confirmButtonColor: "#EF4444",
            denyButtonColor: "#9CA3AF",
            customClass: {
                popup: 'custom-swal-popup',
                title: 'custom-swal-title',
                confirmButton: 'custom-swal-confirm',
                denyButton: 'custom-swal-deny',
            }
        });

        if (result.isConfirmed) {
            try {
                await deleteReserva(id);
                setReservas((prevReservas) => prevReservas.filter((reserva) => reserva.id !== id));
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
                                {horariosDisponibles
                                    .filter(horario => horario.dia_semana === name && horario.cupo_disponible > 0)
                                    .map((horario, index) => {
                                        const userReserva = reservas.find(reserva => reserva.horario_id === horario.id);
                                        return (
                                            <div
                                                key={index}
                                                className={`p-2 xl:p-4 border border-gray-200 rounded-lg shadow-sm cursor-pointer transition ${userReserva ? 'bg-green-700' : 'bg-gray-700 hover:bg-gray-600'}`}
                                                onClick={() => {
                                                    if (userReserva) {
                                                        handleDeleteReserva(userReserva.id);
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
async function reservarTurno(fecha: string, horarioId: number, clerkUserId: string | undefined | null): Promise<void> {
    const response = await fetch(`${API_URL}/api/reservas/addReserva`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ fecha, horario_id: horarioId, clerk_user_id: clerkUserId }), // 🔹 Aquí corregimos los nombres
    });

    if (!response.ok) {
        throw new Error(`Error en la reserva: ${response.status} ${response.statusText}`);
    }
}

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

async function getTurnosByUser(clerkUserId: string): Promise<Reserva[]> {
    const response = await fetch(`${API_URL}/api/reservas/getReservasByIdUsr`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ clerkUserId }),
    });

    if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
    }

    return await response.json();
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
