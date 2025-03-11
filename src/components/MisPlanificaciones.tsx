import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Planificacion } from "../lib/mockPlanificaciones";
import { Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

export default function MisPlanificaciones(){
    const [planificaciones, setPlanificaciones] = useState<Planificacion[]>([]);
    const { user } = useUser();
    const clerkUserId = user?.id;
    useEffect (() => {
        const fetchPlanificaciones = async () => {
            if (!clerkUserId) return;
            try {
                const planificaciones = await getPlanificacionesByIdUsr(clerkUserId);
                setPlanificaciones(planificaciones);
            } catch (err) {
                console.log(err);
            }
        };
        fetchPlanificaciones();
    }, [clerkUserId]);
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

const getPlanificacionesByIdUsr = async (clerkUserId : string) =>{
    try {
      const response = await fetch(`${API_URL}/api/planificaciones/getPlanificaciones`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({clerkUserId}),
      });
      if (!response.ok) {
        throw new Error(`Error al obtener planificaciones: ${response.status} ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching planificaciones:", error);
      return [];
    }
  }