import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
const API_URL = import.meta.env.VITE_API_URL;

interface Horario {
    id: number;
    dia_semana: string;
    hora: string;
    disciplina_id: number;
    cupo_maximo: number;
}

interface Disciplina {
    id: number;
    nombre: string;
}

const CrearHorariosPage: React.FC = () => {
    const [horarios, setHorarios] = useState<Horario[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [newHorario, setNewHorario] = useState<Horario>({
        id: 0,
        dia_semana: "",
        hora: "",
        disciplina_id: 0,
        cupo_maximo: 0,
    });

    useEffect(() => {
        getHorarios().then((data: Horario[]) => {
            setHorarios(data);
        });
        getDisciplinas().then((data :Disciplina[]) => {
            setDisciplinas(data);
        });
    }, []);

    const getNombreDisciplina = (disciplina_id: number) => {
        const disciplina = disciplinas.find(d => d.id === disciplina_id);
        return disciplina ? disciplina.nombre : "Desconocida";
    };

    const groupHorariosByDay = (horarios: Horario[]) => {
        return horarios.reduce((acc: Record<string, Horario[]>, horario) => {
            if (!acc[horario.dia_semana]) {
                acc[horario.dia_semana] = [];
            }
            acc[horario.dia_semana].push(horario);
            return acc;
        }, {});
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setNewHorario({ id: 0, dia_semana: "", hora: "", disciplina_id: 0, cupo_maximo: 0 });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewHorario((prev) => ({
            ...prev,
            [name]: name === "disciplina_id" || name === "cupo_maximo" ? Number(value) : value, 
        }));
    };

    const handleAddHorario = async () => {
        if (!newHorario.dia_semana || !newHorario.hora || !newHorario.disciplina_id || !newHorario.cupo_maximo) {
            alert("Todos los campos son obligatorios");
            return;
        }

        const response = await addHorario(newHorario);

        if (response) {
            setHorarios([...horarios, { ...newHorario, id: response.id }]);
            handleCloseModal();
        }
    };

    const groupedHorarios = groupHorariosByDay(horarios);

    return (
        <div className="w-full p-6 bg-gray-900 text-white mt-5 rounded-xl mb-28">
            <div className="flex justify-between">
                <h2 className="text-2xl font-bold">📅 Crear Horarios</h2>
                <div onClick={handleOpenModal}>
                    <div className='bg-green-500 hover:bg-green-700 h-10 w-10 flex justify-center items-center rounded-full hover:cursor-pointer transition-all'>
                        <FaPlus />
                    </div>
                </div>
            </div>
            <p className="text-gray-400">Crea tus horarios aquí</p>
            <div className="relative overflow-x-hidden">
                <div className="flex overflow-x-auto space-x-4 p-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 w-full max-w-full no-scrollbar snap-x snap-mandatory">
                    {Object.entries(groupedHorarios).map(([day, horarios]) => (
                        <div key={day} className="bg-gray-800 shadow-md rounded-lg p-4 min-w-[250px] flex-shrink-0 snap-start">
                            <h3 className="text-lg font-semibold text-white mb-3">{day}</h3>
                            <div className="flex flex-col gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 h-auto">
                                {horarios.map((horario, index) => (
                                    <div key={index} className="p-2 xl:p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-700">
                                        <p className="text-lg font-semibold text-green-400">{horario.hora}</p>
                                        <p className="text-md text-white">{getNombreDisciplina(horario.disciplina_id)}</p>
                                        <p className="text-md text-white">Cupo Máximo: {horario.cupo_maximo}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 🔥 MODAL PARA INGRESAR DATOS */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-800 p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold text-white mb-4">Agregar Horario</h2>

                        <label className="block text-white">Día de la Semana:</label>
                        <select name="dia_semana" value={newHorario.dia_semana} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white">
                            <option value="">Seleccionar día</option>
                            <option value="Lunes">Lunes</option>
                            <option value="Martes">Martes</option>
                            <option value="Miércoles">Miércoles</option>
                            <option value="Jueves">Jueves</option>
                            <option value="Viernes">Viernes</option>
                            <option value="Sábado">Sábado</option>
                        </select>

                        <label className="block text-white mt-2">Hora:</label>
                        <input type="time" name="hora" value={newHorario.hora} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" />

                        <label className="block text-white mt-2">Disciplina:</label>
                        <select name="disciplina_id" value={newHorario.disciplina_id} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white">
                            <option value="">Seleccionar disciplina</option>
                            {disciplinas.map((disciplina) => (
                                <option key={disciplina.id} value={disciplina.id}>{disciplina.nombre}</option>
                            ))}
                        </select>

                        <label className="block text-white mt-2">Cupo Máximo:</label>
                        <input type="number" name="cupo_maximo" value={newHorario.cupo_maximo} onChange={handleChange} className="w-full p-2 rounded bg-gray-700 text-white" />

                        <div className="flex justify-between mt-4">
                            <button onClick={handleCloseModal} className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded">Cancelar</button>
                            <button onClick={handleAddHorario} className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded">Agregar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

async function getHorarios() {
    try {
        const response = await fetch(API_URL + "/api/horarios/getHorarios");
        if (!response.ok) throw new Error("Error obteniendo horarios");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function addHorario(horario: Horario) {
    try {
        const response = await fetch(API_URL + "/api/horarios/addHorario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(horario),
        });
        if (!response.ok) throw new Error("Error agregando horario");
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getDisciplinas() {
    try {
        const response = await fetch(API_URL+ "/api/disciplinas/getDisciplinas");
        if (!response.ok) throw new Error("Error obteniendo disciplinas");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

export default CrearHorariosPage;
