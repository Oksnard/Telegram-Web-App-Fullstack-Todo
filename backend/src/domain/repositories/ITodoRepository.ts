import { Todo, CreateTodoDto } from '../entities/Todo'

export interface ITodoRepository {
  findByUserId(userId: number): Promise<Todo[]>
  findById(id: number): Promise<Todo | null>
  create(data: CreateTodoDto): Promise<Todo>
  update(id: number, userId: number, completed: boolean): Promise<Todo | null>
  delete(id: number, userId: number): Promise<boolean>
}
