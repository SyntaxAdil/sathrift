import { View, Text, Button } from "react-native";
import React from "react";
import { router } from "expo-router";

const HomeScreen = () => {
  return (
    <View className="mt-20 px-4">
      <Text className="text-6xl tracking-tighter font-bold">
        SA<Text className="text-emerald-400">Thirft</Text>
      </Text>
      <Text className="text-2xl mt-2 text-slate-300 font-light">
        Let's thrift with the trend
      </Text>
      <Button title="SignIn" onPress={()=>router.push("/register")} className="mb-4" ></Button>
      <Button title="SignIn" onPress={()=>router.push("/login")}  ></Button>
    </View>
  );
};

export default HomeScreen;
