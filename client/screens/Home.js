import React, { useContext, useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { BASE_URL } from "../auth";
import BottomTabs, { bottomTabIcons } from "../components/BottomTabs";
import Header from "../components/Home/Header";
import Post from "../components/Post";
import Stories from "../components/Home/Stories";
import { UserContext } from "../contexts/userContext";
import { POSTS } from "../data/posts";

const Home = ({ navigation }) => {
  const { posts } = useContext(UserContext);

  return (
    <View style={{ backgroundColor: "black" }}>
      <Header nav={navigation} />
      <Stories />
      <BottomTabs icons={bottomTabIcons} nav={navigation} />
      <ScrollView style={{ marginBottom: "50%" }}>
        {posts.map((post, index) => (
          <Post key={index} post={post} />
        ))}
      </ScrollView>
    </View>
  );
};

export default Home;
