export interface User {
  id?: string;
  fullName: string;
  displayName?: string;
  email: string;
  password?: string;
  likedBlogsIds?: string[]; // Optional: Array of blog IDs that user has liked
  avatarUrl?: string; // Optional: URL for user’s avatar image
}
