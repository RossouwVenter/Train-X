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
import { z } from "zod";
import { apiClient } from "@/lib/api-client";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setError(null);
    try {
      await apiClient.post("/api/auth/reset-password", {
        email: data.email,
        newPassword: data.newPassword,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  if (success) {
    return (
      <View className="flex-1 justify-center items-center px-6 bg-neutral-900">
        <View className="w-full max-w-sm">
          <Text className="text-2xl font-bold text-white text-center mb-4">
            Password Reset
          </Text>
          <Text className="text-neutral-400 text-center mb-8">
            If an account with that email exists, the password has been updated.
          </Text>
          <TouchableOpacity
            onPress={() => router.replace("/(auth)/login")}
            className="bg-blue-600 py-4 rounded-xl items-center"
          >
            <Text className="text-white font-semibold text-base">
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 justify-center px-6 bg-neutral-900">
        <View className="w-full max-w-sm self-center">
          <Text className="text-3xl font-bold text-white text-center mb-2">
            Reset Password
          </Text>
          <Text className="text-neutral-400 text-center mb-8">
            Enter your email and new password
          </Text>

          {error && (
            <View className="bg-red-900/30 border border-red-500/50 rounded-xl p-3 mb-4">
              <Text className="text-red-400 text-center text-sm">{error}</Text>
            </View>
          )}

          {/* Email */}
          <View className="mb-4">
            <Text className="text-neutral-300 text-sm mb-2 ml-1">Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3.5 text-white"
                  placeholder="you@example.com"
                  placeholderTextColor="#737373"
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
              <Text className="text-red-400 text-xs mt-1 ml-1">
                {errors.email.message}
              </Text>
            )}
          </View>

          {/* New Password */}
          <View className="mb-4">
            <Text className="text-neutral-300 text-sm mb-2 ml-1">
              New Password
            </Text>
            <Controller
              control={control}
              name="newPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3.5 text-white"
                  placeholder="Min. 8 characters"
                  placeholderTextColor="#737373"
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.newPassword && (
              <Text className="text-red-400 text-xs mt-1 ml-1">
                {errors.newPassword.message}
              </Text>
            )}
          </View>

          {/* Confirm Password */}
          <View className="mb-6">
            <Text className="text-neutral-300 text-sm mb-2 ml-1">
              Confirm Password
            </Text>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-3.5 text-white"
                  placeholder="Repeat password"
                  placeholderTextColor="#737373"
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.confirmPassword && (
              <Text className="text-red-400 text-xs mt-1 ml-1">
                {errors.confirmPassword.message}
              </Text>
            )}
          </View>

          {/* Submit */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
            className={`py-4 rounded-xl items-center ${
              isSubmitting ? "bg-blue-600/50" : "bg-blue-600"
            }`}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Reset Password
              </Text>
            )}
          </TouchableOpacity>

          {/* Back to login */}
          <View className="flex-row justify-center mt-6">
            <Text className="text-neutral-400">Remember your password? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-blue-400 font-medium">Sign in</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
