import { ITodoRepository } from '../../domain/repositories/ITodoRepository'
import { Todo } from '../../domain/entities/Todo'

export class CreateTodo {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(userId: number, title: string): Promise<Todo> {
    if (!title?.trim()) {
      throw new Error('Title cannot be empty')
    }

    return this.todoRepository.create({
      userId,
      title: title.trim(),
    })
  }
}
