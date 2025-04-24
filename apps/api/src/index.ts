import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const port = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Servidor backend ejecutándose en http://localhost:${port}`);
});