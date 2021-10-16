import React, { useContext, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
  Alert,
} from "react-native";
import { loginUser, getDataFromStorage } from "../../auth";
import { UserContext } from "../../contexts/userContext";

import { Formik } from "formik";
import * as Yup from "yup";

const LoginForm = ({ nav }) => {
  const { user, setUser, isUserLoggedIn } = useContext(UserContext);

  const LoginFormSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is Required")
      .max(50, "Your Username has to be less 50 characters"),
    password: Yup.string()
      .required()
      .min(8, "Your password has to have at least 8 characters"),
  });

  const onLogin = async (username, password) => {
    try {
      await loginUser(username, password);
      setUser({ username: username });
      console.log("Login Done:");
    } catch (error) {
      Alert.alert(
        "😆Hey You",
        error.message + "\n\n 😀 What would you like to do????",
        [
          {
            text: "Ok",
            onPress: () => console.log("Ok"),
            style: "cancel",
          },
          {
            text: "Sign Up",
            onPress: () => nav.push("SignUpScreen"),
          },
        ]
      );
    }
  };

  return (
    <View style={styles.wrapper}>
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => onLogin(values.username, values.password)}
        validationSchema={LoginFormSchema}
        validateOnMount={true}
      >
        {({ handleChange, handleBlur, handleSubmit, values, isValid }) => (
          <>
            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    values.username.length < 1 || values.username.length <= 51
                      ? "#ccc"
                      : "red",
                },
              ]}
            >
              <TextInput
                placeholderTextColor="#444"
                placeholder="username..."
                autoCapitalize="none"
                keyboardType="default"
                textContentType="username"
                autoFocus={true}
                onChangeText={handleChange("username")}
                onBlur={handleBlur("username")}
                value={values.username}
              />
            </View>
            <View
              style={[
                styles.inputField,
                {
                  borderColor:
                    values.password.length < 1 || values.password.length >= 8
                      ? "#ccc"
                      : "red",
                },
              ]}
            >
              <TextInput
                placeholderTextColor="#444"
                placeholder="Password"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={true}
                textContentType="password"
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                value={values.password}
              />
            </View>
            <View style={{ alignItems: "flex-end", marginBottom: 30 }}>
              <Text style={{ color: "#68b0f5" }}>Forgot password?</Text>
            </View>
            <Pressable
              titleSize={20}
              style={styles.button(isValid)}
              onPress={handleSubmit}
              disabled={!isValid}
            >
              <Text style={styles.buttonText}>Log In</Text>
            </Pressable>
            <View style={styles.signUpContainer}>
              <Text style={{ color: "white" }}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => nav.push("SignUpScreen")}>
                <Text style={{ color: "#0096f6" }}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 80,
  },
  inputField: {
    borderRadius: 5,
    padding: 12,
    backgroundColor: "#fafafa",
    marginBottom: 10,
    borderWidth: 1,
  },
  button: (isValid) => ({
    backgroundColor: isValid ? "#0096f6" : "#9acaf7",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 42,
    borderRadius: 4,
  }),
  buttonText: {
    fontWeight: "600",
    color: "#fff",
    fontSize: 20,
  },
  signUpContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    marginTop: 50,
  },
});

export default LoginForm;
