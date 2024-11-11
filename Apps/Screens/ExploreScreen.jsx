import { ScrollView, Text, RefreshControl } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import LatestItemList from "../Components/HomeScreen/LatestItemList";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  orderBy,
} from "firebase/firestore";
import { app } from "./../../utils/firebaseHelper";

export default function ExploreScreen() {
  const db = getFirestore(app);

  const [productList, setProductList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getAllProducts();
  }, []);

  const getAllProducts = async () => {
    setProductList([]);
    const q = query(collection(db, "UserPost"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      setProductList((productList) => [...productList, doc.data()]);
    });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAllProducts().then(() => setRefreshing(false));
  }, []);

  return (
    <ScrollView
      className="p-5 mt-10 py-8"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text className="text-[24px] font-bold text-green-500">Explore More</Text>
      <LatestItemList latestItemList={productList} />
    </ScrollView>
  );
}
