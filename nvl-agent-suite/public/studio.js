const el = {
  status: document.getElementById("status"),
  apiKey: document.getElementById("apiKey"),
  style: document.getElementById("style"),
  direction: document.getElementById("direction"),
  code: document.getElementById("code"),
  diagnostics: document.getElementById("diagnostics"),
  novel: document.getElementById("novel"),
  compileLog: document.getElementById("compileLog"),
  runInfo: document.getElementById("runInfo"),
  architectBtn: document.getElementById("architectBtn"),
  compileBtn: document.getElementById("compileBtn"),
  novelistBtn: document.getElementById("novelistBtn"),
  pipelineBtn: document.getElementById("pipelineBtn"),
  downloadCompile: document.getElementById("downloadCompile"),
  downloadAttempts: document.getElementById("downloadAttempts")
};

let lastCompileLog = "";
let lastRunId = "";

function setStatus(text) {
  el.status.textContent = text;
}

function apiKeyValue() {
  const key = el.apiKey.value.trim();
  return key || undefined;
}

function summarizeDiagnostics(diagnostics) {
  if (!diagnostics || diagnostics.length === 0) return "No diagnostics.";
  return diagnostics
    .map((d) => `[${String(d.level).toUpperCase()}] line=${d.line} ${d.code} :: ${d.message}`)
    .join("\n");
}

async function postJson(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
  return json;
}

el.architectBtn.addEventListener("click", async () => {
  setStatus("Architecting...");
  try {
    const out = await postJson("/api/architect", {
      direction: el.direction.value,
      apiKey: apiKeyValue()
    });
    el.code.value = out.dsl || "";
    el.diagnostics.textContent = `Architect provider=${out.provider} model=${out.model}\nnotes=${(out.notes || []).join(" | ")}`;
    setStatus("Architect done");
  } catch (error) {
    setStatus("Architect failed");
    el.diagnostics.textContent = String(error.message || error);
  }
});

el.compileBtn.addEventListener("click", async () => {
  setStatus("Compiling...");
  try {
    const out = await postJson("/api/compile", {
      source: el.code.value
    });
    lastCompileLog = out.logText || "";
    el.compileLog.textContent = lastCompileLog || "No compile log.";
    el.diagnostics.textContent = summarizeDiagnostics(out.diagnostics);
    setStatus(out.success ? "Compile success" : "Compile failed");
  } catch (error) {
    setStatus("Compile failed");
    el.diagnostics.textContent = String(error.message || error);
  }
});

el.novelistBtn.addEventListener("click", async () => {
  setStatus("Rendering...");
  try {
    const out = await postJson("/api/novelist", {
      direction: el.direction.value,
      style: el.style.value,
      logText: lastCompileLog,
      apiKey: apiKeyValue()
    });
    el.novel.value = out.text || "";
    setStatus("Render done");
  } catch (error) {
    setStatus("Render failed");
    el.novel.value = String(error.message || error);
  }
});

el.pipelineBtn.addEventListener("click", async () => {
  setStatus("Running pipeline...");
  try {
    const out = await postJson("/api/pipeline", {
      direction: el.direction.value,
      style: el.style.value,
      apiKey: apiKeyValue()
    });

    el.code.value = out.finalCode || "";
    el.diagnostics.textContent = summarizeDiagnostics(out.compile?.diagnostics || []);
    el.compileLog.textContent = out.compile?.logText || "";
    lastCompileLog = out.compile?.logText || "";
    el.novel.value = out.novelText || "";

    lastRunId = out.runId || "";
    el.runInfo.textContent = `runId=${lastRunId} attempts=${out.attempts} success=${out.success}`;

    el.downloadCompile.disabled = !lastRunId;
    el.downloadAttempts.disabled = !lastRunId;

    setStatus(out.success ? "Pipeline success" : "Pipeline failed");
  } catch (error) {
    setStatus("Pipeline failed");
    el.runInfo.textContent = String(error.message || error);
  }
});

el.downloadCompile.addEventListener("click", () => {
  if (!lastRunId) return;
  window.open(`/api/runs/${lastRunId}/files/compile-log.txt`, "_blank");
});

el.downloadAttempts.addEventListener("click", () => {
  if (!lastRunId) return;
  window.open(`/api/runs/${lastRunId}/files/architect-attempts.log`, "_blank");
});
