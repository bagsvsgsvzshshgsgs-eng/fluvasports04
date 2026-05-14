import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { allProducts } from '@/lib/data';

export async function GET() {
  const data = db.read();
  
  // Seed initial products if empty
  if (data.products.length === 0 && allProducts.length > 0) {
    data.products = allProducts;
    db.write(data);
  }
  
  return NextResponse.json(data.products);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = db.read();
    
    const newProduct = {
      ...body,
      id: body.id || `prod_${Date.now()}`,
    };
    
    data.products.unshift(newProduct);
    db.write(data);
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const data = db.read();
    
    const index = data.products.findIndex(p => p.id === body.id);
    if (index === -1) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    data.products[index] = body;
    db.write(data);
    
    return NextResponse.json(body);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
