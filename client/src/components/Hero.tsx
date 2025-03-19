import React from "react";

export default function Hero() {
  return (
    <section className="relative bg-[#36393F] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 md:pb-32 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Meet <span className="text-[#5865F2]">Float</span> Bot
          </h1>
          <p className="text-xl md:text-2xl text-[#B9BBBE] max-w-3xl mx-auto mb-10">
            The ultimate utility Discord bot with games, helpful commands, and everything you need to keep your server engaged.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#invite"
              className="bg-[#5865F2] hover:bg-opacity-90 text-white px-8 py-3 rounded-md text-lg font-medium"
            >
              Add to Discord
            </a>
            <a
              href="#commands"
              className="bg-[#36393F] border border-[#5865F2] text-white hover:bg-[#202225] px-8 py-3 rounded-md text-lg font-medium"
            >
              View Commands
            </a>
          </div>
        </div>
      </div>

      {/* Wave Animation */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden line-height-0 z-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-[50px] md:h-[70px]">
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="#2F3136"
          ></path>
        </svg>
      </div>
    </section>
  );
}
