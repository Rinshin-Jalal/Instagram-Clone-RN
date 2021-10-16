import React from "react";
import { View } from "react-native";
import AddNewPost from "../components/NewPost/AddNewPost";

const NewPost = ({ navigation }) => {
  return (
    <View style={{ backgroundColor: "black", height: "100%" }}>
      <AddNewPost navigation={navigation} />
    </View>
  );
};

export default NewPost;
