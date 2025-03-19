import React, { useState } from "react";
import { 
  utilityCommands,
  funCommands,
  gameCommands,
  moderationCommands,
  miscCommands 
} from "@/lib/data";

type TabType = 'utility' | 'fun' | 'games' | 'moderation' | 'misc';

export default function Commands() {
  const [activeTab, setActiveTab] = useState<TabType>('utility');

  return (
    <section id="commands" className="bg-[#36393F] py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Command Categories</h2>
          <p className="text-[#B9BBBE] max-w-2xl mx-auto">
            Explore the wide range of commands available with Float.
          </p>
        </div>

        {/* Command Tabs */}
        <div className="border-b border-gray-700 mb-8">
          <div className="flex flex-wrap -mb-px">
            <TabButton
              active={activeTab === 'utility'}
              onClick={() => setActiveTab('utility')}
              label="Utility"
            />
            <TabButton
              active={activeTab === 'fun'}
              onClick={() => setActiveTab('fun')}
              label="Fun"
            />
            <TabButton
              active={activeTab === 'games'}
              onClick={() => setActiveTab('games')}
              label="Games"
            />
            <TabButton
              active={activeTab === 'moderation'}
              onClick={() => setActiveTab('moderation')}
              label="Moderation"
            />
            <TabButton
              active={activeTab === 'misc'}
              onClick={() => setActiveTab('misc')}
              label="Miscellaneous"
            />
          </div>
        </div>

        {/* Command Content */}
        <div className={activeTab === 'utility' ? 'block' : 'hidden'}>
          <CommandGrid commands={utilityCommands} color="bg-[#5865F2]" />
        </div>
        <div className={activeTab === 'fun' ? 'block' : 'hidden'}>
          <CommandGrid commands={funCommands} color="bg-[#57F287]" />
        </div>
        <div className={activeTab === 'games' ? 'block' : 'hidden'}>
          <CommandGrid commands={gameCommands} color="bg-[#FEE75C]" />
        </div>
        <div className={activeTab === 'moderation' ? 'block' : 'hidden'}>
          <CommandGrid commands={moderationCommands} color="bg-[#ED4245]" />
        </div>
        <div className={activeTab === 'misc' ? 'block' : 'hidden'}>
          <CommandGrid commands={miscCommands} color="bg-[#DCDDDE]" textColor="text-[#202225]" />
        </div>
      </div>
    </section>
  );
}

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

function TabButton({ active, onClick, label }: TabButtonProps) {
  return (
    <button
      className={`px-6 py-3 text-sm font-medium ${
        active 
          ? 'border-b-3 border-[#5865F2] text-white' 
          : 'text-[#B9BBBE] hover:text-white'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

interface Command {
  name: string;
  description: string;
  usage: string;
}

interface CommandGridProps {
  commands: Command[];
  color: string;
  textColor?: string;
}

function CommandGrid({ commands, color, textColor = "text-white" }: CommandGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {commands.map((command, index) => (
        <div 
          key={index} 
          className="bg-[#202225] rounded-lg p-5 border border-gray-700 hover:border-[#5865F2] transition-colors"
        >
          <div className="flex items-start mb-3">
            <span className={`${color} ${textColor} text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center`}>
              /{command.name}
            </span>
          </div>
          <p className="text-[#B9BBBE] text-sm mb-3">{command.description}</p>
          <div className="bg-[#2b2d31] p-2 rounded text-xs text-[#DCDDDE] font-mono">
            {command.usage}
          </div>
        </div>
      ))}
    </div>
  );
}
