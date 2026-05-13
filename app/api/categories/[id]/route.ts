import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const data = db.read();
    
    const index = data.categories.findIndex(c => c.id === id);
    if (index === -1) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    
    data.categories[index] = {
      ...data.categories[index],
      ...body,
      updatedAt: new Date().toISOString()
    };
    
    db.write(data);
    return NextResponse.json(data.categories[index]);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const data = db.read();
    
    // Find the category and all its children to delete recursively
    const idsToDelete = new Set<string>();
    
    const collectChildren = (parentId: string) => {
      idsToDelete.add(parentId);
      data.categories
        .filter(c => c.parentId === parentId)
        .forEach(child => collectChildren(child.id));
    };
    
    collectChildren(id);
    
    data.categories = data.categories.filter(c => !idsToDelete.has(c.id));
    db.write(data);
    
    return NextResponse.json({ success: true, deletedCount: idsToDelete.size });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
