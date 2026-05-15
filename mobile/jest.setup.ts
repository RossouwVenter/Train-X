// Mock expo-secure-store
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Provide reanimated globals required by NativeWind
(global as any).__reanimatedLoggerConfig = { logLevel: 0, strict: false };
(global as any)._toString = Object.prototype.toString;
(global as any)._frameTimestamp = null;

jest.mock("react-native-reanimated", () => {
  const RN = require("react-native");
  return {
    __esModule: true,
    default: {
      createAnimatedComponent: (c: any) => c,
      addWhitelistedNativeProps: jest.fn(),
      addWhitelistedUIProps: jest.fn(),
    },
    useSharedValue: (v: any) => ({ value: v }),
    useAnimatedStyle: (fn: any) => fn(),
    useDerivedValue: (fn: any) => ({ value: fn() }),
    useAnimatedProps: (fn: any) => fn(),
    withTiming: (v: any) => v,
    withSpring: (v: any) => v,
    withDelay: (_: any, v: any) => v,
    withSequence: (...args: any[]) => args[args.length - 1],
    withRepeat: (v: any) => v,
    cancelAnimation: jest.fn(),
    Easing: { linear: (v: any) => v, ease: (v: any) => v, bezier: () => (v: any) => v },
    createAnimatedComponent: (c: any) => c,
    View: RN.View,
    Text: RN.Text,
    Image: RN.Image,
    ScrollView: RN.ScrollView,
    FlatList: RN.FlatList,
    Extrapolation: { CLAMP: "clamp" },
    interpolate: jest.fn(),
    runOnJS: (fn: any) => fn,
    runOnUI: (fn: any) => fn,
    measure: jest.fn(),
    useAnimatedRef: () => ({ current: null }),
    useAnimatedScrollHandler: () => jest.fn(),
    useFrameCallback: jest.fn(),
    Layout: { duration: () => ({ build: () => ({}) }) },
    FadeIn: { duration: () => ({ build: () => ({}) }) },
    FadeOut: { duration: () => ({ build: () => ({}) }) },
    SlideInDown: { duration: () => ({ build: () => ({}) }) },
    SlideOutDown: { duration: () => ({ build: () => ({}) }) },
    getUseOfValueInStyleWarning: () => undefined,
  };
});

// Mock expo-haptics
jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
}));

// Mock expo-router
jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useSegments: () => [],
  useLocalSearchParams: () => ({}),
  Link: "Link",
  Redirect: "Redirect",
  Stack: {
    Screen: "Screen",
  },
  Tabs: {
    Screen: "Screen",
  },
}));
