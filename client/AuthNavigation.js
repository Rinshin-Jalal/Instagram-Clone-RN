import React, { useEffect, useContext } from "react";
import { View, Text } from "react-native";
import { SignedInStack, SignedOutStack } from "./navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "./contexts/userContext";
import { getDataFromStorage, isJWTinStorage, getUserDetails } from "./auth";

const AuthNavigation = () => {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const authHandler = async () => {
      const isJWTthere = await isJWTinStorage();
      console.log("2:    ", isJWTthere);

      if (isJWTthere) {
        const username = await getDataFromStorage("username");
        const newUser = await getUserDetails(username);
        console.log(newUser);
        setUser(newUser);
      }
    };
    authHandler();
  }, []);

  return <>{user ? <SignedInStack /> : <SignedOutStack />}</>;
};

export default AuthNavigation;
