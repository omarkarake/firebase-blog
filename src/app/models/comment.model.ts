// comment.model.ts
import { User } from './user.model';

export interface Comment {
  id: string;
  blog_id: string; // ID of the blog post this comment belongs to
  author: string; // Author is a User model
  content: string;
  date: Date;
}
