import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@shared/validations";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", role: "ATHLETE" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterInput) => {
    try {
      setError(null);
      await register(data);
      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#0a0a0a]"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        keyboardShouldPersistTaps="handled"
        className="px-6"
      >
        {/* Header */}
        <View className="items-center mb-8 mt-12">
          <Text className="text-4xl font-bold text-white">TrainX</Text>
          <Text className="text-muted-foreground mt-2 text-base">
            Create your account
          </Text>
        </View>

        {/* Error */}
        {error && (
          <View className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
            <Text className="text-destructive text-center text-sm">{error}</Text>
          </View>
        )}

        {/* Role Selector */}
        <View className="flex-row mb-6 bg-[#1a1a1a] rounded-xl p-1">
          <Controller
            control={control}
            name="role"
            render={({ field: { onChange } }) => (
              <>
                <TouchableOpacity
                  className={`flex-1 py-3 rounded-lg items-center ${
                    selectedRole === "ATHLETE"
                      ? "bg-primary"
                      : "bg-transparent"
                  }`}
                  onPress={() => onChange("ATHLETE")}
                >
                  <Text
                    className={`font-semibold ${
                      selectedRole === "ATHLETE"
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    Athlete
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 py-3 rounded-lg items-center ${
                    selectedRole === "COACH"
                      ? "bg-primary"
                      : "bg-transparent"
                  }`}
                  onPress={() => onChange("COACH")}
                >
                  <Text
                    className={`font-semibold ${
                      selectedRole === "COACH"
                        ? "text-primary-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    Coach
                  </Text>
                </TouchableOpacity>
              </>
            )}
          />
        </View>

        {/* Name */}
        <View className="mb-4">
          <Text className="text-sm text-muted-foreground mb-1.5 ml-1">
            Full Name
          </Text>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white text-base"
                placeholder="John Doe"
                placeholderTextColor="#666"
                autoCapitalize="words"
                autoComplete="name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.name && (
            <Text className="text-destructive text-xs mt-1 ml-1">
              {errors.name.message}
            </Text>
          )}
        </View>

        {/* Email */}
        <View className="mb-4">
          <Text className="text-sm text-muted-foreground mb-1.5 ml-1">
            Email
          </Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white text-base"
                placeholder="you@example.com"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email && (
            <Text className="text-destructive text-xs mt-1 ml-1">
              {errors.email.message}
            </Text>
          )}
        </View>

        {/* Password */}
        <View className="mb-4">
          <Text className="text-sm text-muted-foreground mb-1.5 ml-1">
            Password
          </Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white text-base"
                placeholder="Min 8 characters"
                placeholderTextColor="#666"
                secureTextEntry
                autoComplete="new-password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.password && (
            <Text className="text-destructive text-xs mt-1 ml-1">
              {errors.password.message}
            </Text>
          )}
        </View>

        {/* Coach ID (for athletes) */}
        {selectedRole === "ATHLETE" && (
          <View className="mb-6">
            <Text className="text-sm text-muted-foreground mb-1.5 ml-1">
              Coach Code (optional)
            </Text>
            <Controller
              control={control}
              name="coachId"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white text-base"
                  placeholder="Enter your coach's code"
                  placeholderTextColor="#666"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value || ""}
                />
              )}
            />
          </View>
        )}

        {/* Submit */}
        <TouchableOpacity
          className="bg-primary rounded-xl py-4 items-center mt-2"
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          activeOpacity={0.8}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-primary-foreground font-semibold text-base">
              Create Account
            </Text>
          )}
        </TouchableOpacity>

        {/* Login link */}
        <View className="flex-row justify-center mt-6 mb-12">
          <Text className="text-muted-foreground">
            Already have an account?{" "}
          </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text className="text-primary font-semibold">Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
