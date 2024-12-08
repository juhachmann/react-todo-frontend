import React, { useEffect, useState } from 'react';
import Message from './components/message';
import messageEventService from './message.service';
import ModalAdd from './components/modal-add';
import { getAll } from './data.service';
import ModalDelete from './components/modal-delete';
import CardTarefa from './components/card-tarefa';
import Footer from './components/footer';


function App() {

  const [error, setError] = useState<string | null>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<Tarefa[]>([])

  const [reload, setReload] = useState(false)

  const [addModalHidden, setAddModalHidden] = useState(true)
  const [deleteModalHidden, setDeleteModalHidden] = useState(true)
 
  const [selectedTodo, setSelectedTodo] = useState<Tarefa | undefined>(undefined)

  // Controle para recarregar dados após alguma atualização
  const triggerReload  = () => {
    setReload(!reload)
  }

  // Recarrega dados de tarefas
  useEffect(() => {    
    loadData()
  }, [reload])

  // Efeito do botão adicionar
  const adicionar = () => {
    setAddModalHidden(false)    
  }

  // Efeito dos botões de deletar
  const deletar = (todo: Tarefa) => {
    setSelectedTodo(todo)
    setDeleteModalHidden(false)
  }

  // Pegar os dados com um service e trata as exceções com mensagens de erro ao usuário
  const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
          const response = await getAll()
          setData(response)
          setLoading(false)
      } catch(error) {
          setLoading(false)
          setError(error instanceof Error ? error.message : 'Erro desconhecido')
      }
  }

  useEffect(() => {
      if(error)
        messageEventService.emit({type: "fail", message: error})
      setError(null)
  }, [error])


  return (
      <div className="App p-3 p-lg-5 min-vh-100 d-flex flex-column">

      <div className='flex-fill d-flex flex-column col col-md-10 col-lg-8 mx-auto bg-white shadow-lg mt-3 mb-5 rounded-4 p-3'>

        <div className="MainContainer d-flex flex-column gap-3 m-md-5 flex-fill">

          <div className='d-flex flex-row flex-wrap w-100 justify-content-between align-items-center mb-5'>
            <h1 className='fs-2 fw-bold text-title'>Agenda de Tarefas</h1>
            <div className='p-2' style={{'cursor': 'pointer'}}  onClick={adicionar} title='Adicionar Tarefa'>
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" 
                fill="text-primary" className="bi bi-plus-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
              </svg>
            </div>
          </div>

          { loading && 
              <div className='flex-fill d-flex align-items-center justify-content-center'>
                  <div className="spinner-grow" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
              </div>          
          }

          {(data.length === 0 && !loading)  &&
            <div className='flex-fill d-flex align-items-center justify-content-center'>
              <span className='fs-5'>Você não tem nenhuma tarefa &#127880;</span>
            </div>
          }

          {!loading &&
          <div className='d-flex flex-column gap-3'>
              {data.filter(item => item.status === 'ongoing').map(item => <div key={item.id}><CardTarefa props={{tarefa: item, triggerReload: triggerReload,
                deletar: deletar
              }} /></div>)}

              {data.filter(item => item.status === 'done').map(item => <div key={item.id}><CardTarefa props={{tarefa: item, triggerReload: triggerReload,
                deletar: deletar
              }} /></div>)}
            </div>
          }

          </div>
        </div>

          <Footer />

          <Message/>

          <ModalAdd hidden={addModalHidden} setHidden={setAddModalHidden} triggerReload={triggerReload} />

          <ModalDelete hidden={deleteModalHidden} setHidden={setDeleteModalHidden} 
            todo={selectedTodo} triggerReload={triggerReload}/>

      </div>

  );
}

export default App;
