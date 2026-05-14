import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/mongoose';
import Order from '@/lib/models/Order';

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch orders", details: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const newOrder = new Order({
      ...body,
      id: body.id || `FLV-${Math.floor(Math.random() * 90000) + 10000}-${Math.floor(Math.random() * 9000) + 1000}`,
      date: body.date || new Date().toISOString().split('T')[0],
    });
    
    await newOrder.save();
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create order", details: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const updatedOrder = await Order.findOneAndUpdate(
      { id: body.id },
      body,
      { new: true }
    );
    
    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    
    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update order", details: error.message }, { status: 500 });
  }
}
