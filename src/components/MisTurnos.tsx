import { FaPlus, FaRegTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;

interface Reserva {
    id: number;
    fecha: string;
    horario_id: number;
    clerk_user_id: number;
    disciplina: string;
    hora: string;
}

interface HoraDisciplina {
    hora: string;
    disciplina: string;
}

export default function MisTurnos() {
    const { user } = useUser();
    const [horarios, setHorarios] = useState<Reserva[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Estado para Skeleton

    useEffect(() => {
        if (user) {
            setLoading(true); // Activa el skeleton antes de cargar los datos
            const clerkUserId: string = user.id;

            getTurnosByUser(clerkUserId).then(async (reservas) => {
                const reservasCompletas = await Promise.all(
                    reservas.map(async (reserva) => {
                        const horaDisciplina = await getHoraDisciplinaById(reserva.horario_id);
                        return { ...reserva, hora: horaDisciplina.hora, disciplina: horaDisciplina.disciplina };
                    })
                );
                reservasCompletas.sort((a, b) => {
                    const fechaA = new Date(`${a.fecha}T${a.hora}`);
                    const fechaB = new Date(`${b.fecha}T${b.hora}`);
                    return fechaA.getTime() - fechaB.getTime();
                });
                setHorarios(reservasCompletas);
                setLoading(false); // Desactiva el skeleton cuando los datos están listos
            }).catch(error => {
                console.error("Error obteniendo turnos:", error);
                setLoading(false); // Desactiva el skeleton en caso de error
            });
        }
    }, [user]);

    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const handleDelete = (id: number) => {
        Swal.fire({
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
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Llamar a la API para eliminar la reserva
                    await deleteReserva(id);
                    // Actualizar el estado eliminando el turno cancelado
                    setHorarios((prevHorarios) => prevHorarios.filter((reserva) => reserva.id !== id));
                    // Mostrar mensaje de éxito
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
        });
    };

    return (
        <div className="bg-gray-900 rounded-xl p-5 flex flex-col w-full xl:w-[calc(50%-10px)]">
            <div className='flex justify-between'>
                <div>
                    <h2 className="text-2xl font-bold">📅 Mis Turnos</h2>
                    <p className="text-gray-400">Administra tus turnos aquí</p>
                </div>
                <Link to="/turnos">
                    <div className='bg-green-500 hover:bg-green-700 h-10 w-10 flex text-white justify-center items-center rounded-full hover:cursor-pointer transition-all'>
                        <FaPlus />
                    </div>
                </Link>
            </div>
            {
                horarios.length === 0 && !loading && (
                    <div className="mt-5 w-full text-center flex items-center justify-center">
                        <p className="text-gray-400">No tienes turnos reservados</p>
                    </div>
                )
            }
            {/* Muestra el Skeleton mientras carga */}
            {loading ? (
                <div className="space-y-4 mt-5">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="animate-pulse bg-gray-800 rounded-xl p-5 flex justify-between">
                            <div className="h-6 bg-gray-700 rounded w-3/4"></div>
                            <div className="h-6 w-6 bg-gray-700 rounded-full"></div>
                        </div>
                    ))}
                </div>
            ) : (
                // Muestra los turnos una vez que cargan los datos
                horarios.map((item) => {
                    const date = new Date(item.fecha);
                    date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); // Ajuste de zona horaria
                    const dayName = capitalizeFirstLetter(date.toLocaleDateString('es-ES', { weekday: 'long' }));
                    const dayMonth = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
                    const isToday = new Date().toLocaleDateString() === date.toLocaleDateString();

                    return (
                        <div key={item.id} className="bg-gray-800 rounded-xl p-5 mt-5 flex justify-between">
                            <h3 className="text-xl font-bold">{isToday ? "Hoy" : dayName + " " + dayMonth} - {item.hora}</h3>
                            <div>
                                <div className="bg-red-700 hover:bg-red-600 hover:cursor-pointer rounded-full p-2 transition-all" onClick={() => {
                                    handleDelete(item.id);
                                }}>
                                    <FaRegTrashAlt />
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}

// Funciones para obtener turnos y datos adicionales
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

async function getHoraDisciplinaById(id: number): Promise<HoraDisciplina> {
    const response = await fetch(`${API_URL}/api/horarios/getHoraDisciplinaById`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
    });

    if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
    }

    return await response.json();
}

// Función para eliminar la reserva en el servidor
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
