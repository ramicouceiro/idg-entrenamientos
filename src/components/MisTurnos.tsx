import { FaPlus, FaRegTrashAlt } from 'react-icons/fa';
import data from '../lib/mock.json'

export default function MisTurnos() {
    const capitalizeFirstLetter = (string:string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    console.log("misturnos")

    return (
        <div className="bg-gray-900 rounded-xl p-5 flex flex-col">
            <div className='flex justify-between'>
                <div>
                    <h2 className="text-2xl font-bold">🏋️‍♂️ Mis Turnos</h2>
                    <p className="text-gray-400">Administra tus turnos aquí</p>
                </div>
                <div>
                    <div className='bg-green-500 hover:bg-green-700 h-10 w-10 flex justify-center items-center rounded-full hover:cursor-pointer transition-all' onClick={() => console.log('Agregar turno')}>
                        <FaPlus />
                    </div>
                </div>
            </div>
            {data.map((item) => {
                const date = new Date(item.fecha);
                date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); // Ajuste de zona horaria
                const dayName       = capitalizeFirstLetter(date.toLocaleDateString('es-ES', { weekday: 'long' }));
                const dayMonth      = date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
                const isToday       = new Date().toLocaleDateString() === date.toLocaleDateString();
                return (
                    <div key={item.id} className="bg-gray-800 rounded-xl p-5 mt-5 flex justify-between">
                        <h3 className="text-xl font-bold">{isToday ? "Hoy" : dayName + " " + dayMonth} - {item.hora}</h3>
                        <div>
                            <div className="bg-red-700 hover:bg-red-600 hover:cursor-pointer rounded-full p-2 transition-all" onClick={() => console.log('Cancelar turno', item.id)}>
                                <FaRegTrashAlt />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}