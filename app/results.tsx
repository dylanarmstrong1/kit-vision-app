import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { KitResultCard } from "../components/KitResultCard";
import { StatusBadge } from "../components/StatusBadge";
import { useKitSession } from "../lib/session";
import { colors, radii, spacing } from "../lib/theme";

export default function ResultsScreen() {
  const router = useRouter();
  const { report, clearVerification, resetAll } = useKitSession();

  useEffect(() => {
    if (!report) {
      router.replace("/");
    }
  }, [report, router]);

  if (!report) {
    return null;
  }

  const totalConfirmed = Object.keys(report.correct).length;
  const totalNeedsAttention =
    Object.keys(report.missing).length +
    Object.keys(report.unexpected).length +
    Object.keys(report.wrong_quantity).length +
    report.needs_review.length;

  const handleVerifyAnother = () => {
    clearVerification();
    resetAll();
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <Text style={styles.headerLabel}>Verification outcome</Text>
          <StatusBadge passed={report.passed} />
          <Text style={styles.summaryText}>
            {report.passed
              ? "All expected components were accounted for in this run."
              : "One or more items need attention before the kit can pass."}
          </Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryMetric}>
              <Text style={styles.summaryValue}>{totalConfirmed}</Text>
              <Text style={styles.summaryCaption}>Confirmed groups</Text>
            </View>
            <View style={styles.summaryMetric}>
              <Text style={styles.summaryValue}>{totalNeedsAttention}</Text>
              <Text style={styles.summaryCaption}>Attention groups</Text>
            </View>
          </View>
        </View>

        <KitResultCard
          label="Confirmed"
          items={report.correct}
          emptyText="No confirmed components were returned."
          tone="success"
        />
        <KitResultCard
          label="Missing"
          items={report.missing}
          emptyText="No missing components."
          tone="warning"
        />
        <KitResultCard
          label="Wrong Quantity"
          items={report.wrong_quantity}
          emptyText="No quantity mismatches."
          tone="warning"
        />
        <KitResultCard
          label="Unexpected"
          items={report.unexpected}
          emptyText="No unexpected components."
          tone="danger"
        />
        <KitResultCard
          label="Needs Review"
          items={report.needs_review}
          emptyText="Nothing was flagged for review."
          tone="neutral"
        />

        <Pressable
          onPress={handleVerifyAnother}
          style={({ pressed }) => [
            styles.resetButton,
            pressed && styles.resetButtonPressed,
          ]}
        >
          <Text style={styles.resetButtonLabel}>Verify Another</Text>
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
    gap: spacing.md,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radii.xl,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
  },
  headerLabel: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  summaryText: {
    color: colors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
  },
  summaryRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  summaryMetric: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radii.md,
    flex: 1,
    gap: spacing.xs,
    padding: spacing.md,
  },
  summaryValue: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "800",
  },
  summaryCaption: {
    color: colors.textMuted,
    fontSize: 13,
  },
  resetButton: {
    alignItems: "center",
    backgroundColor: colors.textPrimary,
    borderRadius: radii.lg,
    justifyContent: "center",
    minHeight: 56,
    marginTop: spacing.sm,
  },
  resetButtonPressed: {
    opacity: 0.94,
  },
  resetButtonLabel: {
    color: colors.textInverse,
    fontSize: 17,
    fontWeight: "700",
  },
});
