import express from 'express';
import { prisma } from './config/db.js';
import userRoute from './route.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
//Database
prisma
  .$connect()
  .then(() => console.log('Connexion réussie à MySQL via Prisma !'))
  .catch((err) => {
    console.error('Échec de la connexion :', err);
    process.exit(1);
  });

app.get('/', (req, res) => {
  res.send('Hello');
});

app.use('/user', userRoute);

// Au signal d’arrêt, on ferme proprement Prisma
process.on('SIGINT', async () => {
  console.log('Fermeture du serveur…');
  await prisma.$disconnect();
  process.exit(0);
});
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`the server is running on http://localhost:${PORT}`);
});
