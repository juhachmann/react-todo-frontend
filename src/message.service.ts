

export interface MessageConfig {
  type?: 'success' | 'fail';
  message?: string;
}


class MessageService {

    private eventTarget: EventTarget;
  
    constructor() {
      this.eventTarget = new EventTarget();
    }
  
    emit(detail: MessageConfig) {
      const event = new CustomEvent('show-toast', { detail });      
      this.eventTarget.dispatchEvent(event);
    }
  
    subscribe(listener: (event: CustomEvent) => void) {
      this.eventTarget.addEventListener('show-toast', listener as EventListener);
    }
  
    unsubscribe(listener: (event: CustomEvent) => void) {
      this.eventTarget.removeEventListener('show-toast', listener as EventListener);
    }
}
  
// Singleton do EventService
const messageEventService = new MessageService();

export default messageEventService;
  