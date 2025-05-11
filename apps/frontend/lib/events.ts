// lib/events.ts
interface ImageProcessedEventDetail {
  originalUrl: string;
  processedUrl: string;
  hasError?: boolean;
}

declare global {
  interface WindowEventMap {
    imageProcessed: CustomEvent<ImageProcessedEventDetail>;
  }
}

export {};
