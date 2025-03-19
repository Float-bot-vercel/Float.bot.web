import React from "react";

export default function Games() {
  return (
    <section id="games" className="bg-[#202225] py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Mini-Games</h2>
          <p className="text-[#B9BBBE] max-w-2xl mx-auto">
            Keep your community engaged with these fun mini-games.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* TicTacToe Game Card */}
          <GameCard
            title="Tic Tac Toe"
            description="Challenge your friends to a classic game of Tic Tac Toe directly in your Discord server."
            command="/tictactoe @username"
            gradientFrom="from-[#5865F2]"
            gradientTo="to-[#57F287]"
            tags={["Multiplayer", "Interactive"]}
            tagColors={["bg-[#5865F2] bg-opacity-20 text-[#5865F2]", "bg-[#57F287] bg-opacity-20 text-[#57F287]"]}
          >
            <div className="text-4xl font-bold text-white mb-2">TicTacToe</div>
            <div className="grid grid-cols-3 gap-2 max-w-[150px] mx-auto">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded flex items-center justify-center text-white font-bold">X</div>
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded flex items-center justify-center text-white font-bold">O</div>
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded flex items-center justify-center text-white font-bold">X</div>
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded flex items-center justify-center text-white font-bold">X</div>
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded flex items-center justify-center text-white font-bold">O</div>
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded flex items-center justify-center text-white font-bold"></div>
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded flex items-center justify-center text-white font-bold">O</div>
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded flex items-center justify-center text-white font-bold">X</div>
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded flex items-center justify-center text-white font-bold"></div>
            </div>
          </GameCard>

          {/* Hangman Game Card */}
          <GameCard
            title="Hangman"
            description="Guess the word before you run out of attempts in this classic word-guessing game."
            command="/hangman [category]"
            gradientFrom="from-[#FEE75C]"
            gradientTo="to-[#ED4245]"
            tags={["Single-player", "Multiple Categories"]}
            tagColors={["bg-[#FEE75C] bg-opacity-20 text-[#FEE75C]", "bg-[#57F287] bg-opacity-20 text-[#57F287]"]}
          >
            <div className="text-4xl font-bold text-white mb-2">Hangman</div>
            <div className="font-mono text-white space-y-2">
              <div className="text-lg">_ _ A _ _ _ _ _</div>
              <div className="text-sm">Guessed: A, E, I, S, T</div>
              <div className="flex justify-center space-x-1 mt-2">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center text-white">
                  <span>🤔</span>
                </div>
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center text-white">
                  <span>❓</span>
                </div>
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center text-white">
                  <span>💭</span>
                </div>
              </div>
            </div>
          </GameCard>

          {/* Trivia Game Card */}
          <GameCard
            title="Trivia Quiz"
            description="Test your knowledge with trivia questions across multiple categories and difficulty levels."
            command="/quiz [category] [difficulty]"
            gradientFrom="from-[#5865F2]"
            gradientTo="to-[#ED4245]"
            tags={["Challenging", "Educational"]}
            tagColors={["bg-[#ED4245] bg-opacity-20 text-[#ED4245]", "bg-[#FEE75C] bg-opacity-20 text-[#FEE75C]"]}
          >
            <div className="text-4xl font-bold text-white mb-2">Trivia</div>
            <div className="text-white max-w-[250px] mx-auto">
              <p className="text-sm mb-2">What is the capital of France?</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white bg-opacity-20 rounded p-1">A. London</div>
                <div className="bg-white bg-opacity-20 rounded p-1">B. Berlin</div>
                <div className="bg-[#57F287] bg-opacity-40 rounded p-1">C. Paris</div>
                <div className="bg-white bg-opacity-20 rounded p-1">D. Madrid</div>
              </div>
            </div>
          </GameCard>

          {/* Wordle Game Card */}
          <GameCard
            title="Wordle"
            description="Guess the hidden five-letter word in six tries with color-coded hints for each guess."
            command="/wordle"
            gradientFrom="from-[#57F287]"
            gradientTo="to-[#FEE75C]"
            tags={["Daily Challenge", "Word Game"]}
            tagColors={["bg-[#57F287] bg-opacity-20 text-[#57F287]", "bg-[#5865F2] bg-opacity-20 text-[#5865F2]"]}
          >
            <div className="text-4xl font-bold text-white mb-2">Wordle</div>
            <div className="font-mono text-white max-w-[200px] mx-auto">
              <div className="grid grid-rows-5 gap-1">
                <div className="flex gap-1">
                  <div className="w-8 h-8 bg-[#57F287] bg-opacity-70 rounded flex items-center justify-center">S</div>
                  <div className="w-8 h-8 bg-[#FEE75C] bg-opacity-70 rounded flex items-center justify-center">T</div>
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center">A</div>
                  <div className="w-8 h-8 bg-[#57F287] bg-opacity-70 rounded flex items-center justify-center">R</div>
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center">T</div>
                </div>
                <div className="flex gap-1">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center">C</div>
                  <div className="w-8 h-8 bg-[#57F287] bg-opacity-70 rounded flex items-center justify-center">H</div>
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center">A</div>
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center">R</div>
                  <div className="w-8 h-8 bg-[#FEE75C] bg-opacity-70 rounded flex items-center justify-center">T</div>
                </div>
                <div className="flex gap-1">
                  <div className="w-8 h-8 bg-white bg-opacity-10 rounded"></div>
                  <div className="w-8 h-8 bg-white bg-opacity-10 rounded"></div>
                  <div className="w-8 h-8 bg-white bg-opacity-10 rounded"></div>
                  <div className="w-8 h-8 bg-white bg-opacity-10 rounded"></div>
                  <div className="w-8 h-8 bg-white bg-opacity-10 rounded"></div>
                </div>
              </div>
            </div>
          </GameCard>
        </div>
      </div>
    </section>
  );
}

interface GameCardProps {
  title: string;
  description: string;
  command: string;
  gradientFrom: string;
  gradientTo: string;
  tags: string[];
  tagColors: string[];
  children: React.ReactNode;
}

function GameCard({
  title,
  description,
  command,
  gradientFrom,
  gradientTo,
  tags,
  tagColors,
  children
}: GameCardProps) {
  return (
    <div className="bg-[#36393F] rounded-xl overflow-hidden shadow-xl">
      <div className={`h-52 bg-gradient-to-r ${gradientFrom} ${gradientTo} flex items-center justify-center`}>
        <div className="text-center p-6">
          {children}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-[#B9BBBE] mb-4">{description}</p>
        <div className="bg-[#2b2d31] p-2 rounded text-sm text-[#DCDDDE] font-mono mb-4">
          {command}
        </div>
        <div className="flex">
          {tags.map((tag, index) => (
            <span key={index} className={`text-xs font-medium ${index > 0 ? 'ml-2' : ''} px-2.5 py-0.5 rounded-full ${tagColors[index]}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
