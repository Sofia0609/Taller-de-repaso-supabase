import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Empleado, Departamento } from '../types/index'
import '../styles/Empleados.css'

export default function Empleados() {
  const [empleados, setEmpleados] = useState<Empleado[]>([])
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [nombre, setNombre] = useState('')
  const [puesto, setPuesto] = useState('')
  const [salario, setSalario] = useState('')
  const [deptoId, setDeptoId] = useState('')
  const [editando, setEditando] = useState<Empleado | null>(null)

  useEffect(() => {
    fetchEmpleados()
    fetchDepartamentos()
  }, [])

  async function fetchEmpleados() {
    const { data } = await supabase.from('empleados').select('*')
    if (data) setEmpleados(data)
  }

  async function fetchDepartamentos() {
    const { data } = await supabase.from('departamentos').select('*')
    if (data) setDepartamentos(data)
  }

  async function agregar() {
    if (!nombre.trim() || !puesto.trim() || !salario) return alert('Nombre, puesto y salario son requeridos')
    await supabase.from('empleados').insert({
      nombre, puesto,
      salario: parseFloat(salario),
      departamento_id: deptoId || null
    })
    setNombre(''); setPuesto(''); setSalario(''); setDeptoId('')
    fetchEmpleados()
  }

  async function guardarEdicion() {
    if (!editando || !editando.nombre.trim()) return alert('Nombre es requerido')
    await supabase.from('empleados').update({
      nombre: editando.nombre,
      puesto: editando.puesto,
      salario: editando.salario,
      departamento_id: editando.departamento_id
    }).eq('id', editando.id)
    setEditando(null)
    fetchEmpleados()
  }

  async function eliminar(id: string) {
    if (!confirm('¿Eliminar este empleado?')) return
    await supabase.from('empleados').delete().eq('id', id)
    fetchEmpleados()
  }

  function getNombreDepto(id: string | null) {
    return departamentos.find(d => d.id === id)?.nombre ?? '—'
  }

  return (
    <div>
      <h2>Gestión de Empleados</h2>

      <div className="form-card">
        <h3>Añadir Nuevo Empleado</h3>
        <div className="form-row">
          <input placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
          <input placeholder="Puesto (Ej: Desarrollador)" value={puesto} onChange={e => setPuesto(e.target.value)} />
          <input placeholder="Salario" type="number" value={salario} onChange={e => setSalario(e.target.value)} />
          <select value={deptoId} onChange={e => setDeptoId(e.target.value)}>
            <option value="">Seleccionar Departamento</option>
            {departamentos.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
          </select>
          <button className="btn-add" onClick={agregar}>Añadir Empleado</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>NOMBRE</th><th>PUESTO</th><th>DEPARTAMENTO</th><th>SALARIO</th><th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map(emp => (
            <tr key={emp.id}>
              <td>
                {editando?.id === emp.id
                  ? <input value={editando.nombre} onChange={e => setEditando({ ...editando, nombre: e.target.value })} />
                  : <strong>{emp.nombre}</strong>}
              </td>
              <td>
                {editando?.id === emp.id
                  ? <input value={editando.puesto} onChange={e => setEditando({ ...editando, puesto: e.target.value })} />
                  : emp.puesto}
              </td>
              <td>
                {editando?.id === emp.id
                  ? <select value={editando.departamento_id ?? ''} onChange={e => setEditando({ ...editando, departamento_id: e.target.value })}>
                      <option value="">Sin departamento</option>
                      {departamentos.map(d => <option key={d.id} value={d.id}>{d.nombre}</option>)}
                    </select>
                  : getNombreDepto(emp.departamento_id)}
              </td>
              <td>
                {editando?.id === emp.id
                  ? <input type="number" value={editando.salario} onChange={e => setEditando({ ...editando, salario: parseFloat(e.target.value) })} />
                  : `$${emp.salario.toLocaleString()}`}
              </td>
              <td>
                {editando?.id === emp.id
                  ? <button className="btn-save" onClick={guardarEdicion}>Guardar</button>
                  : <button className="btn-edit" onClick={() => setEditando(emp)}>Editar</button>}
                <button className="btn-delete" onClick={() => eliminar(emp.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}