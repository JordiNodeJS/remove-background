// Cola simple en memoria para procesamiento secuencial de imágenes
// Si hay una tarea en curso, las nuevas peticiones se encolan y reciben un mensaje de espera
// Cuando termina una tarea, se procesa la siguiente y se notifica el tiempo de la anterior

class ProcessingQueue {
  private processing = false;
  private lastProcessingTime: number | null = null;

  enqueue(req: import("express").Request, res: import("express").Response) {
    if (this.processing) {
      res.status(429).json({
        status: 429,
        message:
          "El servicio está ocupado. Por favor, espere a que termine el procesamiento actual.",
        lastProcessingTime: this.lastProcessingTime,
      });
      return;
    }
    this.processing = true;
    const start = Date.now();
    (req as any)._processImage(res, (processingTime: number) => {
      this.lastProcessingTime = Date.now() - start;
      this.processing = false;
    });
  }
}

export const imageProcessingQueue = new ProcessingQueue();
