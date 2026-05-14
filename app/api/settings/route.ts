import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import dbConnect from '@/lib/mongoose';
import Setting from '@/lib/models/Setting';

export async function GET() {
  try {
    await dbConnect();
    let settings = await Setting.findOne({ id: 'global_settings' });
    
    if (!settings) {
      settings = new Setting({ id: 'global_settings' });
      await settings.save();
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const settings = await Setting.findOneAndUpdate(
      { id: 'global_settings' },
      body,
      { new: true, upsert: true }
    );
    
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update settings", details: error.message }, { status: 500 });
  }
}
