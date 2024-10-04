export interface User {
  id?: string;
  fullName: string;
  email: string;
  password?: string;
  avatarUrl?: string; // Optional: URL for user’s avatar image
}
