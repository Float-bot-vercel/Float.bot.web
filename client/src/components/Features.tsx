import React from "react";
import { features } from "@/lib/data";

export default function Features() {
  return (
    <section id="features" className="bg-[#202225] py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Bot Features</h2>
          <p className="text-[#B9BBBE] max-w-2xl mx-auto">
            Float provides a wide range of features to enhance your Discord server experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-[#36393F] rounded-lg p-6 shadow-lg transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-xl">
              <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                {/* Simple placeholder icon with color style (not using dynamic class) */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: feature.iconColor }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-[#B9BBBE]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
