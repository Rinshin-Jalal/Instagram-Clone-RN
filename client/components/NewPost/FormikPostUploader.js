import React, { useState, useEffect } from "react";
import { View, TextInput, Image } from "react-native";
import { Button as Btn } from "react-native-elements";
import * as Yup from "yup";
import { Formik } from "formik";
import { Divider } from "react-native-elements";
import { getDataFromStorage } from "../../auth";
import * as ImagePicker from "expo-image-picker";

const PLACEHOLDERIMAGE =
  "https://www.brownweinraub.com/wp-content/uploads/2017/09/placeholder.jpg";

const postUploadSchema = Yup.object().shape({
  caption: Yup.string().max(2200, "Caption has reached the character limit."),
});

const FormikPostUploader = ({ nav }) => {
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [base64Image, setBase64Image] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.cancelled) {
      setThumbnailUrl(result.uri);
      setBase64Image(result.base64);
    }
  };

  const uploadPost = async (caption) => {
    let form_data = new FormData();
    form_data.append("caption", caption);
    form_data.append("image", base64Image);
    const res = await fetch("http://10.0.2.2:8000/post/all/", {
      body: form_data,
      method: "post",
      headers: {
        Authorization: `Bearer ${await getDataFromStorage("access_token")}`,
        "content-type":
          "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
      },
    });
    const data = await res.json();
    nav.goBack();
  };

  return (
    <Formik
      initialValues={{ caption: "" }}
      onSubmit={(values) => {
        uploadPost(values.caption);
      }}
      validationSchema={postUploadSchema}
      validateOnMount={true}
    >
      {({
        handleBlur,
        handleChange,
        handleSubmit,
        values,
        errors,
        isValid,
      }) => (
        <>
          <View
            style={{
              margin: 20,
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Image
              source={{
                uri: thumbnailUrl ? thumbnailUrl : PLACEHOLDERIMAGE,
              }}
              style={{ width: 100, height: 100 }}
            />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <TextInput
                style={{ color: "white", fontSize: 20 }}
                placeholder="Write a Caption....."
                placeholderTextColor="gray"
                onChangeText={handleChange("caption")}
                onBlur={handleBlur("caption")}
                value={values.caption}
                multiline={true}
              />
            </View>
          </View>
          <Divider width={0.2} orientation="vertical" />

          <Btn type="outline" title="Pick an image" onPress={pickImage} />
          <Btn
            onPress={() => uploadPost(values.caption)}
            title="share"
            disabled={!isValid}
            type="clear"
          />
        </>
      )}
    </Formik>
  );
};

export default FormikPostUploader;
