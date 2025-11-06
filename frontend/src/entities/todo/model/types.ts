export interface Todo {
  id: number
  userId: number
  title: string
  completed: boolean
  createdAt: string
}

export interface CreateTodoDto {
  title: string
}
