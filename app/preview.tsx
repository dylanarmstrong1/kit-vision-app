import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { verifyKit } from "../lib/api";
import { useKitSession } from "../lib/session";
import { colors, radii, shadows, spacing } from "../lib/theme";

export default function PreviewScreen() {
  const router = useRouter();
  const {
    selectedImageUri,
    activeManifest,
    manifest,
    setReport,
    errorMessage,
    setErrorMessage,
  } = useKitSession();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!selectedImageUri) {
      router.replace("/");
    }
  }, [router, selectedImageUri]);

  const handleVerify = async () => {
    if (!selectedImageUri) {
      setErrorMessage("Select a photo before running verification.");
      router.replace("/");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const report = await verifyKit(selectedImageUri, activeManifest);
      setReport(report);
      router.push("/results");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Verification failed. Check the backend connection and try again.";
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!selectedImageUri) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.imageFrame}>
          <Image source={{ uri: selectedImageUri }} style={styles.image} />
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Active manifest</Text>
          <Text style={styles.summaryTitle}>
            {manifest ? manifest.kit_name : "Using default manifest"}
          </Text>
          <Text style={styles.summaryText}>
            Version {activeManifest.version} ·{" "}
            {Object.keys(activeManifest.components).length} expected components
          </Text>
        </View>

        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderTitle}>Ready to submit</Text>
          <Text style={styles.placeholderText}>
            We’ll send the selected image and manifest to the `/verify` endpoint on
            your configured backend as multipart form data.
          </Text>
        </View>

        {errorMessage ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Verification error</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <Pressable
          disabled={submitting}
          onPress={handleVerify}
          style={({ pressed }) => [
            styles.submitButton,
            pressed && styles.submitButtonPressed,
            submitting && styles.submitButtonDisabled,
          ]}
        >
          {submitting ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={colors.textInverse} />
              <Text style={styles.submitLabel}>Verifying kit...</Text>
            </View>
          ) : (
            <Text style={styles.submitLabel}>Verify Kit</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    gap: spacing.lg,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  imageFrame: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    overflow: "hidden",
    ...shadows.card,
  },
  image: {
    aspectRatio: 4 / 5,
    backgroundColor: colors.surfaceAlt,
    width: "100%",
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.lg,
  },
  summaryLabel: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  summaryTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "800",
  },
  summaryText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  placeholderCard: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  placeholderTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  placeholderText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  errorCard: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  errorTitle: {
    color: "#991B1B",
    fontSize: 15,
    fontWeight: "700",
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 14,
    lineHeight: 20,
  },
  submitButton: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: radii.lg,
    justifyContent: "center",
    minHeight: 58,
    paddingHorizontal: spacing.lg,
    ...shadows.card,
  },
  submitButtonPressed: {
    opacity: 0.94,
  },
  submitButtonDisabled: {
    opacity: 0.8,
  },
  submitLabel: {
    color: colors.textInverse,
    fontSize: 17,
    fontWeight: "700",
  },
  loadingRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
});
