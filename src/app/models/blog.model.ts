// blog.model.ts
import { User } from './user.model';
import { Comment } from './comment.model';

export interface Blog {
  id: number;
  title: string;
  image: string; // URL to the blog’s cover image
  author: User; // Blog post author
  description: string;
  date: Date;
  comments: Comment[]; // Array of comments for this blog post
}
