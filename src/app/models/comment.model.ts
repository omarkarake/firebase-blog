// comment.model.ts
import { User } from './user.model';

export interface Comment {
  id: number;
  author: User; // Author is a User model
  content: string;
  date: Date;
}
