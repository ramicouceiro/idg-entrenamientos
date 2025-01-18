const horariosDisponibles: Record<string, string[]> = {
  "Lunes": ["08:00", "09:00", "10:00", "17:00", "18:00", "19:00"],
  "Martes": ["08:00", "09:00", "10:00", "17:00", "18:00", "19:00"],
  "Miércoles": ["08:00", "09:00", "10:00", "17:00", "18:00", "19:00"],
  "Jueves": ["08:00", "09:00", "10:00", "17:00", "18:00", "19:00"],
  "Viernes": ["08:00", "09:00", "10:00", "17:00", "18:00", "19:00"],
  "Sábado": ["08:00", "09:00", "10:00"],
};

const generateMonthDays = () => {
    
    const today = new Date().getDate();
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth - today + 1 }, (_, i) => {
        const date = new Date(new Date().getFullYear(), new Date().getMonth(), today + i);
        const dayName = date.toLocaleDateString("es-ES", { weekday: "long" });
        if (dayName.toLowerCase() === "domingo") return null; // Excluir domingos
        return { day: today + i, name: dayName.charAt(0).toUpperCase() + dayName.slice(1) };
    }).filter(Boolean) as { day: number; name: string }[];
};

const getCurrentTime = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
};

const Turnos: React.FC = () => {
    const days = generateMonthDays();
    const currentTime = getCurrentTime();

    return (
        <div className={`p-4 bg-gray-900 mt-0 xl:mt-5 rounded-xl max-h-[650px]`}>
            <h2 className="text-xl font-bold text-white mb-4">Agenda</h2>
            <div className="relative overflow-x-hidden">
                <div className="flex overflow-x-auto space-x-4 p-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 w-full max-w-full no-scrollbar snap-x snap-mandatory">
                    {days.map(({ day, name }) => (
                        <div key={day} className="bg-gray-800 shadow-md rounded-lg p-4 min-w-[250px] flex-shrink-0 snap-start">
                            <h3 className="text-lg font-semibold text-white mb-3">{name} {day}</h3>
                            {/* Contenedor con Scroll Vertical */}
                            <div className="flex flex-col gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 max-h-[500px] xl:max-h-full">
                                {(horariosDisponibles[name] || []).filter(horario => {
                                    const [hour, minute] = horario.split(":").map(Number);
                                    const turnoTime = hour * 60 + minute;
                                    return day !== new Date().getDate() || turnoTime >= currentTime;
                                }).map((horario, index) => (
                                    <div key={index} className="p-2 xl:p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-700">
                                        <p className="text-lg font-semibold text-green-400">{horario}</p>
                                        <p className="text-md text-white">Fuerza y Acondicionamiento</p>
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

export default Turnos;

