import { Stack } from "expo-router";

export default function CoachLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#0a0a0a" },
      }}
    >
      <Stack.Screen name="athlete/[id]" />
      <Stack.Screen name="plan/[id]" />
      <Stack.Screen name="create-plan" />
    </Stack>
  );
}
