import { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import { router } from "expo-router";
import { authClient } from "@/lib/auth-client";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const { error } = await authClient.signUp.email({ name, email, password });

    if (error) {
      console.log(error.message);
      Alert.alert("Register Failed")
      return;
    }

    Alert.alert("Register Successfully")
    router.replace("/(tabs)");
  };

  return (
    <View className="flex-1 justify-center mx-8 ">
      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}