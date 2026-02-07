export type ParsedLine = {
  line: number;
  raw: string;
  command: string;
  args: string[];
};

export function normalizeSource(source: string): string {
  return source.replace(/\r\n/g, "\n").trim();
}

export function parseScript(source: string): ParsedLine[] {
  const normalized = normalizeSource(source);
  const lines = normalized.split("\n");
  const parsed: ParsedLine[] = [];

  for (let idx = 0; idx < lines.length; idx += 1) {
    const rawLine = lines[idx];
    const trimmed = rawLine.trim();
    const lineNumber = idx + 1;

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const parts = tokenize(trimmed);
    if (parts.length === 0) {
      continue;
    }

    const command = parts[0].toUpperCase();
    parsed.push({
      line: lineNumber,
      raw: trimmed,
      command,
      args: parts.slice(1)
    });
  }

  return parsed;
}

export function tokenize(line: string): string[] {
  const tokens = line.match(/"(?:[^"\\]|\\.)*"|\S+/g) ?? [];
  return tokens.map(unquote);
}

function unquote(token: string): string {
  if (token.startsWith('"') && token.endsWith('"')) {
    return token.slice(1, -1).replace(/\\"/g, '"');
  }
  return token;
}

export function parseKeyValueArgs(args: string[]): Record<string, string> {
  const record: Record<string, string> = {};
  for (const arg of args) {
    const eqIndex = arg.indexOf("=");
    if (eqIndex === -1) {
      continue;
    }
    const key = arg.slice(0, eqIndex).trim();
    const value = arg.slice(eqIndex + 1).trim();
    if (key) {
      record[key] = value;
    }
  }
  return record;
}
