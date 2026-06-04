import { stripe } from "@/lib/stripe";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }
  const session = event.data.object as any;
  if (event.type === "checkout.session.completed") {
    const subscription = (await stripe.subscriptions.retrieve(session.subscription as string)) as any;
    if (!session?.metadata?.userId) return new NextResponse("User id is required", { status: 400 });
    await prisma.subscription.upsert({
      where: { userId: session.metadata.userId },
      update: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
      create: {
        userId: session.metadata.userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });
  }
  return new NextResponse(null, { status: 200 });
}
