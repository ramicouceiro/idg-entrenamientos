import { useUser } from "@clerk/clerk-react";

export default function MisPlanificaciones(){
    const { user } = useUser();
    return(
        <div className="bg-gray-900 rounded-xl p-5 w-full xl:w-[calc(50%-10px)]">
            <h2 className="text-2xl font-bold">🏋️‍♂️ Planificaciones</h2>
            <p className="text-gray-400">Administra tus planificaciones aquí</p>
             <div className="bg-gray-800 rounded-xl p-5 mt-5 flex justify-between cursor-pointer">
                <h3 className="text-xl font-bold">Deportistas Rugby</h3>
            </div>
             <div className="bg-gray-800 rounded-xl p-5 mt-5 flex justify-between cursor-pointer">
                <h3 className="text-xl font-bold">{user?.fullName}</h3>
            </div>
        </div>
        
    )
}