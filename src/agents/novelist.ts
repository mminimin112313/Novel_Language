import { mockNovelist } from "./mock.js";
import type { NovelistOutput, NovelistRequest } from "./types.js";

export async function writeNovel(req: NovelistRequest): Promise<NovelistOutput> {
  return mockNovelist(req.logText);
}

