import { VerificationReport } from "../types/kit";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export async function verifyKit(
  imageUri: string,
  manifest?: object,
): Promise<VerificationReport> {
  if (!API_URL) {
    throw new Error(
      "Missing EXPO_PUBLIC_API_URL. Add it to your local .env before calling the backend.",
    );
  }

  const formData = new FormData();
  const extension = imageUri.split(".").pop()?.toLowerCase() ?? "jpg";
  const mimeType =
    extension === "png"
      ? "image/png"
      : extension === "heic"
        ? "image/heic"
        : "image/jpeg";

  formData.append(
    "image",
    {
      uri: imageUri,
      name: `kit-photo.${extension}`,
      type: mimeType,
    } as unknown as Blob,
  );

  if (manifest) {
    formData.append("manifest", JSON.stringify(manifest));
  }

  const response = await fetch(`${API_URL.replace(/\/$/, "")}/verify`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Verification request failed with ${response.status}.`);
  }

  const payload = (await response.json()) as Partial<VerificationReport>;

  return {
    passed: Boolean(payload.passed),
    correct: payload.correct ?? {},
    missing: payload.missing ?? {},
    unexpected: payload.unexpected ?? {},
    wrong_quantity: payload.wrong_quantity ?? {},
    needs_review: payload.needs_review ?? [],
  };
}
