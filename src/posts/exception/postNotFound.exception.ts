import { NotFoundException } from '@nestjs/common';

export class PostNotFoundException extends NotFoundException {
  constructor(id?: number) {
    super(`Post not found with id = ${id}`);
  }
}
