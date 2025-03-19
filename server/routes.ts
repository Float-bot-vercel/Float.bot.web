import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple API endpoint to get bot information
  app.get("/api/bot-info", (_req, res) => {
    const botInfo = {
      name: "Float",
      description: "The ultimate utility Discord bot with games, helpful commands, and everything you need to keep your server engaged.",
      commands: {
        count: 30,
        categories: [
          "Utility",
          "Fun",
          "Games",
          "Moderation",
          "Miscellaneous"
        ]
      },
      features: [
        "Command Panel",
        "Utility Commands",
        "Fun Mini-Games",
        "Interactive Chat",
        "Customizable Settings",
        "Server Management"
      ],
      tags: ["utility", "games", "fun", "moderation"]
    };
    
    res.json(botInfo);
  });

  const httpServer = createServer(app);

  return httpServer;
}
