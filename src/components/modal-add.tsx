import { JSX, useState } from "react";
import { create } from "../data.service";
import messageEventService from "../message.service";

const blankTarefa : Tarefa = {
    title: "",
    description: "",
    date_start: "",
    date_end: ""
}

/**
 * Modal para formulário para adicionar tarefa
 * Visibilidade é controlada por CSS
 * (refatorar: é possível criar um evento para exibir o modal)
 * @param param0 
 * @returns 
 */
export default function ModalAdd({hidden, setHidden, triggerReload} : 
    {hidden: boolean, setHidden : (arg: boolean) => void, triggerReload: () => void }) : JSX.Element {

    const [tarefa, setTarefa] = useState<Tarefa>(blankTarefa)


    // Ações ao clicar em fechar / cancelar
    const dismiss = () => {
        setTarefa(blankTarefa)
        setHidden(true)
    }

    // Ações ao clicar em SALVAR
    // Tenta criar uma nova tarefa
    // Se não ocorreu erros, fecha e limpa o formulário
    // Trata erros exibindo como mensagem ao usuário
    const accept =  async () => {
        try {
            await create(tarefa)
            triggerReload()
            dismiss()            
        } catch (error) {
            messageEventService.emit({type: 'fail', message: error instanceof Error ? error.message : "Ocorreu um erro desconhecido"})
        }
    }


    // Atualiza o objeto quando o usuário faz mudanças por meio do formulário
    // Atenção: objeto pode estar em estado inválido!
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;      
        setTarefa(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Ícone de cancelar (REFATORAR COMPONENTE REPETIDO)
    const cancelIcon = () => {
        return (
            <div style={{'cursor': 'pointer'}} className="p-1" 
                aria-label="button" title="Cancelar" onClick={dismiss} >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                </svg>
            </div>
        );
    }

    // Ícone de salvar (REFATORAR COMPONENTE REPETIDO)
    const saveIcon = () => {
        return (
            <div style={{'cursor': 'pointer'}} className="p-1" 
                        aria-label="button" title="Salvar" onClick={accept}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-floppy" viewBox="0 0 16 16">
                    <path d="M11 2H9v3h2z"/>
                    <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                </svg>
            </div>

        );
    }


    return (
        <div
            className={`modal fade ${hidden ? "" : "show"} `}
            style={{ display: hidden ? "none" : "block" }}  
            tabIndex={-1} 
            aria-labelledby="modal" 
            aria-hidden={hidden}>
            <div className="modal-dialog p-5 ">
                <div className="modal-content bg-modal">

                    <div className="modal-header border-0">
                        <span className="fs-3 fw-bold">Adicionar Tarefa</span>
                        <button type="button" className="btn-close" 
                            data-bs-dismiss="modal" aria-label="Close"
                            onClick={dismiss}></button>
                    </div>
                    
                    <div className="modal-body d-flex gap-3 flex-row mb-2  ">
                        <form className="d-flex flex-column gap-3 flex-fill" >
                            <input className="m-0 fs-5 fw-bold text-body" placeholder="Título" name="title" value={tarefa.title} onChange={handleChange} />
                            <textarea className="m-0 fs-6 text-body-secondary" placeholder="Descrição" name="description" rows={3} value={tarefa.description} onChange={handleChange}></textarea>
                            <div className="d-flex flex-wrap flex-row flex-fill justify-content-between gap-3 fs-6 text-date">
                                <span>Início: <input type="datetime-local" name="date_start" value={tarefa.date_start} onChange={handleChange} /></span>
                                <span>Prazo: <input type="datetime-local" name="date_end" value={tarefa.date_end} onChange={handleChange} /></span>
                            </div>
                        </form>
                    </div>

                    <div className="modal-footer mb-2 d-flex justify-content-end">
                        {saveIcon()}
                    </div>

                </div>
            </div>
        </div>
    );

}