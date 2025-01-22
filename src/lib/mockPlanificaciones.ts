export interface Serie {
    numero: number;
    repeticiones: string;
    peso: number;
  }
  
  export interface Ejercicio {
    id: number;
    nombre: string;
    series: Serie[];
    descanso: number;
    planificacion_id: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface Bloque {
    id: number;
    nombre: string;
    ejercicios: Ejercicio[];
    planificacion_id: number;
    created_at: string;
    updated_at: string;
  }
  
  export interface Planificacion {
    id: number;
    nombre: string;
    bloques: Bloque[];
  }
  
  export const mockPlanificaciones: Planificacion[] = [
    {
      id: 1,
      nombre: "Día 1",
      bloques: [
        {
          id: 1,
          nombre: "PREPARATORIO",
          ejercicios: [
            {
              id: 1,
              nombre: "Rotaciones de tronco en 3 apoyos",
              series: [
                { numero: 1, repeticiones: "10", peso: 0 }
              ],
              descanso: 30,
              planificacion_id: 1,
              created_at: "",
              updated_at: ""
            },
            {
              id: 2,
              nombre: "Plancha copenhague + arranques",
              series: [
                { numero: 1, repeticiones: "10", peso: 0 },
                { numero: 2, repeticiones: "10", peso: 0 }
              ],
              descanso: 40,
              planificacion_id: 1,
              created_at: "",
              updated_at: ""
            }
          ],
          planificacion_id: 1,
          created_at: "",
          updated_at: ""
        },
        {
          id: 2,
          nombre: "BLOQUE 1",
          ejercicios: [
            {
              id: 1,
              nombre: "Shuffle continuo resistido",
              series: [
                { numero: 1, repeticiones: "4+4", peso: 0 }
              ],
              descanso: 30,
              planificacion_id: 1,
              created_at: "",
              updated_at: ""
            },
          ],
          planificacion_id: 1,
          created_at: "",
          updated_at: ""
        },
        {
          id: 3,
          nombre: "BLOQUE 2",
          ejercicios: [
            {
              id: 1,
              nombre: "Drop jump + shuffle",
              series: [
                { numero: 1, repeticiones: "4+4", peso: 0 },
                { numero: 2, repeticiones: "4+4", peso: 0 }
              ],
              descanso: 30,
              planificacion_id: 1,
              created_at: "",
              updated_at: ""
            }
          ],
          planificacion_id: 1,
          created_at: "",
          updated_at: ""
        }
      ]
    },
    {
      id: 2,
      nombre: "Día 2",
      bloques: [
        {
          id: 1,
          nombre: "PREPARATORIO",
          ejercicios: [
            {
              id: 1,
              nombre: "Bisagra de cadera arrodillado",
              series: [
                { numero: 1, repeticiones: "10", peso: 0 }
              ],
              descanso: 30,
              planificacion_id: 2,
              created_at: "",
              updated_at: ""
            }
          ],
          planificacion_id: 2,
          created_at: "",
          updated_at: ""
        }
      ]
    }
  ];
  