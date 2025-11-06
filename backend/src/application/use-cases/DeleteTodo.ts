import { ITodoRepository } from '../../domain/repositories/ITodoRepository'

export class DeleteTodo {
  constructor(private todoRepository: ITodoRepository) {}

  async execute(todoId: number, userId: number): Promise<boolean> {
    const deleted = await this.todoRepository.delete(todoId, userId)

    if (!deleted) {
      throw new Error('Todo not found or unauthorized')
    }

    return true
  }
}
