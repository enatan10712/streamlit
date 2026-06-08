'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const PLANS = [
  {
    name: 'Free',
    price: '$0',
    period: 'Forever',
    description: 'Start streaming with ads',
    features: [
      'Access to full catalog',
      'Standard quality (480p)',
      'Watch on 1 screen at a time',
      'Ad-supported content',
      'Up to 5 profiles',
      'Basic recommendations',
    ],
    recommended: false,
    color: 'from-blue-500 to-cyan-500',
    buttonText: 'Get Started',
    buttonVariant: 'secondary',
  },
  {
    name: 'Premium',
    price: '$15',
    period: '/month',
    description: 'The perfect plan for you',
    features: [
      'Access to full catalog',
      '4K Ultra HD + HDR',
      'Watch on 4 screens at once',
      'Ad-free experience',
      'Up to 5 profiles',
      'Downloads for offline viewing',
      'Priority support',
      'Exclusive content early access',
    ],
    recommended: true,
    color: 'from-purple-500 to-pink-500',
    buttonText: 'Subscribe Now',
    buttonVariant: 'primary',
  },
  {
    name: 'Family',
    price: '$25',
    period: '/month',
    description: 'Share with your loved ones',
    features: [
      'Everything in Premium',
      'Watch on up to 6 screens',
      'Up to 6 profiles',
      'Parental controls',
      'Family hub & settings',
      'Separate watchlists',
      'Priority customer support',
      'First access to new releases',
      'Gaming catalog included',
    ],
    recommended: false,
    color: 'from-orange-500 to-red-500',
    buttonText: 'Subscribe Now',
    buttonVariant: 'secondary',
  },
];

export default function SubscribePage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex flex-col">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-white/10 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white hover:text-purple-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Choose Your Plan</h1>
          <div className="w-12"></div>
        </div>
      </motion.header>

      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-7xl"
        >
          {/* Billing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex gap-4 bg-white/10 border border-white/20 rounded-full p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2 rounded-full font-semibold transition-all relative ${
                  billingCycle === 'annual'
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Annual
                <span className="absolute -top-3 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {PLANS.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative rounded-2xl border transition-all duration-300 overflow-hidden group ${
                  plan.recommended
                    ? 'border-purple-400/50 bg-white/10 shadow-2xl md:scale-105'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                {/* Recommended Badge */}
                {plan.recommended && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold py-2 text-center">
                    MOST POPULAR
                  </div>
                )}

                <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                <div className={`relative p-8 ${plan.recommended ? 'pt-16' : ''}`}>
                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-slate-400 text-sm mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="text-4xl font-bold text-white">
                      {plan.price}
                      <span className="text-lg text-slate-400 font-normal ml-1">{plan.period}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition-all mb-8 ${
                      plan.buttonVariant === 'primary'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    {plan.buttonText}
                  </button>

                  {/* Features */}
                  <div className="space-y-4">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              {[
                {
                  q: 'Can I change my plan anytime?',
                  a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.',
                },
                {
                  q: 'Do you offer a free trial?',
                  a: 'Sign up for our Free plan to start streaming with ads. Cancel anytime, no credit card required.',
                },
                {
                  q: 'What is included in each plan?',
                  a: 'See the detailed features above. Premium adds 4K, no ads, and offline downloads. Family adds more screens and parental controls.',
                },
                {
                  q: 'How many screens can I use?',
                  a: 'Free: 1 screen, Premium: 4 screens, Family: 6 screens. All paid plans support simultaneous streaming.',
                },
              ].map((item, i) => (
                <details
                  key={i}
                  className="group bg-white/5 border border-white/10 rounded-lg p-4 cursor-pointer hover:border-white/20 transition-colors"
                >
                  <summary className="flex items-center justify-between font-semibold text-white">
                    {item.q}
                    <span className="transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <p className="mt-3 text-slate-400">{item.a}</p>
                </details>
              ))}
            </div>
          </motion.div>

          {/* Footer Note */}
          <div className="mt-12 text-center text-slate-400 text-sm">
            <p>All plans include access to our complete library of movies and TV shows.</p>
            <p className="mt-2">Questions? Contact our support team 24/7.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
