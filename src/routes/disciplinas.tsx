import { useEffect, useState } from "react";
import { FaPencilAlt, FaPlus, FaRegTrashAlt } from "react-icons/fa";
const API_URL = import.meta.env.VITE_API_URL;

interface Disciplina {
    id: number;
    nombre: string;
}

export default function DisciplinasPage() {
    const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [newDisciplina, setNewDisciplina] = useState("");
    const [modalType, setModalType] = useState<"add" | "edit" | "delete">("add");
    const [selectedDisciplina, setSelectedDisciplina] = useState<Disciplina | null>(null);

    useEffect(() => {
        getDisciplinas().then((data: Disciplina[]) => {
            setDisciplinas(data);
        });
    }, []);

    const handleEditDisciplina = async () => {
        if (!selectedDisciplina || !newDisciplina.trim()) return;
    
        const editedDisciplina = await editDisciplina({ 
            id: selectedDisciplina.id, 
            nombre: newDisciplina // Usamos el nuevo valor del input
        });
    
        if (editedDisciplina) {
            setDisciplinas((prev) => prev.map((d) => (d.id === selectedDisciplina.id ? editedDisciplina : d)));
            setModalOpen(false);
            setSelectedDisciplina(null);
            setNewDisciplina(""); // Resetear el input
        }
    };

    const handleDeleteDisciplina = async (id: number) => {
        await deleteDisciplina(id);
        setDisciplinas((prev) => prev.filter((disciplina) => disciplina.id !== id));
    };

    const handleOpenModal = (modalType: "add" | "edit" | "delete", disciplina?: Disciplina) => {
        setModalType(modalType);
        setModalOpen(true);
    
        if (modalType === "edit" && disciplina) {
            setSelectedDisciplina(disciplina); // Guardamos el ID para la edición
            setNewDisciplina(disciplina.nombre); // Cargamos el nombre actual en el input
        } else if (modalType === "add") {
            setNewDisciplina("");
        }
    };

    const handleCloseModal = () => {
        setNewDisciplina("");
        setModalOpen(false);
        setSelectedDisciplina(null);
    };

    const handleAddDisciplina = async () => {
        if (!newDisciplina.trim()) return;
        const addedDisciplina = await addDisciplina({ id: 0, nombre: newDisciplina });
        if (addedDisciplina) {
            setDisciplinas((prev) => [...prev, addedDisciplina]);
            setNewDisciplina("");
            setModalOpen(false);
        }
    };

    return (
        <div className="mt-5 bg-gray-900 rounded-xl p-5 w-full">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">🏋️‍♂️ Disciplinas</h1>
                <div 
                    className='bg-green-500 hover:bg-green-700 h-10 w-10 flex text-white justify-center items-center rounded-full hover:cursor-pointer transition-all'
                    onClick={() => handleOpenModal("add")}
                >
                    <FaPlus />
                </div>
            </div>
            <div className="mt-5">
                {disciplinas.map((disciplina) => (
                    <div key={disciplina.id} className="bg-gray-800 rounded-xl p-5 mt-5 flex text-white justify-between items-center">
                        <h2 className="font-semibold text-lg">{disciplina.nombre}</h2>
                        <div className="flex gap-2">
                            <div className="bg-blue-500 text-white p-2 rounded-full cursor-pointer transition-all hover:bg-blue-600"
                                 onClick={() => handleOpenModal("edit", disciplina)}>
                                <FaPencilAlt />
                            </div>
                            <div className="bg-red-500 text-white p-2 rounded-full cursor-pointer transition-all hover:bg-red-600"
                                 onClick={() => handleDeleteDisciplina(disciplina.id)}>
                                <FaRegTrashAlt />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-800 p-6 rounded-lg w-96">
                        <h2 className="text-xl font-bold text-white mb-4">{modalType === "add" ? "Agregar" : modalType === "delete" ? "Eliminar" : "Editar"} Disciplina</h2>
                        {modalType !== "delete" && (
                            <>
                                <label className="block text-white mb-1">Nombre:</label>
                                <input 
                                    type="text" 
                                    value={newDisciplina} 
                                    onChange={(e) => setNewDisciplina(e.target.value)} 
                                    className="w-full p-2 rounded bg-gray-700 text-white"
                                />
                            </>
                        )}
                        <div className="flex justify-between mt-4">
                            <button 
                                onClick={() => {
                                    if (modalType === "add") handleAddDisciplina();
                                    else if (modalType === "edit") handleEditDisciplina();
                                    else if (selectedDisciplina) handleDeleteDisciplina(selectedDisciplina.id);
                                }} 
                                className={`${modalType === "delete" ? "bg-red-500 hover:bg-red-700" : "bg-green-500 hover:bg-green-700"} text-white px-4 py-2 rounded`}
                            >
                                {modalType === "add" ? "Agregar" : modalType === "delete" ? "Eliminar" : "Editar"}
                            </button>
                            <button onClick={handleCloseModal} className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* Funciones API */
async function getDisciplinas() {
    try {
        const response = await fetch(API_URL + "/api/disciplinas/getDisciplinas");
        if (!response.ok) throw new Error("Error obteniendo disciplinas");
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function addDisciplina(disciplina: { id: number; nombre: string }) {
    try {
        const response = await fetch(API_URL + "/api/disciplinas/addDisciplina", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(disciplina),
        });
        if (!response.ok) throw new Error("Error agregando disciplina");
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function deleteDisciplina(id: number) {
    try {
        await fetch(API_URL + "/api/disciplinas/deleteDisciplina", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
        });
    } catch (error) {
        console.error(error);
    }
}

async function editDisciplina(disciplina: Disciplina) {
    try {
        const response = await fetch(API_URL + "/api/disciplinas/editDisciplina", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(disciplina),
        });
        if (!response.ok) throw new Error("Error editando disciplina");
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}
