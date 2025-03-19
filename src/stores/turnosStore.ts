import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Reserva } from '../lib/mockTurnos'

interface TurnosState {
  turnos: Reserva[]
  setTurnos: (turnos: Reserva[] | ((prev: Reserva[]) => Reserva[])) => void
  addTurno: (turno: Reserva) => void
  removeTurno: (id: number) => void
}

export const useTurnosStore = create<TurnosState>()(
  persist(
    (set) => ({
      turnos: [],
      setTurnos: (turnos) =>
        set((state) => ({
          turnos: typeof turnos === 'function' ? turnos(state.turnos) : turnos,
        })),
      addTurno: (turno) =>
        set((state) => ({
          turnos: [...state.turnos, turno],
        })),
      removeTurno: (id) =>
        set((state) => ({
          turnos: state.turnos.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'turnos-storage',
      onRehydrateStorage: () => () => {
        // Detectar si no es la primera carga
        if (sessionStorage.getItem('firstLoad')) {
          localStorage.removeItem('turnos-storage') // Borrar datos
        } else {
          sessionStorage.setItem('firstLoad', 'true') // Marcar primera carga
        }
      },
    }
  )
)
