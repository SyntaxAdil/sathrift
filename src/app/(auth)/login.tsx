import { useState } from "react";
import { View, TextInput, Button, Alert, Text } from "react-native";
import { authClient } from "@/lib/auth-client";
import { router } from "expo-router";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const {error}=await authClient.signIn.email({ email, password });
    if(error){
        Alert.alert("Login Failed")
        console.log(error)
        return
    }
    Alert.alert("Login Successfull")
    router.replace("/profile")
  };

  return (
    <View className="flex-1 justify-center mx-4">
        <Text>SATHRIFT Login</Text>
        <Text className="text-4xl mb-4" >Welcome Back</Text>

      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}