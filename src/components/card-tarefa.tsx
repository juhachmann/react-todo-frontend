import { useState } from 'react';
import './card-tarefa.css';
import { update } from '../data.service';
import messageEventService from '../message.service';
 

// Ações e estados que recebe do componente pai: 
export interface CardTarefaProps {
    tarefa: Tarefa,
    deletar: (arg: Tarefa) => void
    triggerReload: () => void
}


export default function CardTarefa ({props} : {props: CardTarefaProps}) {

    const [status, setStatus] = useState<'done'|'ongoing'>(props.tarefa.status!)
    const [edit, setEdit] = useState<boolean>(false)
    const [tarefa, setTarefa] = useState<Tarefa>(props.tarefa)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;      
        setTarefa(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Marcar como concluído
    const toggleConcluido = async () => {
        try {
            tarefa.status = status === 'done' ? 'ongoing' : 'done'
            setStatus(tarefa.status)
            await update(tarefa.id!, props.tarefa)
            props.triggerReload()
        } catch (error) {
            console.log(error);
            messageEventService.emit({type: 'fail', message: error instanceof Error ? error.message : "Erro desconhecido"})
        }
    }

    // Botão Editar
    const editar = () => {
        setEdit(true)
    }

    // Efeitos do botão salvar
    const salvar = async () => {
        try {
            await update(tarefa.id!, tarefa)
            setEdit(false)
            props.triggerReload()
        } catch (error) {
            messageEventService.emit({type: 'fail', message: error instanceof Error ? error.message : "Erro desconhecido"})
        }
    }

    // Efeitos do botão cancelar
    const cancelar = () => {
        setEdit(false)
        setTarefa(props.tarefa)
    }

    // ícone de edição
    const editIcon = () => {
        return (
            <div style={{'cursor': 'pointer'}} className="p-1" 
                aria-label="button" title="Editar" onClick={editar}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-pen" viewBox="0 0 16 16">
                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                </svg>
            </div>
        );
    }

    // ícone cancelar
    const cancelIcon = () => {
        return (
            <div style={{'cursor': 'pointer'}} className="p-1" 
                aria-label="button" title="Cancelar" onClick={cancelar} >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                </svg>
            </div>
        );
    }

    // ícone salvar
    const saveIcon = () => {
        return (
            <div style={{'cursor': 'pointer'}} className="p-1" 
                        aria-label="button" title="Salvar" onClick={salvar}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-floppy" viewBox="0 0 16 16">
                    <path d="M11 2H9v3h2z"/>
                    <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                </svg>
            </div>

        );
    }

    // ícone remover
    const removeIcon = () => {
        return (
            <div style={{'cursor': 'pointer'}} className="p-1" 
                aria-label="button" title="Remover" onClick={() => props.deletar(props.tarefa)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-trash3" viewBox="0 0 16 16">
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
                </svg>
            </div>
        );
    }


    return (
        <div className={"row gap-3 p-2 p-lg-3 w-100 rounded-4 " + props.tarefa.status}>

            {status === 'ongoing' ? 
                <div style={{'cursor': 'pointer'}} className="p-1 col-lg-1" 
                        aria-label="button" title="Marcar como concluída" onClick={toggleConcluido}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    </svg>
                </div>            
            : 
                <div style={{'cursor': 'pointer'}} className="p-1 col-lg-1" 
                        aria-label="button" title="Marcar como inconcluída" onClick={toggleConcluido}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                    </svg>
                </div>
            }


            <form className="col-lg-9 d-flex flex-column gap-1 flex-fill" >

                <input className="m-0 fs-5 fw-bold text-body" placeholder="Título" name="title" value={tarefa.title} onChange={handleChange} disabled={!edit} />
                { edit ? <textarea className="m-0 fs-6 text-body-secondary" placeholder="Descrição" name="description" rows={3} disabled={!edit} value={tarefa.description} onChange={handleChange}></textarea>
                : <div className=''><span className="m-0 fs-6 text-body-secondary text-break" >{tarefa.description}</span></div> }
                <div className="d-flex flex-row flex-wrap gap-3 text-body-tertiary align-items-center">
                    <div className="px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-alarm" viewBox="0 0 16 16">
                            <path d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9z"/>
                            <path d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1zm1.038 3.018a6 6 0 0 1 .924 0 6 6 0 1 1-.924 0M0 3.5c0 .753.333 1.429.86 1.887A8.04 8.04 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5M13.5 1c-.753 0-1.429.333-1.887.86a8.04 8.04 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1"/>
                        </svg>
                    </div>
                    <div className="d-flex flex-wrap flex-row flex-fill justify-content-between gap-1 text-date">
                        <small>Início: <input type="datetime-local" name="date_start" value={tarefa.date_start} onChange={handleChange} disabled={!edit} /></small>
                        <small>Prazo: <input type="datetime-local" name="date_end" value={tarefa.date_end} onChange={handleChange} disabled={!edit} /></small>
                    </div>
                </div>
            </form>

            <div className="col-lg-1 d-flex flex-row flex-lg-column flex-wrap gap-3 pt-1 aling-items-start justify-content-start" >
                {edit ? saveIcon() : editIcon()}
                {edit ? cancelIcon() : removeIcon()}
            </div>

        </div>
    );

}