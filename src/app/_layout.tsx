import "../../global.css";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="product/[id]"
          options={{
            headerShown: false,
            headerTitle: "",
            headerTransparent: true,
            headerTintColor: "#1F2937",
          }}
        />
      </Stack>
    </>
  );
}
