import { aj } from "../lib/arcjet.js";
import { isSpoofedBot } from "@arcjet/inspect";

const rateLimitingAndBotProtection = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, { requested: 1 }); //each request consumes 1 token

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too Many Requests" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "No bots allowed" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
    } else if (decision.results.some(isSpoofedBot)) {
      res.status(403).json({ error: "Forbidden" });
    } else {
      next();
    }
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

export default rateLimitingAndBotProtection;
