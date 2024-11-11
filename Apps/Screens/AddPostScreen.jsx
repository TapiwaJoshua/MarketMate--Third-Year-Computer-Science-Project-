import {
  View,
  TextInput,
  Alert,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import React from "react";
import { collection, getFirestore, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { useState } from "react";
import { app } from ".//.//../../utils/firebaseHelper";
import { Formik } from "formik";
import { StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { addDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import {
  fetchUserName,
  fetchEmail,
  fetchUserImage,
} from "../../utils/actions/authActions";
import { useDispatch } from "react-redux";

// import database from "@react-native-firebase/database";

export default function AddPostScreen() {
  const db = getFirestore(app);
  const storage = getStorage();
  const [image, setImage] = useState(null);
  const [categoryList, setCategoryList] = useState([]);

  const dispatch = useDispatch();

  const userName = useSelector((state) => state.user.userName);
  const email = useSelector((state) => state.user.email);
  const userImageURL = useSelector((state) => state.user.userImageURL);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchEmail());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchUserImage());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchUserName());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    console.log("useEffect triggered");
    getCategoryList();
  }, []);

  const getCategoryList = async () => {
    setCategoryList([]);
    console.log("getCategoryList called");
    try {
      const querySnapshot = await getDocs(collection(db, "Category"));
      querySnapshot.forEach((doc) => {
        console.log("Docs: ", doc.data());
        setCategoryList((categoryList) => [...categoryList, doc.data()]);
      });
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    } else {
      console.log("Image picking was canceled or no assets found");
    }
  };

  const onSubmitMethod = async (value) => {
    setLoading(true);
    const resp = await fetch(image);
    const blob = await resp.blob();
    const storageRef = ref(storage, "vendor/" + Date.now() + "jpg");

    uploadBytes(storageRef, blob)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
      })
      .then((resp) => {
        getDownloadURL(storageRef).then(async (downloadUrl) => {
          console.log(downloadUrl);
          console.log(userName);
          console.log(email);
          value.image = downloadUrl;
          value.userName = userName;
          value.userEmail = email;
          value.userImage = userImageURL;

          const docRef = await addDoc(collection(db, "UserPost"), value);
          if (docRef.id) {
            setLoading(false);
            Alert.alert("Success!!", "Post Published Successfully");
          }
        });
      });
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView className="p-10 bg-green-50">
        <Text className="text-[27px] font-bold text-green-800 mt-10">
          Add New Post
        </Text>
        <Text className="text-[18px] mt-5 mb-10 text-green-500">
          Create New post and Start Selling
        </Text>
        <Formik
          initialValues={{
            title: "",
            desc: "",
            category: "",
            address: "",
            price: "",
            image: "",
            userName: "",
            userEmail: "",
            userImageURL: "",
            createdAt: Date.now(),
          }}
          onSubmit={(values, { resetForm }) =>
            onSubmitMethod(values, resetForm)
          }
          validate={(values) => {
            const errors = {};
            // if (!values.title) {
            //   console.log("Title not specified");
            //   ToastAndroid.show("Title is required", ToastAndroid.SHORT);
            //   errors.name = "Title is required";
            // }
            // if (!values.desc) {
            //   console.log("Description not specified");
            //   ToastAndroid.show("Description is required", ToastAndroid.SHORT);
            //   errors.name = "Description is required";
            // }
            // if (!values.category) {
            //   console.log("Category not specified");
            //   ToastAndroid.show("Category is required", ToastAndroid.SHORT);
            //   errors.name = "Category is required";
            // }
            // if (!values.address) {
            //   console.log("Address not specified");
            //   ToastAndroid.show("Address is required", ToastAndroid.SHORT);
            //   errors.name = "Address is required";
            // }
            // if (!values.price) {
            //   console.log("Price not specified");
            //   ToastAndroid.show("Price is required", ToastAndroid.SHORT);
            //   errors.name = "Price is required";
            // }
            return errors;
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            setFieldValue,
            errors,
          }) => (
            <View>
              <TouchableOpacity onPress={pickImage}>
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={{ width: 100, height: 100, borderRadius: 15 }}
                    onError={(e) =>
                      console.log("Image load error:", e.nativeEvent.error)
                    }
                  />
                ) : (
                  <Image
                    source={require(".//..//../assets/Images/placeholder-image.png")}
                    style={{ width: 100, height: 100, borderRadius: 15 }}
                  />
                )}
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Title"
                value={values?.title}
                onChangeText={handleChange("title")}
              />
              <TextInput
                style={styles.input}
                placeholder="Description"
                value={values?.desc}
                numberOfLines={5}
                onChangeText={handleChange("desc")}
              />
              <TextInput
                style={styles.input}
                placeholder="Price"
                value={values?.price}
                keyboardType="number-pad"
                onChangeText={handleChange("price")}
              />
              {/* Category List Dropdown */}
              <View style={styles.dropdown}>
                <Picker
                  selectedValue={values?.category}
                  onValueChange={(itemValue) =>
                    setFieldValue("category", itemValue)
                  }
                  className="border-2"
                >
                  {categoryList &&
                    categoryList.map((item, index) => (
                      <Picker.Item
                        key={index}
                        label={item.name}
                        value={item.name}
                      />
                    ))}
                </Picker>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Location"
                value={values?.address}
                onChangeText={handleChange("address")}
              />
              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  backgroundColor: loading ? "lime" : "green",
                }}
                disabled={loading}
                className="p-5 bg-green-600 rounded-[20px] mt-8"
              >
                {loading ? (
                  <ActivityIndicator color="#ffff" />
                ) : (
                  <Text className="text-white text-center text-[16px]">
                    POST
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginBottom: 5,
    borderBlockColor: "green",
    paddingHorizontal: 17,
    fontSize: 17,
    textAlignVertical: "top",
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 15,
    borderBlockColor: "green",
  },
});
