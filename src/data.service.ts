
const baseUrl = process.env.REACT_APP_API_URL

/**
 * Recupera todas as tarefas via API
 * Lança exceção se houver resposta de erro ou falha de rede
 */
const getAll = async () : Promise<Tarefa[]> => {
    let endpoint = '/tarefas'
    try {
        const response = await fetch(baseUrl + endpoint); 
        const data = await response.json();        
        if (!response.ok) {  
          throw new Error(`${data.message}`);
        }
        return data.data;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Erro desconhecido');
    }
}

/**
 * Cria uma nova tarefas via API
 * Lança exceção se houver resposta de erro ou falha de rede
 */
const create = async (todo: Tarefa) : Promise<Tarefa> => {
    let endpoint = '/tarefas'
    if(todo.date_end == null) todo.date_end = ''
    console.log(todo);
        
    try {
        const response = await fetch(baseUrl + endpoint, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(todo),
        }); 
        const data = await response.json();
        
        if (!response.ok) {  
          throw new Error(`${data.message}`);
        }
        return data.data;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Erro desconhecido');
    }
}

/**
 * Atualiza uma tarefa via API
 * Lança exceção se houver resposta de erro ou falha de rede
 */
const update = async (id: number, todo: Tarefa) : Promise<Tarefa> => {
    let endpoint = `/tarefas/${id}`
    if(todo.date_end == null) todo.date_end = ''
    try {
        const response = await fetch(baseUrl + endpoint, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(todo),
        }); 
        const data = await response.json();
        if (!response.ok) {  
          throw new Error(`${data.message}`);
        }
        return data.data;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Erro desconhecido');
    }
}

/**
 * Exclui uma tarefa via API
 * Lança exceção se houver resposta de erro ou falha de rede
 */
const deleteTarefa = async (id: number) : Promise<void> => {
    let endpoint = `/tarefas/${id}`
    try {
        const response = await fetch(baseUrl + endpoint, {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json', 
            }
        }); 
        if (!response.ok) {  
            const data = await response.json();
            throw new Error(`${data.message}`);
        }
        return;
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Erro desconhecido');
    }
}


export { getAll, update, create, deleteTarefa }
