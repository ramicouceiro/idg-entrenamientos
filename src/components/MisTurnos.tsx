import { FaPlus, FaRegTrashAlt } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { useTurnosStore } from '../stores/turnosStore';
const API_URL = import.meta.env.VITE_API_URL;

export default function MisTurnos() {
    const { turnos, setTurnos } = useTurnosStore();

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
                    await deleteReserva(id);
                    setTurnos((prevTurnos) => prevTurnos.filter((reserva) => reserva.id !== id));
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
                turnos.length === 0 && (
                    <div className="mt-5 w-full text-center flex items-center justify-center">
                        <p className="text-gray-400">No tienes turnos reservados</p>
                    </div>
                )
            }
            {
                turnos.map((item) => {
                    const date = new Date(item.fecha);
                    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
                    const dayName = capitalizeFirstLetter(date.toLocaleDateString('es-ES', { weekday: 'long' }));
                    const dayMonth = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
                    const isToday = new Date().toLocaleDateString() === date.toLocaleDateString();

                    return (
                        <div key={item.id} className="bg-gray-800 rounded-xl p-5 mt-5 flex justify-between">
                            <h3 className="text-xl font-bold">{isToday ? "Hoy" : dayName + " " + dayMonth} - {item.hora} - {item.disciplina}</h3>
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
            }
        </div>
    );
}

// async function getTurnosByUser(clerkUserId: string): Promise<Reserva[]> {
//     const response = await fetch(`${API_URL}/api/reservas/getReservasByIdUsr`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ clerkUserId }),
//     });

//     if (!response.ok) {
//         throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
//     }

//     return await response.json();
// }


async function deleteReserva(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/api/reservas/deleteReserva`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
    });

    if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
    }
}
