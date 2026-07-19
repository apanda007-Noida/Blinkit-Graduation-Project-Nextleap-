import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { items } = await req.json();
    
    // Simulate predictable pricing logic
    let subtotal = 0;
    let hasHighFrictionCategory = false;
    
    items.forEach((item: any) => {
      subtotal += item.price;
      if (item.friction === "High") {
        hasHighFrictionCategory = true;
      }
    });

    // The predictable pricing feature: 
    // If they order a high-friction item (electronics) alongside groceries, 
    // the platform waives the handling fee to encourage exploration.
    const handlingFee = hasHighFrictionCategory ? 0 : 15;
    const deliveryFee = subtotal > 200 ? 0 : 25;
    
    const total = subtotal + handlingFee + deliveryFee;
    
    return NextResponse.json({
      subtotal,
      handlingFee,
      deliveryFee,
      total,
      hasHighFrictionCategory,
      message: hasHighFrictionCategory 
        ? "No handling fee applied for cross-category exploration!" 
        : "Add an electronic or beauty item to waive the handling fee."
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
