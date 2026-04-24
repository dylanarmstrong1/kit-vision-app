import { StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../lib/theme";

type StatusBadgeProps = {
  passed: boolean;
};

export function StatusBadge({ passed }: StatusBadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        passed ? styles.badgePassed : styles.badgeFailed,
      ]}
    >
      <Text style={[styles.label, passed ? styles.labelPassed : styles.labelFailed]}>
        {passed ? "PASS ✅" : "FAIL ❌"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: radii.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  badgePassed: {
    backgroundColor: "#ECFDF3",
  },
  badgeFailed: {
    backgroundColor: "#FEF2F2",
  },
  label: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.4,
  },
  labelPassed: {
    color: "#05603A",
  },
  labelFailed: {
    color: "#991B1B",
  },
});
