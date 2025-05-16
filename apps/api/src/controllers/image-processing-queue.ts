// Cola simple en memoria para procesamiento secuencial de imágenes
// Si hay una tarea en curso, las nuevas peticiones se encolan y reciben un mensaje de espera
// Cuando termina una tarea, se procesa la siguiente y se notifica el tiempo de la anterior

interface QueueItem {
  req: import("express").Request;
  res: import("express").Response;
  enqueueTime: number;
}

class ProcessingQueue {
  private queue: QueueItem[] = [];
  private processing = false;
  private lastProcessingTime: number | null = null;

  enqueue(req: import("express").Request, res: import("express").Response) {
    if (this.processing) {
      // Servicio ocupado: responder inmediatamente
      res.status(429).json({
        status: 429,
        message:
          "El servicio está ocupado. Por favor, espere a que termine el procesamiento actual.",
        lastProcessingTime: this.lastProcessingTime,
      });
      return;
    }
    this.queue.push({ req, res, enqueueTime: Date.now() });
    this.processNext();
  }

  private async processNext() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;
    const { req, res, enqueueTime } = this.queue.shift()!;
    const start = Date.now();
    try {
      // Lógica de procesamiento real se inyecta desde el controlador
      await (req as any)._processImage(res, (processingTime: number) => {
        this.lastProcessingTime = processingTime;
        this.processing = false;
        this.processNext();
      });
    } catch (err) {
      this.processing = false;
      this.processNext();
    }
  }
}

export const imageProcessingQueue = new ProcessingQueue();
