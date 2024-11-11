import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import Header from "./../Components/HomeScreen/Header";
import Slider from "../Components/HomeScreen/Slider";
import { getFirebaseApp } from "../../utils/firebaseHelper";
import { Ionicons } from "@expo/vector-icons";

import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";
import { app } from "../../utils/firebaseHelper";
import Categories from "../Components/HomeScreen/Categories";
import LatestItemList from "../Components/HomeScreen/LatestItemList";

export default function HomeScreen() {
  const db = getFirestore(app);
  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [latestItemList, setLatestItemList] = useState([]);
  const [filteredItemList, setFilteredItemList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    filterItems();
  }, [searchQuery, latestItemList]);

  const fetchAllData = async () => {
    await Promise.all([getSliders(), getCategoryList(), getLatestItemList()]);
  };

  const getSliders = async () => {
    setSliderList([]);
    const querySnapshop = await getDocs(collection(db, "Sliders"));
    querySnapshop.forEach((doc) => {
      setSliderList((sliderList) => [...sliderList, doc.data()]);
    });
  };

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

  const getLatestItemList = async () => {
    setLatestItemList([]);
    const q = query(collection(db, "UserPost"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log("Docs: ", doc.data());
      setLatestItemList((latestItemList) => [...latestItemList, doc.data()]);
    });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchAllData().then(() => setRefreshing(false));
  }, []);

  const filterItems = () => {
    if (searchQuery.trim() === "") {
      setFilteredItemList(latestItemList);
    } else {
      const filtered = latestItemList.filter((item) => {
        const title = item.title?.toLowerCase() || "";
        const description = item.description?.toLowerCase() || "";
        const query = searchQuery.toLowerCase();

        return title.includes(query) || description.includes(query);
      });
      setFilteredItemList(filtered);
    }
  };

  const handleSearch = () => {
    filterItems();
  };

  return (
    <ScrollView
      className="py-12 px-8 bg-green-50 flex-1"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Header />
      <View className="p-3 px-5 flex flex-row items-center mt-5 bg-green-100 rounded-full border-[2px] border-green-500">
        <TouchableOpacity onPress={handleSearch}>
          <Ionicons name="search" size={24} color="green" />
        </TouchableOpacity>
        <TextInput
          placeholder="Search"
          className="ml-3 text-[18px]"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {searchQuery.trim() === "" ? (
        <>
          <Slider sliderList={sliderList} />
          <Categories categoryList={categoryList} />
        </>
      ) : null}
      {filteredItemList.length > 0 ? (
        <LatestItemList
          latestItemList={filteredItemList}
          heading={
            searchQuery.trim() === "" ? "Latest Items" : "Search Results"
          }
        />
      ) : (
        <Text className="text-center text-gray-500 mt-4">No results found</Text>
      )}
    </ScrollView>
  );
}
