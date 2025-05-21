// lib/events.ts
interface ImageProcessedEventDetail {
  originalUrl: string;
  processedUrl: string;
  hasError?: boolean;
}

interface UserChangedEventDetail {
  previousUserId?: string;
  currentUserId?: string;
}

declare global {
  interface WindowEventMap {
    imageProcessed: CustomEvent<ImageProcessedEventDetail>;
    userChanged: CustomEvent<UserChangedEventDetail>;
  }
}

// Función para disparar el evento de cambio de usuario
export function triggerUserChangedEvent(
  previousUserId?: string,
  currentUserId?: string
) {
  const userChangedEvent = new CustomEvent<UserChangedEventDetail>(
    "userChanged",
    {
      detail: {
        previousUserId,
        currentUserId,
      },
      bubbles: true,
      cancelable: true,
    }
  );

  window.dispatchEvent(userChangedEvent);
}

export {};
