import React from "react";

// Feature Icons as plain objects for simplicity
const commandPanelIconProps = {
  color: "#5865F2",
  label: "Command Panel icon"
};

const utilityCommandsIconProps = {
  color: "#57F287",
  label: "Utility Commands icon"
};

const miniGamesIconProps = {
  color: "#FEE75C",
  label: "Mini Games icon"
};

const interactiveChatIconProps = {
  color: "#ED4245",
  label: "Interactive Chat icon"
};

const customizableSettingsIconProps = {
  color: "#5865F2",
  label: "Customizable Settings icon"
};

const serverManagementIconProps = {
  color: "#57F287",
  label: "Server Management icon"
};

// Features Data
export const features = [
  {
    title: "Command Panel",
    description: "Easily access all commands through an intuitive panel interface.",
    iconColor: commandPanelIconProps.color,
    bgColor: "bg-[#5865F2] bg-opacity-20",
  },
  {
    title: "Utility Commands",
    description: "Helpful utility commands to manage your server efficiently.",
    iconColor: utilityCommandsIconProps.color,
    bgColor: "bg-[#57F287] bg-opacity-20",
  },
  {
    title: "Fun Mini-Games",
    description: "Engage your community with various mini-games and activities.",
    iconColor: miniGamesIconProps.color,
    bgColor: "bg-[#FEE75C] bg-opacity-20",
  },
  {
    title: "Interactive Chat",
    description: "Chat with the bot using natural language for a more interactive experience.",
    iconColor: interactiveChatIconProps.color,
    bgColor: "bg-[#ED4245] bg-opacity-20",
  },
  {
    title: "Customizable Settings",
    description: "Tailor the bot's behavior to match your server's unique needs.",
    iconColor: customizableSettingsIconProps.color,
    bgColor: "bg-[#5865F2] bg-opacity-20",
  },
  {
    title: "Server Management",
    description: "Powerful tools to manage members, roles, and server analytics.",
    iconColor: serverManagementIconProps.color,
    bgColor: "bg-[#57F287] bg-opacity-20",
  },
];

// Commands Data
export const utilityCommands = [
  {
    name: "help",
    description: "Displays a list of all available commands or information about a specific command.",
    usage: "/help [command:optional]",
  },
  {
    name: "panel",
    description: "Opens the command panel with clickable buttons for all commands.",
    usage: "/panel",
  },
  {
    name: "invites",
    description: "Tracks and displays server invite statistics.",
    usage: "/invites [user:optional]",
  },
  {
    name: "messages",
    description: "Shows message statistics for users in the server.",
    usage: "/messages [user:optional]",
  },
  {
    name: "serverinfo",
    description: "Displays detailed information about the server.",
    usage: "/serverinfo",
  },
  {
    name: "userinfo",
    description: "Shows detailed information about a user.",
    usage: "/userinfo [user:optional]",
  },
];

export const funCommands = [
  {
    name: "8ball",
    description: "Ask the magic 8-ball a question and receive a random answer.",
    usage: "/8ball [question:required]",
  },
  {
    name: "meme",
    description: "Displays a random meme from popular subreddits.",
    usage: "/meme [category:optional]",
  },
  {
    name: "joke",
    description: "Tells a random joke to lighten the mood.",
    usage: "/joke [category:optional]",
  },
  {
    name: "fact",
    description: "Shares a random interesting fact.",
    usage: "/fact [category:optional]",
  },
  {
    name: "quote",
    description: "Shares an inspirational or funny quote.",
    usage: "/quote [category:optional]",
  },
  {
    name: "emojify",
    description: "Converts your text into emoji characters.",
    usage: "/emojify [text:required]",
  },
];

export const gameCommands = [
  {
    name: "tictactoe",
    description: "Play a game of Tic Tac Toe with another member.",
    usage: "/tictactoe [opponent:required]",
  },
  {
    name: "rps",
    description: "Play Rock, Paper, Scissors against the bot or another user.",
    usage: "/rps [opponent:optional] [choice:required]",
  },
  {
    name: "hangman",
    description: "Play a game of Hangman with customizable word categories.",
    usage: "/hangman [category:optional]",
  },
  {
    name: "quiz",
    description: "Start a trivia quiz with various categories and difficulties.",
    usage: "/quiz [category:optional] [difficulty:optional]",
  },
  {
    name: "wordle",
    description: "Play a game of Wordle right in your Discord server.",
    usage: "/wordle",
  },
  {
    name: "akinator",
    description: "Play with Akinator who will guess what character you're thinking of.",
    usage: "/akinator [category:optional]",
  },
];

export const moderationCommands = [
  {
    name: "ban",
    description: "Bans a user from the server with an optional reason.",
    usage: "/ban [user:required] [reason:optional] [delete_days:optional]",
  },
  {
    name: "kick",
    description: "Kicks a user from the server with an optional reason.",
    usage: "/kick [user:required] [reason:optional]",
  },
  {
    name: "mute",
    description: "Temporarily mutes a user for a specified duration.",
    usage: "/mute [user:required] [duration:required] [reason:optional]",
  },
  {
    name: "warn",
    description: "Issues a warning to a user and logs it.",
    usage: "/warn [user:required] [reason:required]",
  },
  {
    name: "clear",
    description: "Deletes a specified number of messages from a channel.",
    usage: "/clear [amount:required] [user:optional]",
  },
  {
    name: "slowmode",
    description: "Sets a slowmode cooldown in the current channel.",
    usage: "/slowmode [seconds:required]",
  },
];

export const miscCommands = [
  {
    name: "avatar",
    description: "Displays a user's avatar in full size.",
    usage: "/avatar [user:optional]",
  },
  {
    name: "weather",
    description: "Shows current weather information for a location.",
    usage: "/weather [location:required]",
  },
  {
    name: "translate",
    description: "Translates text to a specified language.",
    usage: "/translate [text:required] [language:required]",
  },
  {
    name: "poll",
    description: "Creates a poll with up to 10 options for members to vote on.",
    usage: "/poll [question:required] [options:required]",
  },
  {
    name: "reminder",
    description: "Sets a reminder for a specified time.",
    usage: "/reminder [time:required] [message:required]",
  },
  {
    name: "urban",
    description: "Looks up a term in the Urban Dictionary.",
    usage: "/urban [term:required]",
  },
];

// FAQ Data
export const faqs = [
  {
    question: "How do I add Float to my server?",
    answer: "Click the \"Add to Discord\" button at the top of this page, which will redirect you to Discord's authorization page. Select your server from the dropdown menu and authorize the bot with the requested permissions.",
  },
  {
    question: "What permissions does Float need?",
    answer: "Float requires basic permissions such as reading messages, sending messages, embedding links, and attaching files to function properly. Additional permissions may be required for moderation commands like ban, kick, and message deletion.",
  },
  {
    question: "Is Float free to use?",
    answer: "Yes, Float is completely free to use with all its core features. We may add premium features in the future, but the current functionality will always remain free.",
  },
  {
    question: "How can I get help if I encounter issues?",
    answer: "You can use the /help command for general assistance, join our support server for direct help, or check our documentation for detailed information about commands and features.",
  },
  {
    question: "Can I customize Float's prefix?",
    answer: "Float uses slash commands, which don't require a prefix. This makes it easier to use and avoids conflicts with other bots. All commands start with the \"/\" symbol.",
  },
];
