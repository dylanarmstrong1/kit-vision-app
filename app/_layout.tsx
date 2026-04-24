import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { KitSessionProvider } from "../lib/session";
import { colors } from "../lib/theme";

export default function RootLayout() {
  return (
    <KitSessionProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: {
            fontWeight: "700",
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Kit Vision Verify",
          }}
        />
        <Stack.Screen
          name="preview"
          options={{
            title: "Photo Preview",
          }}
        />
        <Stack.Screen
          name="results"
          options={{
            title: "Verification Results",
            gestureEnabled: false,
            headerBackVisible: false,
          }}
        />
      </Stack>
    </KitSessionProvider>
  );
}
