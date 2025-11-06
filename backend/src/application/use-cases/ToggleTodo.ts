import { ITodoRepository } from '../../domain/repositories/ITodoRepository'
import { Todo } from '../../domain/entities/Todo'

export class ToggleTodo {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(todoId: number, userId: number): Promise<Todo> {
    const todo = await this.todoRepository.findById(todoId)

    if (!todo || todo.userId !== userId) {
      throw new Error('Todo not found or unauthorized')
    }

    const updated = await this.todoRepository.update(todoId, userId, !todo.completed)

    if (!updated) {
      throw new Error('Failed to update todo')
    }

    return updated
  }
}
