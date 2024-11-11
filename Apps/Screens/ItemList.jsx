import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  getDoc,
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "./../../utils/firebaseHelper";
import LatestItemList from "../Components/HomeScreen/LatestItemList";

export default function ItemList() {
  const db = getFirestore(app);
  const { params } = useRoute();
  const [itemList, setItemList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(params.category);
    params && getItemListByCategory();
  }, [params]);

  const getItemListByCategory = async () => {
    setLoading(true);
    setItemList([]);
    const q = query(
      collection(db, "UserPost"),
      where("category", "==", params.category)
    );
    const snapshot = await getDocs(q);
    setLoading(false);
    snapshot.forEach((doc) => {
      console.log(doc.data());
      setItemList((itemList) => [...itemList, doc.data()]);
      setLoading(false);
    });
  };
  return (
    <View>
      {loading ? (
        <ActivityIndicator className="mt-20" size={"large"} color={"green"} />
      ) : itemList?.length > 0 ? (
        <LatestItemList latestItemList={itemList} heading={" "} />
      ) : (
        <Text className="p-5 text-[20px] justify-center text-center text-lime-600 mt-24">
          No Posts Found
        </Text>
      )}
    </View>
  );
}
