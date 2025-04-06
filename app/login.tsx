import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  Image,
  Alert,
  ActivityIndicator
} from "react-native";
import { login } from "@/api/auth";
import { useRouter } from "expo-router";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      if (user) {
        // Redirect to products page regardless of role
        router.replace("/");
      } else {
        Alert.alert("Login Failed", "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error", "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo/Header */}
      <View style={styles.header}>
        <Image 
          source={require("@/assets/images/react-logo.png")} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#999"
        />

        <Pressable 
          style={({ pressed }) => [
            styles.loginButton,
            pressed && styles.buttonPressed
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </Pressable>

        {/* Forgot password link */}
        {/* <Pressable 
          style={styles.forgotPassword}
          onPress={() => router.push("/forgot-password")}
        >
          <Text style={styles.linkText}>Forgot password?</Text>
        </Pressable> */}
      </View>

      {/* Demo credentials */}
      <View style={styles.demoContainer}>
        <Text style={styles.demoTitle}>Demo credentials:</Text>
        <Text style={styles.demoText}>admin@example.com</Text>
        <Text style={styles.demoText}>user@example.com</Text>
        <Text style={styles.demoNote}>(any password will work)</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        {/* <Pressable onPress={() => router.push("/register")}> */}
          <Text style={[styles.linkText, styles.signUpText]}>Sign Up</Text>
        {/* </Pressable> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  form: {
    marginBottom: 24,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  loginButton: {
    height: 50,
    backgroundColor: "#2f95dc",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 12,
  },
  linkText: {
    color: "#2f95dc",
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
    marginTop: 20,
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },
  signUpText: {
    fontWeight: "600",
  },
  demoContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  demoTitle: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  demoText: {
    fontSize: 14,
    color: "#666",
  },
  demoNote: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
    marginTop: 4,
  },
});

export default LoginScreen;