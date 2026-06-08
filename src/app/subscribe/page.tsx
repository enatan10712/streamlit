"use client";

import { Check, Loader2 } from "lucide-react";
import { useState } from "react";
import { createCheckoutSession } from "@/actions/stripe";
import Navbar from "@/components/Navbar";

const TIERS = [
  {
    id: "basic",
    name: "Basic",
    price: "$9.99",
    priceId: "price_basic_id",
    quality: "480p",
    devices: "1",
    features: ["Unlimited movies and TV shows", "Watch on your mobile phone and tablet", "Ad-free experience"],
  },
  {
    id: "standard",
    name: "Standard",
    price: "$15.99",
    priceId: "price_standard_id",
    quality: "1080p",
    devices: "2",
    features: ["Everything in Basic", "Full HD available", "Watch on 2 devices at the same time"],
    recommended: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "$19.99",
    priceId: "price_premium_id",
    quality: "4K + HDR",
    devices: "4",
    features: ["Everything in Standard", "Ultra HD available", "Watch on 4 devices at the same time"],
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
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
            Choose your plan
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Switch or cancel anytime. No commitments, just pure cinematic experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`relative bg-white/5 border ${tier.recommended ? 'border-primary ring-1 ring-primary' : 'border-white/10'} rounded-2xl p-8 flex flex-col gap-8 transition-transform hover:scale-[1.02]`}
            >
              {tier.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-widest">
                  Most Popular
                </div>
              )}

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-white">{tier.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>

              <div className="space-y-4 border-t border-white/10 pt-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 italic">Video Quality</span>
                  <span className="text-white font-bold">{tier.quality}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 italic">Supported Devices</span>
                  <span className="text-white font-bold">{tier.devices}</span>
                </div>
              </div>

              <ul className="flex-1 space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                    <Check className="h-5 w-5 text-primary shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(tier.priceId)}
                disabled={!!loading}
                className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all ${
                  tier.recommended
                    ? 'bg-primary text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:bg-primary/90'
                    : 'bg-white/10 text-white hover:bg-white/20'
                } flex items-center justify-center gap-2`}
              >
                {loading === tier.priceId ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Subscribe Now"
                )}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-gray-500 text-xs max-w-2xl mx-auto italic leading-relaxed">
          HD (720p), Full HD (1080p), Ultra HD (4K) and HDR availability subject to your internet service and device capabilities. Not all content is available in all resolutions. See our Terms of Use for more details.
        </p>
      </div>
    </div>
  );
}
