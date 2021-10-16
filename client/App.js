import React, { useState, useEffect } from "react";
import { SafeAreaView, StyleSheet, Platform, StatusBar } from "react-native";
import AuthNavigation from "./AuthNavigation";
import { UserContext } from "./contexts/userContext.js";
import { logoutUser, BASE_URL } from "./auth.js";

export default function App() {
  const [user, setUser] = useState(null);
  const isUserLoggedIn = () => {
    return !!user;
  };
  const logout = (event) => {
    event.preventDefault();
    logoutUser();
    setUser(null);
  };
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetch(`${BASE_URL}/post/all/`)
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser, isUserLoggedIn, posts }}>
      <SafeAreaView style={styles.AndroidSafeArea}>
        <AuthNavigation />
      </SafeAreaView>
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({
  AndroidSafeArea: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 0,
    flex: 1,
    backgroundColor: "#000",
  },
});
