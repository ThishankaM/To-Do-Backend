// src/todos/todos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { Todo } from './entities/todo.entity.js';
import { randomUUID } from 'crypto';

@Injectable()
export class TodosService {
  // In-memory database
  private todos: Todo[] = [];

  create(createTodoDto: CreateTodoDto): Todo {
    const newTodo: Todo = {
      id: randomUUID(),
      title: createTodoDto.title,
      description: createTodoDto.description || '',
      completed: createTodoDto.completed || false,
      status: createTodoDto.status || 'todo',
      progress: createTodoDto.progress || 0,
      dueDate: createTodoDto.dueDate || new Date().toLocaleDateString(),
      comments: createTodoDto.comments || 0,
      attachments: createTodoDto.attachments || 0,
      createdAt: new Date(),
    };
    this.todos.push(newTodo);
    return newTodo;
  }

  findAll(): Todo[] {
    return this.todos;
  }

  findOne(id: string): Todo {
    const todo = this.todos.find((t) => t.id === id);
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  update(id: string, updateTodoDto: UpdateTodoDto): Todo {
    const todoIndex = this.todos.findIndex((t) => t.id === id);
    if (todoIndex === -1) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    // Sync 'completed' boolean with Kanban 'status' if needed
    if (updateTodoDto.status === 'done') {
      updateTodoDto.completed = true;
    } else if (updateTodoDto.status === 'todo' || updateTodoDto.status === 'in-progress') {
      updateTodoDto.completed = false;
    }

    this.todos[todoIndex] = {
      ...this.todos[todoIndex],
      ...updateTodoDto,
    };
    return this.todos[todoIndex];
  }

  remove(id: string): void {
    const todoIndex = this.todos.findIndex((t) => t.id === id);
    if (todoIndex === -1) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    this.todos.splice(todoIndex, 1);
  }
}
