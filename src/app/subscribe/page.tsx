"use client";

import { Check, Zap } from "lucide-react";
import { createCheckoutSession } from "@/actions/stripe";
import Navbar from "@/components/Navbar";
import { useState } from "react";

const PLANS = [
  {
    id: "basic",
    name: "Basic",
    price: "$9.99",
    priceId: "price_basic_id", // Replace with real Stripe Price IDs
    features: ["480p Quality", "1 Device", "Unlimited Movies & TV", "Cancel Anytime"],
  },
  {
    id: "standard",
    name: "Standard",
    price: "$15.49",
    priceId: "price_standard_id",
    features: ["1080p Full HD", "2 Devices", "Unlimited Movies & TV", "Cancel Anytime"],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$22.99",
    priceId: "price_premium_id",
    features: ["4K + HDR Quality", "4 Devices", "Unlimited Movies & TV", "Cancel Anytime"],
  },
];

export default function SubscribePage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string) => {
    setLoading(priceId);
    try {
      await createCheckoutSession(priceId);
    } catch (error) {
      console.error(error);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0c1d]">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-32 pb-20">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
            Choose the plan that&apos;s <span className="text-primary">right for you.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join StreamVault today and experience cinematic excellence at your fingertips.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col p-8 rounded-3xl border ${plan.popular ? 'border-primary bg-primary/5' : 'border-white/10 bg-white/5'} transition-all hover:scale-105`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Zap className="h-3 w-3 fill-current" />
                  MOST POPULAR
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>

              <div className="flex-1 space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-gray-300">
                    <Check className="h-5 w-5 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleSubscribe(plan.priceId)}
                disabled={!!loading}
                className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'bg-primary text-white hover:bg-primary/90' : 'bg-white text-black hover:bg-white/90'} disabled:opacity-50`}
              >
                {loading === plan.priceId ? 'Processing...' : 'Subscribe Now'}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-gray-500 max-w-xl mx-auto">
          HD (720p), Full HD (1080p), Ultra HD (4K) and HDR availability subject to your internet service and device capabilities. Not all content is available in all resolutions. See our Terms of Use for more details.
        </p>
      </div>
    </div>
  );
}
