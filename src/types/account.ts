export interface Account {
  id: string;
  username: string;
  role: 'user' | 'admin';
  userId?: string;
  // Add more fields as needed
}
