import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Divider } from "react-native-elements";
import { UserContext } from "../contexts/userContext";
import { BASE_URL } from "../auth";
import Post from "../components/Post";

const Profile = ({ navigation }) => {
  const { user, posts } = useContext(UserContext);
  const [myPosts, setMyPosts] = useState(null);
  useEffect(() => {
    fetch(`${BASE_URL}/post/all/`)
      .then((res) => res.json())
      .then((data) => {
        let myposts = data.filter(
          (item) => item.owner.username === user.username
        );
        setMyPosts(myposts);
      });
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingTop: 20,
        backgroundColor: "black",
      }}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ position: "absolute", left: 30, zIndex: 999 }}
      >
        <Image
          source={{
            uri: "https://img.icons8.com/ios-glyphs/90/ffffff/back.png",
          }}
          style={{
            width: 40,
            height: 40,
          }}
        />
      </TouchableOpacity>
      <ProfileHeader user={user} />
      <Divider width={3} orientation="vertical" />

      {myPosts && myPosts?.length > 0 ? (
        <ScrollView style={{ width: "100%" }}>
          {myPosts?.map((post, index) => (
            <Post key={index} post={post} />
          ))}
        </ScrollView>
      ) : (
        <Text style={{ color: "white", marginVertical: 30, fontSize: 30 }}>
          No Post Yet
        </Text>
      )}
    </View>
  );
};

const ProfileHeader = ({ user }) => (
  <>
    <Image
      source={{
        uri: user.profile_photo,
      }}
      style={{
        width: 120,
        height: 120,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: "#fff",
      }}
    />
    <Text
      style={{ color: "#fff", fontSize: 25, marginTop: 20, marginBottom: 20 }}
    >
      {user.username}
      {user.is_verified && " ✔️"}
    </Text>
  </>
);
export default Profile;
