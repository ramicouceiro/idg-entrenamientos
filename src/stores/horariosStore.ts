import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Horario } from '../types/horariosTypes'

interface HorariosState {
  horarios: Horario[]
  setHorarios: (horarios: Horario[] | ((prev: Horario[]) => Horario[])) => void
  addHorario: (horario: Horario) => void
  removeHorario: (id: number) => void
}

export const useHorariosStore = create<HorariosState>()(
  persist(
    (set) => ({
      horarios: [],
      setHorarios: (horarios) =>
        set((state) => ({
          horarios: typeof horarios === 'function' ? horarios(state.horarios) : horarios,
        })),
      addHorario: (horario) =>
        set((state) => ({
          horarios: [...state.horarios, horario],
        })),
      removeHorario: (id) =>
        set((state) => ({
          horarios: state.horarios.filter((h) => h.id !== id),
        })),
    }),
    {
      name: 'horarios-storage',
      onRehydrateStorage: () => () => {
        // Detectar si no es la primera carga
        if (sessionStorage.getItem('firstLoad')) {
          localStorage.removeItem('horarios-storage') // Borrar datos
        } else {
          sessionStorage.setItem('firstLoad', 'true') // Marcar primera carga
        }
      },
    }
  )
)
