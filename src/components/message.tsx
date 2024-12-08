import { JSX, useEffect, useRef, useState } from "react";
import messageEventService, { MessageConfig } from "../message.service";


/**
 * Toast para avisos e mensagens popup ao usuário
 * Deve ser renderizada ao menos no componente principal
 * Está subscrita em um MessageService
 * Toda vez que o messageService emite um evento, o toast é exibido na tela
 * @returns 
 */
export default function Message(): JSX.Element {
    
    const toastRef = useRef<HTMLDivElement>(null);

    const [message, setMessage] = useState<MessageConfig>(
        {type : 'success', message: 'Corpo da Mensagem'});
  
    // Faz a subscription no MessageService e define a função de callback
    // Sempre que o MessageService emite um evento, o toast recebe uma mensagem e é exibido
    useEffect(() => {
      const handleShowToast = (event: CustomEvent) => {
        setMessage({type: event.detail.type, message: event.detail.message});
        if (toastRef.current) {
          const toast = new (window as any).bootstrap.Toast(toastRef.current);
          toast.show();
        }
      };
  
      messageEventService.subscribe(handleShowToast);
  
      return () => {
        messageEventService.unsubscribe(handleShowToast);
      };
    }, []);
    
    return (
        <div className={"toast border position-fixed start-50 p-3 me-5" + 
          " bg-white "} role="alert" 
          aria-live="assertive" aria-atomic="true" ref={toastRef}
          style={{ zIndex: 1100 }} >
            <div className={"toast-header bg-white "}>
                <strong className={"ms-auto " + (message.type === 'fail' ? "text-warning " : "text-success ")}>{message.type === 'fail' ? "Falha" : "Sucesso"}</strong>
                <button type="button" className="btn-close " data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div className="toast-body">
                {message.message}
            </div>
        </div>
    );
}  