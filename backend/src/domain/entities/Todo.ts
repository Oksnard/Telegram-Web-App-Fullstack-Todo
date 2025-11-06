export interface Todo {
  id: number
  userId: number
  title: string
  completed: boolean
  createdAt: Date
}

export interface CreateTodoDto {
  userId: number
  title: string
}

export interface UpdateTodoDto {
  title?: string
  completed?: boolean
}
