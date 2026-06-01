import { User, Transaction } from '../types';

const USERS_KEY = 'fin_app_users';
const CURRENT_USER_KEY = 'fin_app_current_user';
const TRANSACTIONS_KEY = 'fin_app_transactions';

export const getStoredUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    // Also update in users list
    const users = getStoredUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      saveUsers(users);
    }
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const getTransactions = (userId: string): Transaction[] => {
  const all = localStorage.getItem(TRANSACTIONS_KEY);
  const transactions: Transaction[] = all ? JSON.parse(all) : [];
  return transactions.filter(t => t.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const addTransaction = (transaction: Transaction) => {
  const all = localStorage.getItem(TRANSACTIONS_KEY);
  const transactions = all ? JSON.parse(all) : [];
  transactions.push(transaction);
  localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
};