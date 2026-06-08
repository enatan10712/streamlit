"use server";

import { stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export async function createCheckoutSession(priceId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/browse?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/subscribe?canceled=true`,
    customer_email: session.user.email,
    metadata: {
      userId: session.user.id,
    },
  });

  if (!checkoutSession.url) throw new Error("Failed to create checkout session");

  redirect(checkoutSession.url);
}

export async function createPortalSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  });

  if (!user?.subscription?.stripeCustomerId) {
    throw new Error("No subscription found");
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.subscription.stripeCustomerId,
    return_url: `${process.env.NEXTAUTH_URL}/settings`,
  });

  redirect(portalSession.url);
}
