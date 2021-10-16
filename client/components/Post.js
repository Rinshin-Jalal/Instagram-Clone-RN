import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Divider } from "react-native-elements";
import { UserContext } from "../contexts/userContext";
import { getDataFromStorage } from "../auth";

const postFooterIcons = [
  {
    name: "Like",
    url: "https://img.icons8.com/material-outlined/60/ffffff/filled-like.png",
    likedUrl: "https://img.icons8.com/material/60/ffffff/filled-like--v1.png",
  },
  {
    name: "comment",
    url: "https://img.icons8.com/material-outlined/60/ffffff/filled-topic.png",
  },
  {
    name: "share",
    url: "https://img.icons8.com/material-outlined/60/ffffff/filled-sent.png",
  },
  {
    name: "bookmark",
    url: "https://img.icons8.com/material-outlined/60/ffffff/bookmark-ribbon.png",
  },
];

const Post = ({ post }) => {
  const { user } = useContext(UserContext);

  const [liked_by, setLiked_by] = useState([]);
  const likedUsers = () => {
    let likes_by_users = [];
    post.likes.map((obj) => likes_by_users.push(obj.liked_by));
    setLiked_by(likes_by_users);
  };

  useEffect(() => {
    likedUsers();
  }, []);

  const handleLike = async (postToLike) => {
    const post_id = postToLike.id;
    const res = await fetch(`http://10.0.2.2:8000/post/${post_id}/like/`, {
      method: "post",
      headers: {
        Authorization: `Bearer ${await getDataFromStorage("access_token")}`,
        "content-type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
    });
    const data = await res.json();
    console.log(data);
    if (data.message === "Disliked Post") {
      setLiked_by(liked_by.filter((item) => item !== user.username));
    } else if (data.liked_by) {
      setLiked_by(...liked_by, data.liked_by);
    }
  };

  return (
    <View style={{ marginBottom: 30 }}>
      <Divider width={1} orientation="vertical" />
      <PostHeader post={post} />
      <PostImage post={post} />
      <PostFooter
        post={post}
        liked={liked_by}
        handleLike={handleLike}
        user={user}
      />
    </View>
  );
};

const PostHeader = ({ post }) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      margin: 5,
      alignItems: "center",
    }}
  >
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Image source={{ uri: post.owner.profile_photo }} style={styles.post} />
      <Text style={{ color: "white", marginLeft: 5, fontWeight: "600" }}>
        {post.owner.username}
        {post.owner.is_verified && " ✔️"}
      </Text>
    </View>
    <Text style={{ color: "white", fontWeight: "900" }}>...</Text>
  </View>
);

const PostImage = ({ post }) => (
  <View style={{ aspectRatio: 1 / 1 }}>
    <Image
      onPress={() => handleLike(post)}
      source={{ uri: post.image }}
      style={{ height: "100%", resizeMode: "cover" }}
    />
  </View>
);

const PostFooter = ({ post, handleLike, liked, user }) => (
  <View
    style={{
      marginHorizontal: 5,
      marginTop: 10,
    }}
  >
    {/* Icons */}
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View style={styles.leftFooterIconsContainer}>
        <TouchableOpacity onPress={() => handleLike(post)}>
          <Image
            source={{
              uri: liked.includes(user.username)
                ? postFooterIcons[0].likedUrl
                : postFooterIcons[0].url,
            }}
            style={styles.footerIcon}
          />
        </TouchableOpacity>
        <Icon imgStyle={styles.footerIcon} imgUrl={postFooterIcons[1].url} />
        <Icon imgStyle={styles.footerIcon} imgUrl={postFooterIcons[2].url} />
      </View>
      <Icon imgStyle={styles.footerIcon} imgUrl={postFooterIcons[3].url} />
    </View>

    {/* Likes */}
    <Likes post={post} />

    {/* Caption */}
    <Caption post={post} />

    {/* CommentSection */}
    <CommentSection post={post} />

    {/* Comments */}
    <Comments post={post} />

    {/* AddComment */}
    <AddComment post={post} />
  </View>
);

const Icon = ({ imgStyle, imgUrl, handlePress }) => (
  <TouchableOpacity onPress={() => handlePress && handlePress()}>
    <Image style={imgStyle} source={{ uri: imgUrl }} />
  </TouchableOpacity>
);

const Likes = ({ post }) => (
  <View style={{ flexDirection: "row", marginTop: 5 }}>
    {!!post.comments.length && (
      <Text style={{ color: "white", fontWeight: "600" }}>
        {post.comments.length > 1
          ? ` all ${post.likes.length} likes`
          : `${post.likes.length} like`}
      </Text>
    )}
  </View>
);

const Caption = ({ post }) => (
  <View style={{ marginTop: 5 }}>
    <Text style={{ color: "white" }}>
      <Text style={{ fontWeight: "bold" }}>{post.owner.username}</Text>
      <Text> {post.caption}</Text>
    </Text>
  </View>
);

const CommentSection = ({ post }) => (
  <View style={{ marginTop: 5 }}>
    {!!post.comments.length && (
      <Text style={{ color: "gray" }}>
        View
        {post.comments.length > 1
          ? ` all ${post.comments.length} comments`
          : " 1 comment"}
      </Text>
    )}
  </View>
);

const Comments = ({ post }) => (
  <>
    {post.comments.slice(0, 2).map((comment, index) => (
      <View key={index} style={{ flexDirection: "row", marginTop: 5 }}>
        <Text style={{ color: "white" }}>
          <Text style={{ fontWeight: "bold" }}>
            {comment.commented_by.username}
          </Text>
          {comment.comment.length > 15
            ? `${comment.comment.slice(0, 15)}....`
            : `${comment.comment}`}
        </Text>
      </View>
    ))}
  </>
);

const AddComment = ({ post }) => {
  const { user } = useContext(UserContext);
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 10,
          marginLeft: 0,
          alignItems: "center",
          backgroundColor: "#111",
          paddingVertical: 10,
        }}
      >
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Image source={{ uri: user.profile_photo }} style={styles.post} />
          <Text style={{ color: "#bbb", marginLeft: 5, fontWeight: "600" }}>
            {`Add Comment as  ${user.username} ${user.is_verified && " ✔️"}`}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  post: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: "#FF8510",
  },
  footerIcon: {
    width: 33,
    height: 33,
  },
  leftFooterIconsContainer: {
    flexDirection: "row",
    width: "32%",
    justifyContent: "space-between",
  },
});

export default Post;
