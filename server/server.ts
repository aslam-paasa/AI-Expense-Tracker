import express from "express";
import cors from "cors";
import { agent } from "./agent.ts";
import type { StreamMessage } from "./types.ts";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "OK" });
});

/* SSE: Server Sent Event Protocol */
app.post("/chat", async (req, res) => {
  const { query } = req.body;

  /* 1. add special header */
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
  });

  /* 2. Send data to LLM */
  const response = await agent.stream(
    {
      messages: [
        {
          role: "user",
          content: query,
        },
      ],
    },
    {
      streamMode: ["messages"],
      // todo: generate dynamically
      configurable: { thread_id: "1" },
    },
  );

  for await (const [eventType, chunk] of response) {
    console.log("eventType", eventType);
    console.log("Chunk", JSON.stringify(chunk[0].content, null, 2));

    const messageType = chunk[0].type;
    let message: StreamMessage = {} as StreamMessage;

    if (messageType == "ai") {
      message = {
        type: "ai",
        payload: { text: chunk[0].content as string },
      };
    }

    res.write(`event: ${eventType}\n`);
    res.write(`data: ${JSON.stringify(message)}\n`);
    res.end();
  }
});

const PORT = process.env.PORT || 4100;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
