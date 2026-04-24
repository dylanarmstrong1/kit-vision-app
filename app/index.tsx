import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ManifestPicker } from "../components/ManifestPicker";
import { useKitSession } from "../lib/session";
import { colors, radii, shadows, spacing } from "../lib/theme";

export default function HomeScreen() {
  const router = useRouter();
  const {
    manifest,
    setManifest,
    setSelectedImageUri,
    clearVerification,
    clearError,
    errorMessage,
    setErrorMessage,
    activeManifest,
  } = useKitSession();
  const [busyAction, setBusyAction] = useState<"camera" | "library" | null>(null);

  const componentCount = Object.keys((manifest ?? activeManifest).components).length;

  const handleImageResult = async (
    action: "camera" | "library",
    picker: () => Promise<ImagePicker.ImagePickerResult>,
  ) => {
    setBusyAction(action);
    clearError();
    clearVerification();

    try {
      const result = await picker();

      if (result.canceled) {
        return;
      }

      const asset = result.assets[0];
      setSelectedImageUri(asset.uri);
      router.push("/preview");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "We could not open that image.";
      setErrorMessage(message);
    } finally {
      setBusyAction(null);
    }
  };

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      setErrorMessage("Camera permission is required to take a photo.");
      return;
    }

    await handleImageResult("camera", () =>
      ImagePicker.launchCameraAsync({
        allowsEditing: false,
        mediaTypes: ["images"],
        quality: 1,
      }),
    );
  };

  const openLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      setErrorMessage("Photo library permission is required to choose an image.");
      return;
    }

    await handleImageResult("library", () =>
      ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        mediaTypes: ["images"],
        quality: 1,
      }),
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.eyebrow}>Warehouse companion app</Text>
          <Text style={styles.title}>Verify a fishing kit from one photo.</Text>
          <Text style={styles.subtitle}>
            Capture the laid-out kit, attach a manifest if needed, and send it to
            your YOLOv8 backend for a pass or fail report.
          </Text>
        </View>

        <View style={styles.actionGroup}>
          <ActionButton
            label="Take Photo"
            helper="Open the device camera"
            loading={busyAction === "camera"}
            onPress={openCamera}
          />
          <ActionButton
            label="Choose from Library"
            helper="Use an existing kit photo"
            loading={busyAction === "library"}
            onPress={openLibrary}
            secondary
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Manifest</Text>
          <ManifestPicker
            manifest={manifest}
            onManifestLoaded={setManifest}
            onError={setErrorMessage}
          />

          {manifest ? (
            <View style={styles.previewCard}>
              <Text style={styles.previewTitle}>{manifest.kit_name}</Text>
              <Text style={styles.previewMeta}>
                Version {manifest.version} · {componentCount} components
              </Text>
            </View>
          ) : (
            <View style={styles.placeholderCard}>
              <Text style={styles.placeholderTitle}>Using baked-in default manifest</Text>
              <Text style={styles.placeholderText}>
                Fishing Kit - POC · {componentCount} components. Upload a JSON file to
                override it for this verification run.
              </Text>
            </View>
          )}
        </View>

        {errorMessage ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Something needs attention</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderTitle}>How it works</Text>
          <Text style={styles.placeholderText}>
            Start from the camera or photo library, then review the image and send it
            to the verification backend. Results are grouped into confirmed, missing,
            unexpected, wrong quantity, and needs review.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type ActionButtonProps = {
  label: string;
  helper: string;
  loading?: boolean;
  onPress: () => void;
  secondary?: boolean;
};

function ActionButton({
  label,
  helper,
  loading = false,
  onPress,
  secondary = false,
}: ActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        styles.actionButton,
        secondary ? styles.actionButtonSecondary : styles.actionButtonPrimary,
        pressed && styles.actionButtonPressed,
        loading && styles.actionButtonDisabled,
      ]}
    >
      <View style={styles.actionCopy}>
        <Text
          style={[
            styles.actionLabel,
            secondary && styles.actionLabelSecondary,
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.actionHelper,
            secondary && styles.actionHelperSecondary,
          ]}
        >
          {helper}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator color={secondary ? colors.textPrimary : colors.textInverse} />
      ) : (
        <Text
          style={[
            styles.actionArrow,
            secondary && styles.actionArrowSecondary,
          ]}
        >
          →
        </Text>
      )}
    </Pressable>
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
  heroCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.xl,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
    ...shadows.card,
  },
  eyebrow: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  title: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: "800",
    lineHeight: 36,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24,
  },
  actionGroup: {
    gap: spacing.md,
  },
  actionButton: {
    alignItems: "center",
    borderRadius: radii.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  actionButtonPrimary: {
    backgroundColor: colors.accent,
  },
  actionButtonSecondary: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
  },
  actionButtonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
  actionButtonDisabled: {
    opacity: 0.75,
  },
  actionCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  actionLabel: {
    color: colors.textInverse,
    fontSize: 18,
    fontWeight: "700",
  },
  actionLabelSecondary: {
    color: colors.textPrimary,
  },
  actionHelper: {
    color: colors.textInverseMuted,
    fontSize: 14,
  },
  actionHelperSecondary: {
    color: colors.textMuted,
  },
  actionArrow: {
    color: colors.textInverse,
    fontSize: 26,
    fontWeight: "700",
    marginLeft: spacing.md,
  },
  actionArrowSecondary: {
    color: colors.textPrimary,
  },
  section: {
    gap: spacing.sm,
  },
  sectionLabel: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  previewCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  previewTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  previewMeta: {
    color: colors.textMuted,
    fontSize: 14,
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
    lineHeight: 21,
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
});
