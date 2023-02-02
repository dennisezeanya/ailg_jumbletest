import type { Application, Request, Response } from "express";
import express from "express";
import { RequestModel } from "./models/request";

export function newApp() {
  const app = express();
  registerMiddlewares(app);
  registerRoutes(app);

  return app;
}

function registerRoutes(app: Application) {
  app.get("/requests", async (_: Request, res: Response) => {
    try {
      const requests = await RequestModel.find(
        {},
        {},
        {
          limit: 10,
          sort: { timestamp: -1 },
        }
      );
      res.json(requests);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  });

  app.post(
    "/jumble",
    (req: Request<{}, {}, { word: string }>, res: Response) => {
      if (!req.body.word) {
        return res.status(400).json({ message: "Word is required" });
      }

      const shuffledWord = shuffle(req.body.word.trim());
      return res.json({ word: shuffledWord });
    }
  );
}

function registerMiddlewares(app: Application) {
  app.use(express.json());

  app.use(async (req: Request, res: Response, next) => {
    const apiKey = process.env.API_KEY!;
    if (req.query.api_key != apiKey && req.get("X-API-Key") != apiKey)
      return res.status(401).json({ message: "Please provide a valid API Key" });

    return next();
  });

  app.use(async (req: Request, _: Response, next) => {
    if (!req.url.includes("/requests")) {
      try {
        await RequestModel.create({
          method: req.method,
          path: req.path,
          payload: req.body,
          timestamp: new Date(),
        });
      } catch (err) {
        console.error(err);
      }
    }

    next();
  });
}

function shuffle(word: string) {
  const parts = word.split("");
  for (var i = parts.length; i > 0; ) {
    const random = Math.floor(Math.random() * i);
    const temp = parts[--i]!;
    parts[i] = parts[random]!;
    parts[random] = temp;
  }

  return parts.join("");
}
