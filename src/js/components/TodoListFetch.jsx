import React, { useEffect, useState } from 'react';

export const TodoListFetch = () => {
  const USER = 'Alexarj';
  const BASE_URL = 'https://playground.4geeks.com/todo';
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [error, setError] = useState(null);

  
  const actualizarLista = async () => {
    const res = await fetch(`${BASE_URL}/users/${USER}`);
    if (!res.ok) {
      setError('Error al obtener tareas');
      return;
    }
    const data = await res.json();
    setTareas(data.todos || []);
  };

  
  const agregarTarea = async (e) => {
    e.preventDefault();
    if (nuevaTarea.trim() === '') return;

    const nueva = { label: nuevaTarea, done: false };

    const res = await fetch(`${BASE_URL}/todos/${USER}`, {
      method: 'POST',
      body: JSON.stringify(nueva),
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      setError('Error al agregar tarea');
      return;
    }

    setNuevaTarea('');
    actualizarLista();
  };

  
  const editarTarea = async (id, nuevoNombre, estado) => {
    const res = await fetch(`${BASE_URL}/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        label: nuevoNombre,
        done: estado
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      console.error('Error al editar tarea');
      return;
    }

    actualizarLista();
  };

  
  const eliminarTarea = async (id) => {
    const res = await fetch(`${BASE_URL}/todos/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      console.error('Error al eliminar tarea:', res.status, res.statusText);
      return;
    }

    actualizarLista();
  };

  
  const eliminarTodasLasTareas = async () => {
    for (const tarea of tareas) {
      const res = await fetch(`${BASE_URL}/todos/${tarea.id}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        console.error(`Error al eliminar tarea con id ${tarea.id}`);
      }
    }

    actualizarLista();
  };

  useEffect(() => {
    actualizarLista();
  }, []);

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2> Lista de Tareas</h2>

      {error && <p style={{ color: 'red' }}> {error}</p>}

      <form onSubmit={agregarTarea}>
        <input
          type="text"
          value={nuevaTarea}
          onChange={(e) => setNuevaTarea(e.target.value)}
          placeholder="Nueva tarea"
        />
      </form>

      <button onClick={eliminarTodasLasTareas} disabled={tareas.length === 0}>
        Eliminar todas
      </button>

      <ul>
        {tareas.length === 0 ? (
          <li>No hay tareas, añade una</li>
        ) : (
          tareas.map((tarea) => (
            <li key={tarea.id} className="list-group-item">
              <span>
                {tarea.done ? (
                  <i
                    onClick={() => editarTarea(tarea.id, tarea.label, false)}
                    className="fa-solid fa-check icon"
                  ></i>
                ) : (
                  <i
                    onClick={() => editarTarea(tarea.id, tarea.label, true)}
                    className="fa-solid fa-xmark icon"
                  ></i>
                )}
              </span>
              <span className="liContent">{tarea.label}</span>
              <span className="editButton">
                <i
                  onClick={() =>
                    editarTarea(
                      tarea.id,
                      prompt('Nuevo nombre:', tarea.label),
                      tarea.done
                    )
                  }
                  className="fa-solid fa-pen-to-square icon"
                ></i>
              </span>
              <span className="closeButton icon">
                <i
                  onClick={() => eliminarTarea(tarea.id)}
                  className="fa-solid fa-trash"
                ></i>
              </span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};