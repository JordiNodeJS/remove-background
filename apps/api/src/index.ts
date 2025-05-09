import { createApp } from "./app";

const app = createApp();
const port = parseInt(process.env.PORT || "3001", 10);

app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor Express ejecutándose en el puerto ${port}`);
});
