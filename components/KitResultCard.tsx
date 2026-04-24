import { StyleSheet, Text, View } from "react-native";

import { DetectionResult } from "../types/kit";
import { colors, radii, spacing } from "../lib/theme";

type Tone = "success" | "warning" | "danger" | "neutral";

type KitResultCardProps = {
  label: string;
  items: DetectionResult | string[];
  emptyText: string;
  tone?: Tone;
};

type NormalizedItem = {
  key: string;
  name: string;
  quantity?: number;
};

export function KitResultCard({
  label,
  items,
  emptyText,
  tone = "neutral",
}: KitResultCardProps) {
  const normalizedItems = normalizeItems(items);
  const toneColors = toneMap[tone];

  return (
    <View
      style={[
        styles.card,
        {
          borderColor: toneColors.border,
          backgroundColor: toneColors.background,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.label, { color: toneColors.title }]}>{label}</Text>
        <Text style={[styles.count, { color: toneColors.title }]}>
          {normalizedItems.length}
        </Text>
      </View>

      {normalizedItems.length === 0 ? (
        <Text style={styles.emptyText}>{emptyText}</Text>
      ) : (
        <View style={styles.itemList}>
          {normalizedItems.map((item) => (
            <View key={item.key} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              {item.quantity !== undefined ? (
                <Text style={styles.itemQuantity}>Qty {item.quantity}</Text>
              ) : null}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function normalizeItems(items: DetectionResult | string[]): NormalizedItem[] {
  if (Array.isArray(items)) {
    return items.map((name) => ({
      key: name,
      name,
    }));
  }

  return Object.entries(items).map(([name, quantity]) => ({
    key: name,
    name,
    quantity,
  }));
}

const toneMap: Record<
  Tone,
  { background: string; border: string; title: string }
> = {
  success: {
    background: "#ECFDF3",
    border: "#A6F4C5",
    title: "#05603A",
  },
  warning: {
    background: "#FFFAEB",
    border: "#FCD34D",
    title: "#92400E",
  },
  danger: {
    background: "#FEF2F2",
    border: "#FECACA",
    title: "#991B1B",
  },
  neutral: {
    background: colors.surface,
    border: colors.border,
    title: colors.textPrimary,
  },
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
  },
  count: {
    fontSize: 14,
    fontWeight: "700",
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  itemList: {
    gap: spacing.sm,
  },
  itemRow: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.65)",
    borderRadius: radii.md,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  itemName: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
  },
  itemQuantity: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
    marginLeft: spacing.md,
  },
});
