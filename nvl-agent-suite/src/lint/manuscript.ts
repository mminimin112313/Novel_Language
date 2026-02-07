import type { EpisodePack } from "../episode/index.js";

export type ManuscriptIssue = {
  level: "error" | "warning";
  code: string;
  message: string;
};

export type ManuscriptLintResult = {
  ok: boolean;
  stats: {
    chars: number;
    paragraphs: number;
    citations: number;
  };
  issues: ManuscriptIssue[];
};

export function lintManuscript(pack: EpisodePack, manuscriptRaw: string): ManuscriptLintResult {
  const issues: ManuscriptIssue[] = [];
  const manuscript = manuscriptRaw.replace(/\r\n/g, "\n");
  const trimmed = manuscript.trim();

  const chars = trimmed.length;
  const paragraphs = trimmed ? trimmed.split(/\n\s*\n/g).map((p) => p.trim()).filter(Boolean) : [];

  const allowedEventIds = new Set(pack.events.map((e) => e.globalIndex));
  const citeEvents = Boolean(pack.spec.requirements.citeEvents);

  const citationRegex = /\[\[EVT:(\d{1,5})\]\]/g;
  const cited: number[] = [];
  for (const match of trimmed.matchAll(citationRegex)) {
    const rawId = match[1];
    if (!rawId) continue;
    const id = Number(rawId);
    if (!Number.isFinite(id)) continue;
    cited.push(id);
    if (!allowedEventIds.has(id)) {
      issues.push({
        level: "error",
        code: "E_CITATION_UNKNOWN",
        message: `Unknown event citation [[EVT:${rawId}]] (not in selected episode events).`
      });
    }
  }

  if (citeEvents) {
    if (paragraphs.length === 0) {
      issues.push({
        level: "error",
        code: "E_EMPTY_MANUSCRIPT",
        message: "Manuscript is empty."
      });
    } else {
      for (const [idx, para] of paragraphs.entries()) {
        const hasCitation = citationRegex.test(para);
        citationRegex.lastIndex = 0;
        if (!hasCitation) {
          issues.push({
            level: "error",
            code: "E_CITATION_MISSING",
            message: `Paragraph ${idx + 1} is missing an [[EVT:###]] citation.`
          });
        }
      }
    }
  }

  const req = pack.spec.requirements;

  if (req.minChars && chars < req.minChars) {
    issues.push({
      level: "warning",
      code: "W_LENGTH_SHORT",
      message: `Manuscript is shorter than minChars (${chars} < ${req.minChars}).`
    });
  }
  if (req.maxChars && chars > req.maxChars) {
    issues.push({
      level: "warning",
      code: "W_LENGTH_LONG",
      message: `Manuscript is longer than maxChars (${chars} > ${req.maxChars}).`
    });
  }

  if (req.targetChars) {
    const delta = Math.abs(chars - req.targetChars);
    const ratio = req.targetChars === 0 ? 0 : delta / req.targetChars;
    if (ratio > 0.35) {
      issues.push({
        level: "warning",
        code: "W_LENGTH_OFF_TARGET",
        message: `Manuscript deviates from targetChars (${chars} vs ${req.targetChars}).`
      });
    }
  }

  if (req.bannedPhrases) {
    for (const phrase of req.bannedPhrases) {
      const count = countOccurrences(trimmed, phrase);
      if (count > 0) {
        issues.push({
          level: "warning",
          code: "W_BANNED_PHRASE",
          message: `Banned phrase '${phrase}' appears ${count} time(s).`
        });
      }
    }
  }

  if (req.requiredMotifs) {
    for (const motif of req.requiredMotifs) {
      if (!trimmed.includes(motif)) {
        issues.push({
          level: "warning",
          code: "W_MOTIF_MISSING",
          message: `Required motif '${motif}' is missing.`
        });
      }
    }
  }

  if (/ {2,}/.test(trimmed)) {
    issues.push({
      level: "warning",
      code: "W_DOUBLE_SPACE",
      message: "Found consecutive spaces."
    });
  }

  if (/\.{4,}|!{3,}|\?{3,}/.test(trimmed)) {
    issues.push({
      level: "warning",
      code: "W_PUNCTUATION_EXCESS",
      message: "Found excessive repeated punctuation."
    });
  }

  if (/\b(TODO|TBD)\b/i.test(trimmed) || /\[\s*\.\.\.\s*\]/.test(trimmed)) {
    issues.push({
      level: "warning",
      code: "W_PLACEHOLDER",
      message: "Found placeholder text (TODO/TBD/[...])."
    });
  }

  const ok = issues.every((i) => i.level !== "error");
  return {
    ok,
    stats: {
      chars,
      paragraphs: paragraphs.length,
      citations: cited.length
    },
    issues
  };
}

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  let idx = 0;
  let count = 0;
  while (true) {
    idx = haystack.indexOf(needle, idx);
    if (idx === -1) break;
    count += 1;
    idx += Math.max(1, needle.length);
  }
  return count;
}

