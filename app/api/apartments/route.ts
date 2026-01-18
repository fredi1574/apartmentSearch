import { NextResponse } from 'next/server';
import { getApartments, saveApartment, deleteApartment, Apartment } from '@/lib/storage';

export async function GET() {
  const apartments = await getApartments();
  return NextResponse.json(apartments);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newApartment: Apartment = {
      ...body,
      id: Math.random().toString(36).substring(7),
      addedAt: new Date().toISOString(),
      status: 'active'
    };
    
    await saveApartment(newApartment);
    return NextResponse.json({ success: true, apartment: newApartment });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save apartment' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });

        await deleteApartment(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete apartment' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;
        if (!id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });

        const { updateApartment } = await import('@/lib/storage');
        await updateApartment(id, updates);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update apartment' }, { status: 500 });
    }
}
