import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@shared/validations";
import { useAuth } from "@/hooks/useAuth";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      setError(null);
      await login(data.email, data.password);
      router.replace("/(tabs)");
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#0a0a0a]"
    >
      <View className="flex-1 justify-center px-6">
        {/* Logo / Header */}
        <View className="items-center mb-10">
          <Text className="text-4xl font-bold text-white">TrainX</Text>
          <Text className="text-muted-foreground mt-2 text-base">
            Sign in to your account
          </Text>
        </View>

        {/* Error */}
        {error && (
          <View className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4">
            <Text className="text-destructive text-center text-sm">{error}</Text>
          </View>
        )}

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
                testID="email-input"
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
        <View className="mb-6">
          <Text className="text-sm text-muted-foreground mb-1.5 ml-1">
            Password
          </Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3.5 text-white text-base"
                placeholder="••••••••"
                placeholderTextColor="#666"
                secureTextEntry
                autoComplete="password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                testID="password-input"
              />
            )}
          />
          {errors.password && (
            <Text className="text-destructive text-xs mt-1 ml-1">
              {errors.password.message}
            </Text>
          )}
        </View>

        {/* Submit */}
        <TouchableOpacity
          className="bg-primary rounded-xl py-4 items-center"
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          activeOpacity={0.8}
          testID="login-button"
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-primary-foreground font-semibold text-base">
              Sign In
            </Text>
          )}
        </TouchableOpacity>

        {/* Forgot password */}
        <View className="items-center mt-4">
          <Link href="/(auth)/forgot-password" asChild>
            <TouchableOpacity>
              <Text className="text-muted-foreground text-sm">Forgot password?</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Register link */}
        <View className="flex-row justify-center mt-4">
          <Text className="text-muted-foreground">
            Don't have an account?{" "}
          </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text className="text-primary font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
