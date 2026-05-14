import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Category from '@/lib/models/Category';

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await context.params;
    const body = await request.json();
    
    const updatedCategory = await Category.findOneAndUpdate(
      { id },
      { ...body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!updatedCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedCategory);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update category", details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();
    const { id } = await context.params;
    
    // Find all children recursively to delete
    const categories = await Category.find({});
    const idsToDelete = new Set<string>();
    
    const collectChildren = (parentId: string) => {
      idsToDelete.add(parentId);
      categories
        .filter(c => c.parentId === parentId)
        .forEach(child => collectChildren(child.id));
    };
    
    collectChildren(id);
    
    const result = await Category.deleteMany({ id: { $in: Array.from(idsToDelete) } });
    
    return NextResponse.json({ success: true, deletedCount: result.deletedCount });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete category", details: error.message }, { status: 500 });
  }
}
