import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";

import { StarBottleProvider } from "@/state/star-bottle-store";

export default function RootLayout() {
  return (
    <StarBottleProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerTransparent: true,
          headerShadowVisible: false,
          headerTintColor: "#F8E7A1",
          contentStyle: { backgroundColor: "#081832" },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="compose"
          options={{
            title: "寫心事",
            headerBackTitle: "海岸",
            headerTitleStyle: { color: "#F9E8AE" },
          }}
        />
      </Stack>
    </StarBottleProvider>
  );
}
