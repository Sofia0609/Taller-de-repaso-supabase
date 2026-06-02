import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import type { Departamento } from '../types/index'
import '../styles/Departamentos.css'

export default function Departamentos() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([])
  const [nombre, setNombre] = useState('')
  const [ubicacion, setUbicacion] = useState('')
  const [editando, setEditando] = useState<Departamento | null>(null)

  useEffect(() => { fetchDepartamentos() }, [])

  async function fetchDepartamentos() {
    const { data } = await supabase.from('departamentos').select('*')
    if (data) setDepartamentos(data)
  }

  async function agregar() {
    if (!nombre.trim()) return alert('El nombre es requerido')
    await supabase.from('departamentos').insert({ nombre, ubicacion })
    setNombre(''); setUbicacion('')
    fetchDepartamentos()
  }

  async function guardarEdicion() {
    if (!editando || !editando.nombre.trim()) return alert('El nombre es requerido')
    await supabase.from('departamentos').update({
      nombre: editando.nombre,
      ubicacion: editando.ubicacion
    }).eq('id', editando.id)
    setEditando(null)
    fetchDepartamentos()
  }
_
  async function eliminar(id: string) {
    if (!confirm('¿Eliminar este departamento?')) return
    await supabase.from('departamentos').delete().eq('id', id)
    fetchDepartamentos()
  }

  return (
    <div>
      <h2>Gestión de Departamentos</h2>

      <div className="form-card">
        <h3>Añadir Nuevo Departamento</h3>
        <div className="form-row">
          <input
            placeholder="Nombre del Departamento"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
          <input
            placeholder="Ubicación (Ej: Piso 3)"
            value={ubicacion}
            onChange={e => setUbicacion(e.target.value)}
          />
          <button className="btn-add" onClick={agregar}>
            Añadir Departamento
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>NOMBRE</th>
            <th>UBICACIÓN</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {departamentos.map(dep => (
            <tr key={dep.id}>
              <td>
                {editando?.id === dep.id
                  ? <input value={editando.nombre} onChange={e => setEditando({ ...editando, nombre: e.target.value })} />
                  : <strong>{dep.nombre}</strong>}
              </td>
              <td>
                {editando?.id === dep.id
                  ? <input value={editando.ubicacion ?? ''} onChange={e => setEditando({ ...editando, ubicacion: e.target.value })} />
                  : dep.ubicacion}
              </td>
              <td>
                {editando?.id === dep.id
                  ? <button className="btn-save" onClick={guardarEdicion}>Guardar</button>
                  : <button className="btn-edit" onClick={() => setEditando(dep)}>Editar</button>}
                <button className="btn-delete" onClick={() => eliminar(dep.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}