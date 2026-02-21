import { EventEmitter } from "events";

/**
 * Bus de eventos centralizado para desacoplar módulos y manejar logs de auditoría.
 */
class EventBus extends EventEmitter {
  private static instance: EventBus;

  private constructor() {
    super();
    // Aumentar el límite de oyentes si es necesario
    this.setMaxListeners(50);
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Publica un evento de dominio.
   */
  public publish<T = unknown>(event: string, payload: T): void {
    console.log(`[EventBus] Publishing event: ${event}`, payload);
    this.emit(event, payload);

    // Todos los eventos son capturados por el sistema de auditoría por defecto
    if (event !== 'audit:log') {
      this.emit('audit:log', {
        event,
        payload,
        timestamp: new Date(),
      });
    }
  }

  /**
   * Se suscribe a un evento de dominio.
   */
  public subscribe<T = unknown>(event: string, handler: (payload: T) => void): void {
    this.on(event, handler as (payload: unknown) => void);
  }
}

export const eventBus = EventBus.getInstance();
