import { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function TodoList({ todos, onToggle, onDelete, onUpdate }) {
  const [draggedTodoId, setDraggedTodoId] = useState(null);
  const [orderedTodos, setOrderedTodos] = useState(todos);
  const [showModal, setShowModal] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [selectedTodo, setSelectedTodo] = useState(null);

  const updateOrder = async (newOrder) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:8000/user/todos/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderedIds: newOrder }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur serveur');
      }

      console.log('Ordre mis à jour avec succès:', data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l’ordre:', error.message);
    }
  };

  useEffect(() => {
    setOrderedTodos(todos);
  }, [todos]);

  const openModal = (todo) => {
    setEditTitle(todo.title);
    setEditDescription(todo.description);
    setSelectedTodo(todo);
    setShowModal(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    try {
      if (selectedTodo) {
        onUpdate(selectedTodo, {
          title: editTitle,
          description: editDescription,
        });
      }
      setShowModal(false);
    } catch (error) {
      console.error('Erreur dans handleUpdate:', error);
    }
  };
  const handleDrop = (targetId) => {
    if (draggedTodoId === null || draggedTodoId === targetId) return;

    const draggedIndex = orderedTodos.findIndex((t) => t.id === draggedTodoId);
    const targetIndex = orderedTodos.findIndex((t) => t.id === targetId);

    const newTodos = [...orderedTodos];
    const [draggedTodo] = newTodos.splice(draggedIndex, 1);
    newTodos.splice(targetIndex, 0, draggedTodo);

    setOrderedTodos(newTodos);
    const newOrderIds = newTodos.map((todo) => todo.id);
    updateOrder(newOrderIds);
  };

  console.log(' Composant TodoList rendu');
  console.log(' Todos:', todos);
  console.log(' editTodo:', selectedTodo);

  return (
    <div className="w-full overflow-x-auto">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">
        Todos
      </h2>
      <div className="text-center">
        {todos.length === 0 && 'No Todos to display'}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left px-4 py-2">Title</th>
              <th className="text-left px-4 py-2">Task</th>
              <th className="px-4 py-2">IsCompleted</th>
              <th className="px-4 py-2">Update</th>
              <th className="px-4 py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {orderedTodos.map((todo) => (
              <tr
                key={todo.id}
                draggable
                onDragStart={() => setDraggedTodoId(todo.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(todo.id)}
                className="border-b"
              >
                <td className="px-4 py-2">{todo.title}</td>
                <td className="px-4 py-2">{todo.description}</td>
                <td className="text-center px-4 py-2">
                  <input
                    type="checkbox"
                    checked={todo.isDone || false}
                    onChange={() => onToggle(todo)}
                  />
                </td>
                <td className="text-center px-4 py-2">
                  <FaEdit
                    className="text-blue-600 cursor-pointer"
                    onClick={() => openModal(todo)}
                  />
                </td>
                <td className="text-center px-4 py-2">
                  <FaTrash
                    className="text-red-600 cursor-pointer"
                    onClick={() => onDelete(todo)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex justify-center items-center z-50 px-4 sm:px-6">
            <form
              onSubmit={handleUpdate}
              className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md shadow-lg"
            >
              <h3 className="text-lg sm:text-xl font-semibold mb-4">
                Modifier le Todo
              </h3>
              <input
                type="text"
                className="w-full p-2 border mb-3 rounded text-sm sm:text-base"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Titre"
              />
              <textarea
                className="w-full p-2 border mb-3 rounded text-sm sm:text-base"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Tâche"
              ></textarea>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-3 sm:px-4 py-2 bg-gray-400 rounded text-white text-sm sm:text-base"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-2 bg-blue-600 rounded text-white text-sm sm:text-base"
                >
                  Modifier
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
