"use client";

import { useState } from "react";
import { Check, Scissors, Star } from "lucide-react";

interface Feature {
  name: string;
  description: string;
  included: boolean;
}

interface PricingTier {
  name: string;
  price: {
    oneTime: number;
    installments?: {
      count: number;
      amount: number;
    };
  };
  description: string;
  features: Feature[];
  highlight?: boolean;
  badge?: string;
  icon: React.ReactNode;
}

interface PricingProps {
  tiers: PricingTier[];
}

export default function Pricing({ tiers }: PricingProps) {
  const [showInstallments, setShowInstallments] = useState(false);

  return (
    <section className="px-8 py-16">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4">Simple, transparent pricing</h2>
          <div className="inline-flex border border-black">
            {["One-Time", "Installments"].map((option) => (
              <button
                key={option}
                onClick={() => setShowInstallments(option === "Installments")}
                className={`px-6 py-2 text-sm font-medium ${
                  (option === "Installments") === showInstallments
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Tiers */}
        <div className="grid md:grid-cols-2 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col border border-black p-8 ${
                tier.highlight ? "bg-gray-100" : "bg-white"
              }`}
            >
              {/* Badge */}
              {tier.badge && tier.highlight && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-black text-white px-3 py-1 text-xs font-semibold uppercase">
                    {tier.badge}
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>{tier.icon}</div>
                <h3 className="text-xl font-bold">{tier.name}</h3>
              </div>

              {/* Price */}
              <div className="mb-6">
                {showInstallments && tier.price.installments ? (
                  <>
                    <span className="text-4xl font-bold">
                      {tier.price.installments.count} × $
                      {tier.price.installments.amount}
                    </span>
                    <span className="text-sm ml-2">installments</span>
                  </>
                ) : (
                  <>
                    <span className="text-4xl font-bold">
                      ${tier.price.oneTime}
                    </span>
                    <span className="text-sm ml-2">one-time</span>
                  </>
                )}
                <p className="mt-2 text-sm">{tier.description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-3 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature.name} className="flex items-start gap-2">
                    <Check
                      className={`w-4 h-4 mt-1 ${
                        feature.included ? "text-black" : "text-gray-400"
                      }`}
                    />
                    <div>
                      <div className="font-medium text-sm">{feature.name}</div>
                      <div className="text-xs text-gray-600">
                        {feature.description}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button
                className={`mt-8 py-3 text-sm font-medium border border-black w-full ${
                  tier.highlight
                    ? "bg-black text-white hover:bg-gray-900"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {tier.highlight ? "Buy Now" : "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
