import express from "express";
import cors from "cors";
import fs from "node:fs/promises";
import path from "node:path";
import { compileNVL } from "../compiler/index.js";
import { runPipeline } from "../orchestrator/pipeline.js";
import { RUNS_DIR } from "../config.js";
import { generateArchitectDraft } from "../agents/architect.js";
import { writeNovel } from "../agents/novelist.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "4mb" }));
app.use(express.static(path.join(process.cwd(), "public")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, now: new Date().toISOString() });
});

app.post("/api/compile", (req, res) => {
  const source = String(req.body?.source ?? "");
  const result = compileNVL(source);
  res.json(result);
});

app.post("/api/architect", async (req, res) => {
  try {
    const direction = String(req.body?.direction ?? "").trim();

    if (!direction) {
      res.status(400).json({ error: "direction is required" });
      return;
    }

    const draft = await generateArchitectDraft({ direction });
    res.json(draft);
  } catch (error) {
    const message = error instanceof Error ? error.message : "architect error";
    res.status(500).json({ error: message });
  }
});

app.post("/api/novelist", async (req, res) => {
  try {
    const direction = String(req.body?.direction ?? "").trim();
    const style = String(req.body?.style ?? "Cinematic").trim();
    const logText = String(req.body?.logText ?? "");

    if (!logText) {
      res.status(400).json({ error: "logText is required" });
      return;
    }

    const output = await writeNovel({ direction, style, logText });
    res.json(output);
  } catch (error) {
    const message = error instanceof Error ? error.message : "novelist error";
    res.status(500).json({ error: message });
  }
});

app.post("/api/pipeline", async (req, res) => {
  try {
    const direction = String(req.body?.direction ?? "").trim();
    const style = String(req.body?.style ?? "Cinematic").trim();

    if (!direction) {
      res.status(400).json({ error: "direction is required" });
      return;
    }

    const output = await runPipeline({
      direction,
      style
    });

    res.json(output);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown pipeline error";
    res.status(500).json({ error: message });
  }
});

app.get("/api/runs/:runId/files/:fileName", async (req, res) => {
  try {
    const runId = req.params.runId;
    const fileName = req.params.fileName;
    if (!/^[a-zA-Z0-9_-]+$/.test(runId)) {
      res.status(400).send("invalid run id");
      return;
    }
    if (!/^[a-zA-Z0-9._-]+$/.test(fileName)) {
      res.status(400).send("invalid file name");
      return;
    }

    const filePath = path.join(RUNS_DIR, runId, fileName);
    const content = await fs.readFile(filePath, "utf8");
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send(content);
  } catch {
    res.status(404).send("file not found");
  }
});

app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

const port = Number(process.env.PORT ?? 4310);
app.listen(port, () => {
  // Keep stdout clean if process is used as sub-tool in other systems.
  process.stderr.write(`[nvl-agent-suite] listening on http://localhost:${port}\n`);
});
