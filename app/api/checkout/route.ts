import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, phone, address, items, totalPrice } = body;

    // შეკვეთის ტექსტის ფორმატირება
    const orderText = `🛍️ **ახალი შეკვეთა Lika's Workshop-იდან!**\n\n` +
      `👤 **მომხმარებელი:** ${customerName}\n` +
      `📞 **ტელეფონი:** ${phone}\n` +
      `📍 **მისამართი:** ${address}\n\n` +
      `📦 **ნივთები:**\n${items.map((i: any) => `- ${i.title} (${i.price} ₾)`).join('\n')}\n\n` +
      `💰 **სულ ჯამი:** ${totalPrice} ₾`;

    // 1. ვარიანტი A: Make.com / Zapier Webhook-ის მეშვეობით Facebook Messenger-ში გაგზავნა
    const WEBHOOK_URL = process.env.MESSENGER_WEBHOOK_URL;

    if (WEBHOOK_URL) {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: orderText }),
      });
    }

    return NextResponse.json({ success: true, message: 'შეკვეთა მიღებულია!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'შეცდომა შეკვეთისას' }, { status: 500 });
  }
}