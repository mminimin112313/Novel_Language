import { mockArchitect } from "./mock.js";
import type { ArchitectDraftRequest, ArchitectOutput, ArchitectRepairRequest } from "./types.js";

export async function generateArchitectDraft(req: ArchitectDraftRequest): Promise<ArchitectOutput> {
  return mockArchitect(req.direction);
}

export async function repairArchitectCode(req: ArchitectRepairRequest): Promise<ArchitectOutput> {
  return {
    ...mockArchitect(req.direction),
    dsl: req.previousCode,
    notes: ["repair fallback returned previous code"]
  };
}

