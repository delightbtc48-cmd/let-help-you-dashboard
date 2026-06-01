export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  photo: string;
  balance: number;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'in' | 'out';
  amount: number;
  description: string;
  date: string;
  recipientEmail?: string;
}