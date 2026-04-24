import * as FileSystem from "expo-file-system/legacy";

import { Manifest } from "../types/kit";

export const DEFAULT_MANIFEST: Manifest = {
  kit_name: "Fishing Kit - POC",
  version: "1.0",
  components: {
    hook_worm: 1,
    hook_weedless: 1,
    hook_worm_large: 1,
    worm_wacky: 1,
    worm_texas: 1,
    weight: 1,
    crankbait_red: 1,
    crankbait_natural: 1,
    craw: 1,
  },
};

export async function loadManifest(uri: string): Promise<Manifest> {
  const raw = await FileSystem.readAsStringAsync(uri);
  const parsed = JSON.parse(raw) as unknown;

  if (!isManifest(parsed)) {
    throw new Error(
      "Manifest JSON is invalid. Expected { kit_name, version, components: Record<string, number> }.",
    );
  }

  return parsed;
}

export function isManifest(value: unknown): value is Manifest {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  if (
    typeof candidate.kit_name !== "string" ||
    typeof candidate.version !== "string" ||
    !candidate.components ||
    typeof candidate.components !== "object" ||
    Array.isArray(candidate.components)
  ) {
    return false;
  }

  return Object.values(candidate.components).every(
    (count) => typeof count === "number" && Number.isFinite(count) && count >= 0,
  );
}
