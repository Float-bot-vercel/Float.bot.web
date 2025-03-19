import React from "react";
import { faqs } from "@/lib/data";

export default function FAQ() {
  return (
    <section id="faq" className="bg-[#36393F] py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[#B9BBBE] max-w-2xl mx-auto">
            Find answers to commonly asked questions about Float bot.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-[#202225] rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
              <p className="text-[#B9BBBE]">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
