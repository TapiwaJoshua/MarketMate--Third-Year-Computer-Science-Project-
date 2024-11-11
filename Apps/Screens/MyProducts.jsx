import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { collection, getFirestore, where, getDocs } from "firebase/firestore";
import { app } from "./../../utils/firebaseHelper";
import { query } from "firebase/database";
import {
  fetchUserName,
  fetchEmail,
  fetchUserImage,
} from "./../../utils/actions/authActions";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import LatestItemList from "../Components/HomeScreen/LatestItemList";

export default function MyProducts() {
  const userName = useSelector((state) => state.user.userName);
  const email = useSelector((state) => state.user.email);
  const userImageURL = useSelector((state) => state.user.userImageURL);
  const dispatch = useDispatch();
  const db = getFirestore(app);
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);

  const [productList, setProductList] = useState([]);

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
    email && getUserPost();
  }, [email]);

  useEffect(() => {
    navigation.addListener("focus", (e) => {
      console.log(e);
      getUserPost();
    });
  }, [navigation]);

  const getUserPost = async () => {
    const q = query(
      collection(db, "UserPost"),
      where("userEmail", "==", email)
    );
    const snapshot = await getDocs(q);
    setProductList([]);
    snapshot.forEach((doc) => {
      console.log(doc.data());
      setProductList((productList) => [...productList, doc.data()]);
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View>
      <LatestItemList latestItemList={productList} />
    </View>
  );
}
