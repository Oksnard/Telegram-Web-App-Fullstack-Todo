import { ITodoRepository } from '../../domain/repositories/ITodoRepository'
import { Todo } from '../../domain/entities/Todo'

export class CreateTodo {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(userId: number, title: string): Promise<Todo> {
    if (!title || title.trim().length === 0) {
      throw new Error('Title cannot be empty')
    }

    return await this.todoRepository.create({
      userId,
      title: title.trim(),
    })
  }
}
