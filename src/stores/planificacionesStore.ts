import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Planificacion } from '../lib/mockPlanificaciones'

interface PlanificacionesState {
  planificaciones: Planificacion[]
  setPlanificaciones: (planificaciones: Planificacion[]) => void
  addPlanificacion: (planificacion: Planificacion) => void
  removePlanificacion: (id: number) => void
}

export const usePlanificacionesStore = create<PlanificacionesState>()(
  persist(
    (set) => ({
      planificaciones: [],
      setPlanificaciones: (planificaciones) => set({ planificaciones }),
      addPlanificacion: (planificacion) =>
        set((state) => ({
          planificaciones: [...state.planificaciones, planificacion],
        })),
      removePlanificacion: (id) =>
        set((state) => ({
          planificaciones: state.planificaciones.filter((p) => p.id !== id),
        })),
    }),
    {
      name: 'planificaciones-storage',
      onRehydrateStorage: () => () => {
        // Detectar si no es la primera carga
        if (sessionStorage.getItem('firstLoad')) {
          localStorage.removeItem('planificaciones-storage') // Borrar datos
        } else {
          sessionStorage.setItem('firstLoad', 'true') // Marcar primera carga
        }
      },
    }
  )
)
