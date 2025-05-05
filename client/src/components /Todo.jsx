import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddTodo from './AddTodo';
import TodoList from './TodoList';
import Nav from './Nav';

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);

    if (!token) {
      navigate('/');
      return;
    }

    fetch('http://localhost:8000/user/dashboard', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Token invalide');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Dashboard data:', data);
      })
      .catch((err) => {
        console.error(err);
        navigate('/');
      });
    fetchTodos();
  }, [navigate]);

  const fetchTodos = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:8000/user/todos', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('todos:', data);
      setTodos(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des todos :', error);
    }
  };

  // const handleAdd = (todo) => setTodos([...todos, todo]);
  const handleAdd = async (todo) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8000/user/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(todo),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newTodo = await response.json();
      setTodos((prevTodos) => [...prevTodos, newTodo.todo]);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche:", error);
    }
  };

  // const handleToggle = (index) => {
  //   const updated = [...todos];
  //   updated[index].isCompleted = !updated[index].isCompleted;
  //   setTodos(updated);
  // };
  const handleToggle = async (todo) => {
    const token = localStorage.getItem('token');

    const response = await fetch(
      `http://localhost:8000/user/todos/${todo.id}/toggle`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const updatedTodos = todos.map((t) =>
        t.id === todo.id ? { ...t, isDone: !t.isDone } : t
      );
      setTodos(updatedTodos);
    }
  };

  const handleUpdate = async (todo, updatedTodo) => {
    const token = localStorage.getItem('token');

    console.log(' Mise à jour du todo :', todo);
    console.log(' Données envoyées :', updatedTodo);

    try {
      const response = await fetch(
        `http://localhost:8000/user/todos/${todo.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedTodo),
        }
      );

      console.log(' Statut de la réponse:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedTask = await response.json();
      console.log(' Réponse JSON:', updatedTask);

      const updatedTodos = todos.map((t) =>
        t.id === todo.id ? updatedTask.todo : t
      );

      console.log('Nouvelle liste de todos :', updatedTodos);

      setTodos(updatedTodos);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
    }
  };

  // const handleDelete = (index) => {
  //   setTodos(todos.filter((_, i) => i !== index));
  // };
  const handleDelete = async (todo) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(
        `http://localhost:8000/user/todos/${todo.id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedTodos = todos.filter((t) => t.id !== todo.id);
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Erreur lors de la suppression de la tâche:', error);
    }
  };

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-blue-50 p-10">
        <div className="grid md:grid-cols-2 gap-8">
          <AddTodo onAdd={handleAdd} />
          <TodoList
            todos={todos}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        </div>
      </div>
    </>
  );
}
