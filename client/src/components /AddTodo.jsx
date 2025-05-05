import { useState } from 'react';

export default function AddTodo({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) return;
    onAdd({ title, description, isCompleted: false });
    setTitle('');
    setDescription('');
  };

  return (
    <div className="w-full max-w-md p-4 sm:p-6 mx-auto border shadow-lg rounded-md bg-white">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-600 mb-4">
        Add Todo
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Title"
          className="border p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Task"
          className="border p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded w-full hover:bg-blue-600 transition duration-200"
        >
          Add Note
        </button>
      </form>
    </div>
  );
}
