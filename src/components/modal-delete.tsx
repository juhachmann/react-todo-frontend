import { JSX } from "react";
import { deleteTarefa } from "../data.service";
import messageEventService from "../message.service";


/**
 * Modal para confirmar exclusão de tarefa
 * Visibilidade é controlada por CSS
 * (refatorar: é possível criar um evento para exibir o modal)
 * @param param0 
 * @returns 
 */
export default function ModalDelete({hidden, setHidden, todo, triggerReload} : {
    hidden : boolean, setHidden : (arg : boolean) => void, todo?: Tarefa, triggerReload: () => void
}) : JSX.Element {

    // Ações ao clicar em fechar / cancelar
    const dismiss = () => {
        setHidden(true)
    }

    // Ações ao clicar em EXCLUIR
    const accept =  async () => {
        if(!todo) 
            return
        try {
            await deleteTarefa(todo.id!)
            setHidden(true)
            triggerReload()           
        } catch (error) {
            messageEventService.emit({type: 'fail', message: error instanceof Error ? error.message : "Ocorreu um erro desconhecido"})
        }
    }

    return (
        <div
            className={`modal fade ${hidden ? "" : "show"}`}
            style={{ display: hidden ? "none" : "block" }}  
            tabIndex={-1} 
            aria-labelledby="modal" 
            aria-hidden={hidden}>
            <div className="modal-dialog">

                <div className="modal-content bg-modal">
                    <div className="modal-header border-0 ">
                        <span className="fs-4 fw-bold text-primary">Remover esta tarefa?</span>
                        <button type="button" className="btn-close" 
                            data-bs-dismiss="modal" aria-label="Close"
                            onClick={dismiss}></button>
                    </div>
                    <div className="modal-body border-0 px-5">
                        <p><span className="fw-bold">Título: </span>{todo?.title}</p> 
                    </div>
                    <div className="modal-footer d-flex justify-content-around">
                        <button type="button" className="btn btn-secondary" 
                            data-bs-dismiss="modal" onClick={dismiss}>Cancelar</button>
                        <button type="button" className="btn btn-primary" onClick={accept}>Sim, excluir!</button>
                    </div>
                </div>

            </div>
        </div>
    );


}