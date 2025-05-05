import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from './config/db.js';

//Login
export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Non autorisé' });
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: '1d',
    }
  );

  res.json({ message: 'Connexion réussie', token });
};

//Signup
export const userSignup = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: 'Email déjà utilisé' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: 'Utilisateur enregistré', user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Erreur d'enregistrement", error });
  }
};

//Dashboard
export const dashboard = (req, res) => {
  res.json({ message: 'Bienvenue dans le dashboard', user: req.user });
};

// Créer une tâche
export const createTodo = async (req, res) => {
  const { title, description } = req.body;
  const userId = req.user.userId;

  try {
    const todoCount = await prisma.todo.count({
      where: { userId },
    });

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        isDone: false,
        position: todoCount,
        userId,
      },
    });

    res.status(201).json({ message: 'Tâche créée', todo });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création', error });
  }
};

export const getTodos = async (req, res) => {
  const userId = Number(req.user.userId);

  try {
    const todos = await prisma.todo.findMany({
      where: { userId },
      orderBy: { position: 'asc' }, // Ajout du tri par position
    });

    res.json(todos);
  } catch (error) {
    console.error('Erreur Prisma :', error);
    res.status(500).json({
      message: 'Erreur lors de la récupération',
      error: error.message || error,
    });
  }
};

// Modifier une tâche
export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  const userId = req.user.userId;

  try {
    const result = await prisma.todo.updateMany({
      where: { id: Number(id), userId },
      data: { title, description },
    });

    // Si aucune tâche mise à jour, on renvoie une erreur 404
    if (result.count === 0) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    const updatedTodo = await prisma.todo.findFirst({
      where: { id: Number(id), userId },
    });
    return res.json({ todo: updatedTodo });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: 'Erreur lors de la mise à jour', error });
  }
};

// Marquer une tâche comme faite / non faite
export const toggleTodoDone = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const todo = await prisma.todo.findUnique({
      where: { id: Number(id) },
    });

    if (!todo || todo.userId !== userId) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    const updated = await prisma.todo.update({
      where: { id: Number(id) },
      data: { isDone: !todo.isDone },
    });

    res.json({ message: 'État mis à jour', todo: updated });
  } catch (error) {
    res.status(500).json({ message: 'Erreur de mise à jour', error });
  }
};

// Supprimer une tâche
export const deleteTodo = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const deleted = await prisma.todo.deleteMany({
      where: { id: Number(id), userId },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    res.json({ message: 'Tâche supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur de suppression', error });
  }
};
//reorganiser
export const reorderTodos = async (req, res) => {
  const { orderedIds } = req.body;
  const userId = req.user.userId;

  if (!Array.isArray(orderedIds)) {
    return res
      .status(400)
      .json({ message: 'Les IDs doivent être un tableau.' });
  }

  try {
    for (const id of orderedIds) {
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ message: `L'ID ${id} n'est pas valide.` });
      }
    }

    const updates = orderedIds.map(async (id, index) => {
      const todo = await prisma.todo.findFirst({
        where: { id: Number(id), userId: userId },
      });

      if (!todo) {
        throw new Error(`La tâche avec l'ID ${id} n'existe pas.`);
      }

      return prisma.todo.update({
        where: { id: Number(id) },
        data: { position: index },
      });
    });

    await Promise.all(updates);

    res.json({ message: 'Ordre des tâches mis à jour' });
  } catch (error) {
    console.error('Erreur Prisma:', error);
    res
      .status(500)
      .json({ message: 'Erreur de réorganisation', error: error.message });
  }
};
