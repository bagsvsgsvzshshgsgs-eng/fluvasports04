import fs from 'fs';
import path from 'path';

export interface Category {
  id: string;
  name: string;
  isFeatured: boolean;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

const dbPath = path.join(process.cwd(), 'data', 'categories.json');

export const db = {
  read: (): { categories: Category[] } => {
    try {
      if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, JSON.stringify({ categories: [] }));
      }
      const data = fs.readFileSync(dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error("Failed to read database:", error);
      return { categories: [] };
    }
  },
  write: (data: { categories: Category[] }) => {
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
