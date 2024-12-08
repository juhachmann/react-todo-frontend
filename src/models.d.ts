
interface Tarefa {
    id?:            number
    title:          string
    description:    string
    status?:         'done' | 'ongoing'
    date_start:     string
    date_end:       string
}

