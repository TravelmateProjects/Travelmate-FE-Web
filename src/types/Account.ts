export interface Account {
  id: string;
  username: string;
  role: 'user' | 'admin' | 'partner';
  userId?: string;
  // Add more fields as needed
}
