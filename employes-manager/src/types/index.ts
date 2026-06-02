export interface Departamento {
  id: string
  nombre: string
  ubicacion?: string
}

export interface Empleado {
  id: string
  nombre: string
  puesto: string
  salario: number
  departamento_id: string | null
}