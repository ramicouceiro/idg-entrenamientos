import { HoraDisciplina } from "./mockTurnos";

const API_URL = import.meta.env.VITE_API_URL;

export const getPlanificacionesByIdUsr = async (clerkUserId: string) => {
  try {
    const response = await fetch(`${API_URL}/api/planificaciones/getPlanificaciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clerkUserId }),
    });
    if (!response.ok) {
      throw new Error(`Error al obtener planificaciones: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching planificaciones:", error);
    return [];
  }
};

export const getTurnosByUser = async (clerkUserId: string) => {
  try {
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
  } catch (error) {
    console.error("Error obteniendo turnos:", error);
    return [];
  }
};

export const getHoraDisciplinaById = async (id: number): Promise<HoraDisciplina> => {
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
