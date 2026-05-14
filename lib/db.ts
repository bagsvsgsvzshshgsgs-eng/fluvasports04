import fs from 'fs';
import path from 'path';
import { Product } from './data';

export interface Category {
  id: string;
  name: string;
  isFeatured: boolean;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  items: any[];
  total: number;
  status: string;
  date: string;
}

export interface DbData {
  categories: Category[];
  products: Product[];
  orders: Order[];
  settings: any;
  activityLogs: any[];
}

const dbPath = path.join(process.cwd(), 'data', 'db.json');

const DEFAULT_DATA: DbData = {
  categories: [],
  products: [],
  orders: [],
  settings: {},
  activityLogs: []
};

export const db = {
  read: (): DbData => {
    try {
      if (!fs.existsSync(dbPath)) {
        // If categories.json exists, migrate it
        const oldPath = path.join(process.cwd(), 'data', 'categories.json');
        if (fs.existsSync(oldPath)) {
          const oldData = JSON.parse(fs.readFileSync(oldPath, 'utf8'));
          const newData = { ...DEFAULT_DATA, categories: oldData.categories || [] };
          fs.writeFileSync(dbPath, JSON.stringify(newData, null, 2));
          return newData;
        }
        fs.writeFileSync(dbPath, JSON.stringify(DEFAULT_DATA, null, 2));
        return DEFAULT_DATA;
      }
      const data = fs.readFileSync(dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error("Failed to read database:", error);
      return DEFAULT_DATA;
    }
  },
  write: (data: DbData) => {
    try {
      if (!fs.existsSync(path.dirname(dbPath))) {
        fs.mkdirSync(path.dirname(dbPath), { recursive: true });
      }
      fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Failed to write database:", error);
    }
  }
};
