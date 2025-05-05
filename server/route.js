import express from 'express';
import {
  userLogin,
  userSignup,
  dashboard,
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  toggleTodoDone,
  reorderTodos,
} from './controller.js';
import { verifyToken } from './middleware.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('user routes');
});
router.post('/login', userLogin);
router.post('/signup', userSignup);
router.get('/dashboard', verifyToken, dashboard);
router.put('/todos/reorder', verifyToken, reorderTodos);
router.post('/todos', verifyToken, createTodo);
router.get('/todos', verifyToken, getTodos);
router.put('/todos/:id', verifyToken, updateTodo);
router.patch('/todos/:id/toggle', verifyToken, toggleTodoDone);
router.delete('/todos/:id', verifyToken, deleteTodo);

export default router;
