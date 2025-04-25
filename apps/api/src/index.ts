import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const port = 3001; // Fuerza puerto 3001
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
  res.send('Servidor backend ejecutándose');
});

const server = app.listen(port, () => {
  console.log(`Servidor backend ejecutándose en http://localhost:${port}`);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Servidor cerrado por interrupción (SIGINT)');
    process.exit(0);
  });
});