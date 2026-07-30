// components/LoadingScreen.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing, useColorScheme, Image } from "react-native";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading",
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1.25)).current; // starts bigger -> zooms out to normal
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // entrance: fade in + zoom OUT (scale down) — clean, professional intro
    Animated.parallel([
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 550,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();

    // thin ring rotation — continuous, smooth
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // very subtle breathing pulse on the logo (minimal, not distracting)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.04,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // sequential dot fade
    Animated.loop(
      Animated.stagger(200, [
        Animated.sequence([
          Animated.timing(dot1, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(dot1, { toValue: 0.3, duration: 350, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(dot2, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(dot2, { toValue: 0.3, duration: 350, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(dot3, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(dot3, { toValue: 0.3, duration: 350, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const ringTrackColor = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";

  return (
    <Animated.View
      style={{ opacity: fadeValue }}
      className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"} items-center justify-center px-6`}
    >
      <Animated.View
        className="items-center justify-center mb-8"
        style={{ width: 90, height: 90, transform: [{ scale: scaleValue }] }}
      >
        {/* static thin track circle */}
        <View
          style={{
            position: "absolute",
            width: 84,
            height: 84,
            borderRadius: 42,
            borderWidth: 3,
            borderColor: ringTrackColor,
          }}
        />

        {/* thin rotating arc — modern spinner, not a thick block */}
        <Animated.View
          style={{
            position: "absolute",
            width: 84,
            height: 84,
            borderRadius: 42,
            borderWidth: 3,
            borderColor: "transparent",
            borderTopColor: "#22C55E",
            borderRightColor: "#22C55E",
            transform: [{ rotate: spin }],
          }}
        />

        {/* logo image — subtle breathing pulse only */}
        <Animated.View
          style={{
            transform: [{ scale: pulseValue }],
            width: 58,
            height: 58,
            borderRadius: 16,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            backgroundColor: isDark ? "#111827" : "#FFFFFF",
            shadowColor: "#000",
            shadowOpacity: isDark ? 0.3 : 0.08,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
            elevation: 3,
          }}
        >
          <Image
            source={require("../../assets/images/icon.png")}
            style={{ width: 42, height: 42, resizeMode: "contain" }}
          />
        </Animated.View>
      </Animated.View>

      <View className="flex-row items-center">
        <Text className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          {message}
        </Text>
        <Animated.Text style={{ opacity: dot1, color: isDark ? "#9CA3AF" : "#6B7280", fontWeight: "600" }}>
          .
        </Animated.Text>
        <Animated.Text style={{ opacity: dot2, color: isDark ? "#9CA3AF" : "#6B7280", fontWeight: "600" }}>
          .
        </Animated.Text>
        <Animated.Text style={{ opacity: dot3, color: isDark ? "#9CA3AF" : "#6B7280", fontWeight: "600" }}>
          .
        </Animated.Text>
      </View>
    </Animated.View>
  );
};

export default LoadingScreen;