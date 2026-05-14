import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/mongoose';
import Product from '@/lib/models/Product';
import { allProducts } from '@/lib/data';

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({});
    
    // Seed initial products if empty
    if (products.length === 0 && allProducts.length > 0) {
      await Product.insertMany(allProducts);
      const seededProducts = await Product.find({});
      return NextResponse.json(seededProducts);
    }
    
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const newProduct = new Product({
      ...body,
      id: body.id || `prod_${Date.now()}`,
    });
    
    await newProduct.save();
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create product", details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const updatedProduct = await Product.findOneAndUpdate(
      { id: body.id },
      body,
      { new: true }
    );
    
    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedProduct);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update product", details: error.message }, { status: 500 });
  }
}
