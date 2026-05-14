import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Category from '@/lib/models/Category';

export async function GET() {
  try {
    await dbConnect();
    const categories = await Category.find({});
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const newCategory = new Category({
      ...body,
      id: body.id || `cat_${Date.now()}`,
    });
    
    await newCategory.save();
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create category", details: error.message }, { status: 500 });
  }
}
