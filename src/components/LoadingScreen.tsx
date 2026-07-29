// components/LoadingScreen.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Easing, useColorScheme } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

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
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // entrance fade
    Animated.timing(fadeValue, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // ring rotation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // logo breathing pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.08,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // sequential dot fade
    const animateDots = () => {
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
    };
    animateDots();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={{ opacity: fadeValue }}
      className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"} items-center justify-center px-6`}
    >
      <View className="items-center justify-center mb-8" style={{ width: 96, height: 96 }}>
        {/* rotating gradient ring */}
        <Animated.View
          style={{
            position: "absolute",
            width: 96,
            height: 96,
            transform: [{ rotate: spin }],
          }}
        >
          <LinearGradient
            colors={["#22C55E", "transparent", "transparent", "#22C55E"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 96,
              height: 96,
              borderRadius: 48,
            }}
          />
          <View
            className={`absolute ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
            style={{
              top: 5,
              left: 5,
              right: 5,
              bottom: 5,
              borderRadius: 43,
            }}
          />
        </Animated.View>

        {/* logo mark — breathing pulse */}
        <Animated.View style={{ transform: [{ scale: pulseValue }] }}>
          <LinearGradient
            colors={["#4ADE80", "#16A34A"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 60,
              height: 60,
              borderRadius: 18,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text className="text-white text-2xl font-extrabold">S</Text>
          </LinearGradient>
        </Animated.View>
      </View>

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