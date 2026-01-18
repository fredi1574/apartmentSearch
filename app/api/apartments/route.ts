import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { getApartments, saveApartment, deleteApartment, updateApartment } from '@/lib/storage';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id || session.user.email;
    const apartments = await getApartments(userId);
    return NextResponse.json(apartments);
}

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id || session.user.email;
    try {
        const apartment = await request.json();
        // If it's a new manual entry, we need to add ID and timestamp
        if (!apartment.id) {
            apartment.id = Math.random().toString(36).substring(7);
            apartment.addedAt = new Date().toISOString();
            apartment.status = apartment.status || 'active';
        }
        await saveApartment(userId, apartment);
        return NextResponse.json({ success: true, apartment });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to save apartment' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id || session.user.email;
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ success: false }, { status: 400 });

        await deleteApartment(userId, id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete apartment' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id || session.user.email;
    try {
        const body = await request.json();
        const { id, ...updates } = body;
        if (!id) return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });

        await updateApartment(userId, id, updates);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update apartment' }, { status: 500 });
    }
}
