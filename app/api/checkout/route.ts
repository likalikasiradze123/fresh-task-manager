import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, phone, address, comment, items, totalPrice } = body;

    // აქ შეგიძლიათ დაამატოთ Telegram Bot-ის, Email-ის ან სხვა სერვისის ინტეგრაცია
    console.log('მიღებულია ახალი შეკვეთა:', {
      customerName,
      phone,
      address,
      comment,
      items,
      totalPrice,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 500 });
  }
}