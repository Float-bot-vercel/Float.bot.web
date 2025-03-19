import React from "react";

export default function CTA() {
  return (
    <section id="invite" className="bg-[#5865F2] py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to enhance your Discord server?
        </h2>
        <p className="text-white text-opacity-90 text-xl mb-10 max-w-3xl mx-auto">
          Add Float to your server today and unlock a world of utility commands, fun mini-games, and engaging features.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="#"
            className="bg-white text-[#5865F2] px-8 py-3 rounded-md text-lg font-medium hover:bg-opacity-90"
          >
            Add to Discord
          </a>
          <a
            href="#"
            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-white hover:bg-opacity-10"
          >
            Join Support Server
          </a>
        </div>
      </div>
    </section>
  );
}
