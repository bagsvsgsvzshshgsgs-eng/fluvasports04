import { NextResponse } from 'next/server';
import { db, Category } from '@/lib/db';

function buildTree(categories: Category[], parentId: string | null = null): any[] {
  return categories
    .filter(cat => cat.parentId === parentId)
    .map(cat => ({
      ...cat,
      children: buildTree(categories, cat.id)
    }));
}

export async function GET() {
  const data = db.read();
  const tree = buildTree(data.categories);
  return NextResponse.json(tree);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = db.read();
    
    const newCategory: Category = {
      id: `cat_${Date.now()}`,
      name: body.name || 'New Category',
      isFeatured: body.isFeatured || false,
      parentId: body.parentId || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    data.categories.push(newCategory);
    db.write(data);
    
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
