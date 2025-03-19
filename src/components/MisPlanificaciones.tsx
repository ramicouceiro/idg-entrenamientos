import { Link } from "react-router-dom";
import { usePlanificacionesStore } from "../stores/planificacionesStore";

export default function MisPlanificaciones(){
    const { planificaciones } = usePlanificacionesStore();
    
    return(
        <Link to="/planificaciones" className="bg-gray-900 rounded-xl text-white hover:text-white p-5 w-full xl:w-[calc(50%-10px)]">
            {/* <div className="bg-gray-900 rounded-xl p-5 w-full xl:w-[calc(50%-10px)]"> */}
                <h2 className="text-2xl font-bold">🏋️‍♂️ Planificaciones</h2>
                <p className="text-gray-400">Administra tus planificaciones aquí</p>
                {planificaciones.map((plan) => {
                    return(
                        <div key={plan.id} className="bg-gray-800 rounded-xl p-5 mt-5 flex justify-between">
                            <h3 className="text-lg font-semibold">{plan.nombre}</h3>
                        </div>
                    )
                })}
            {/* </div> */}
        </Link>
    )
}