import { useState } from 'react'
import Empleados from './components/Empleados'
import Departamentos from './components/Departamentos'
import './styles/App.css'

function App() {
  const [vista, setVista] = useState<'empleados' | 'departamentos'>('empleados')

  return (
    <div>
      <nav>
        <h2>Gestión Empresarial</h2>
        <div>
          <button onClick={() => setVista('departamentos')}>Departamentos</button>
          <button onClick={() => setVista('empleados')}>Empleados</button>
        </div>
      </nav>

      <main>
        {vista === 'empleados' ? <Empleados /> : <Departamentos />}
      </main>
    </div>
  )
}

export default App