import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { loadManifest } from "../lib/manifest";
import { Manifest } from "../types/kit";
import { colors, radii, spacing } from "../lib/theme";

type ManifestPickerProps = {
  manifest: Manifest | null;
  onManifestLoaded: (manifest: Manifest) => void;
  onError?: (message: string | null) => void;
};

export function ManifestPicker({
  manifest,
  onManifestLoaded,
  onError,
}: ManifestPickerProps) {
  const [localError, setLocalError] = useState<string | null>(null);

  const handlePickManifest = async () => {
    setLocalError(null);
    onError?.(null);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: false,
        type: ["application/json", "text/json", "public.json"],
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];
      const nextManifest = await loadManifest(asset.uri);

      onManifestLoaded(nextManifest);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We could not read that manifest file.";

      setLocalError(message);
      onError?.(message);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={handlePickManifest}
        style={({ pressed }) => [
          styles.trigger,
          pressed && styles.triggerPressed,
        ]}
      >
        <Text style={styles.triggerLabel}>
          {manifest ? "Replace Manifest JSON" : "Upload Manifest"}
        </Text>
      </Pressable>

      <Text style={styles.helper}>JSON only. Expected keys: kit_name, version, components.</Text>

      {localError ? <Text style={styles.errorText}>{localError}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  trigger: {
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.full,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
  },
  triggerPressed: {
    opacity: 0.9,
  },
  triggerLabel: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "700",
  },
  helper: {
    color: colors.textMuted,
    fontSize: 13,
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 13,
  },
});
