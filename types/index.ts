// /types/index.ts

export interface Task {
  _id: string;
  name: string;
  description: string;
  dueDate: Date;
  userId?: string;
  currentTurnUserId: string;
  createdAt: Date;
  lastCompletedAt?: Date;
}

export interface Purchase {
  _id: string;
  item: string;
  quantity: number;
  price: number;
  userId: string;
  createdAt: Date;
  purchaseDate: Date;
}

export interface User {
  _id: string;
  name: string;
  email?: string;
  createdAt: Date;
}

export interface TaskHistory {
  _id: string;
  taskId: string;
  userId: string;
  completed: boolean;
  completedAt: Date;
}
// types/index.ts
export interface Purchase {
  _id: string;
  item: string;
  quantity: number;
  price: number;
  userId: string;
  createdAt: Date;
  purchaseDate: Date;
}

// For components that work with serialized data
export interface SerializedPurchase {
  _id: string;
  item: string;
  quantity: number;
  price: number;
  userId: string;
  createdAt: string;
  purchaseDate: string;
}
