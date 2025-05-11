// lib/events.ts
interface ImageProcessedEventDetail {
  originalUrl: string;
  processedUrl: string;
}

declare global {
  interface WindowEventMap {
    imageProcessed: CustomEvent<ImageProcessedEventDetail>;
  }
}

export {};
