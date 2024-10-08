// blog.model.ts
import { Comment } from './comment.model';

export interface Blog {
  id: string;
  title: string;
  image: string; // URL to the blog’s cover image
  author: string; // Blog post author
  description: string;
  date: Date;
  likes?: number; // Number of likes for this blog post
  comments?: Comment[]; // Array of comments for this blog post
}
