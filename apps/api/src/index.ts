import { createApp } from "./app";

const app = createApp();
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Servidor Express ejecutándose en el puerto ${port}`);
});
