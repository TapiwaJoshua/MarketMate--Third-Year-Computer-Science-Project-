import { View, Text, Image, ScrollView, Linking, Alert } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useRoute } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Entypo } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Share } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  fetchUserName,
  fetchEmail,
  fetchUserImage,
} from "./../../utils/actions/authActions";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { app } from "./../../utils/firebaseHelper";
import {
  collection,
  deleteDoc,
  getFirestore,
  query,
  getDocs,
  where,
} from "firebase/firestore";

export default function ProductDetails() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const route = useRoute();
  const [product, setProduct] = useState([]);
  const db = getFirestore(app);

  const email = useSelector((state) => state.user.email);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.updatedProduct) {
        setProduct(route.params.updatedProduct);
        // Clear the params to avoid unnecessary updates
        navigation.setParams({ updatedProduct: undefined, refresh: undefined });
      } else if (route.params?.product) {
        setProduct(route.params.product);
      }
    }, [route.params])
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchEmail()),
          dispatch(fetchUserImage()),
          dispatch(fetchUserName()),
        ]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    params && setProduct(params.product); // update the product state with received data
    shareButton(); // update the share button options
  }, [params, navigation]);

  const shareButton = () => {
    navigation.setOptions({
      headerRight: () => (
        <Entypo
          name="share"
          size={30}
          color="white"
          style={{ marginRight: 10 }}
          onPress={() => shareProduct()}
        />
      ),
    });
  };

  const shareProduct = () => {
    const content = {
      message: product.title + "\n" + product.desc,
    };
    Share.share(content).then((resp) => {
      console.log(resp), (error) => console.log(error);
    });
  };

  const sendEmailMessage = async () => {
    try {
      const subject = encodeURIComponent(`Regarding ${product.title}`);
      const body = encodeURIComponent(
        `Hi ${product.userName},\n\nI am interested in this product.`
      );
      const mailtoUrl = `mailto:${product.userEmail}?subject=${subject}&body=${body}`;

      console.log("Attempting to open:", mailtoUrl);
      const supported = await Linking.canOpenURL(mailtoUrl);

      if (supported) {
        await Linking.openURL(mailtoUrl);
      } else {
        console.log("Don't know how to open this URL: " + mailtoUrl);
      }
    } catch (error) {
      console.error("An error occurred", error);
    }
  };

  const deleteUserPost = () => {
    Alert.alert(
      "Do you want to delete this Post?",
      "Are you sure you want to delete this Post?",
      [
        {
          text: "Yes",
          onPress: () => deleteFromFirestore(),
        },
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ]
    );
  };

  const deleteFromFirestore = async () => {
    const q = query(
      collection(db, "UserPost"),
      where("title", "==", product.title)
    );
    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      const productWithId = { ...doc.data(), id: doc.id };
      setProduct(productWithId);
      deleteDoc(doc.ref).then((resp) => {
        console.log("Deleted the Doc");
        navigation.goBack();
      });
    });
  };
  return (
    <ScrollView className="bg-white">
      <Image source={{ uri: product.image }} className="h-[350px] w-full" />
      <View className="p-3">
        <Text className="text-[30px] font-bold ">{product?.title}</Text>
        <View className="mt-2 item-baseline">
          <Text>
            <Text
              className="text-[20px] p-1 px-2 rounded-full"
              style={{ color: "lime" }}
            >
              {product.category}
            </Text>
          </Text>
        </View>
        <Text className="mt-5 font-bold text-[25px]">Description</Text>
        <Text className=" mb-5 text-[18px]">{product?.desc}</Text>
      </View>
      {/* User Info */}
      <View className="p-3 flex flex-row item-center mt-3 gap-1 bg-green-200">
        <Image
          source={{ uri: product.userImage }}
          className="w-10 h-12 rounded-full "
        />
        <View>
          <Text className="font-bold text-green-950 text-[20px]">
            {product.userName}
          </Text>
          <Text>{product.userEmail}</Text>
        </View>
      </View>
      {email == product.userEmail ? (
        <View>
          <TouchableOpacity
            className="z-40 p-4 m-2 mt-5 rounded-lg"
            style={{ backgroundColor: "lime" }}
            onPress={() =>
              navigation.navigate("edit-post", {
                product: { ...product, image: product.image },
              })
            }
          >
            <Text className="text-center text-[20px] font-bold text-white">
              Edit Post
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="z-40 bg-red-600 p-4 m-2 mt-5 rounded-lg"
            onPress={() => deleteUserPost()}
          >
            <Text className="text-center text-[20px] font-bold text-white">
              Delete Post
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <TouchableOpacity
            className="z-40 bg-green-600 p-4 m-2 mt-5 rounded-full"
            onPress={() => sendEmailMessage()}
          >
            <Text className="text-center text-[20px] font-bold text-white">
              Send Message
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="z-40  p-4 m-2 mt-5 rounded-full"
            style={{ backgroundColor: "lime" }}
          >
            <Text
              className="text-center text-[20px] font-bold text-white"
              onPress={() =>
                navigation.navigate("payment", {
                  product: { ...product, image: product.image },
                })
              }
            >
              Buy Now!
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
