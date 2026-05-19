import { Component, type ReactNode } from "react";
import { View, Text, Pressable } from "react-native";
import { AlertTriangle, RotateCcw } from "lucide-react-native";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <View className="flex-1 bg-[#0a0a0a] items-center justify-center px-8">
          <AlertTriangle size={48} color="#f97316" />
          <Text className="text-xl font-bold text-white mt-4">
            Something went wrong
          </Text>
          <Text className="text-sm text-gray-400 text-center mt-2 leading-5">
            {this.state.error?.message ?? "An unexpected error occurred"}
          </Text>
          <Pressable
            onPress={this.handleReset}
            className="flex-row items-center mt-6 bg-blue-600 px-6 py-3 rounded-xl"
          >
            <RotateCcw size={16} color="#fff" />
            <Text className="text-white font-bold ml-2">Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}
