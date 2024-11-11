import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  getFirestore,
  doc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "./../../utils/firebaseHelper";

export default function EditPost() {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params;
  const db = getFirestore(app);

  const [title, setTitle] = useState(product.title);
  const [description, setDescription] = useState(product.desc);
  const [category, setCategory] = useState(product.category);
  const [docId, setDocId] = useState(null);
  const [price, setPrice] = useState(product.price);
  const [address, setAddress] = useState(product.address);
  const [image, setImage] = useState(product.image);

  useEffect(() => {
    // Fetch the document ID when the component mounts
    fetchDocumentId();
  }, []);

  const fetchDocumentId = async () => {
    try {
      console.log("Fetching document ID for title:", product.title);
      const q = query(
        collection(db, "UserPost"),
        where("title", "==", product.title)
      );
      const snapshot = await getDocs(q);
      console.log("Query snapshot:", snapshot);
      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id;
        console.log("Found document ID:", docId);
        setDocId(docId);
      } else {
        console.log("No matching documents found");
        Alert.alert("Error", "Post not found");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error fetching document ID:", error);
      console.error("Error stack:", error.stack);
      Alert.alert("Error", "Failed to fetch post details: " + error.message);
      navigation.goBack();
    }
  };
  const updatePost = async () => {
    if (!title || !description || !category || !price || !address || !image) {
      console.log("Missing required fields");
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
    console.log("Product:", product);

    if (!docId) {
      console.log("DocId is null or undefined");
      Alert.alert("Error", "Unable to update post. Please try again.");
      return;
    }

    try {
      console.log("Attempting to update document with id:", docId);
      console.log("Update data:", { title, desc: description, category });

      const postRef = doc(db, "UserPost", docId);
      console.log("PostRef:", postRef);

      await updateDoc(postRef, {
        title: title,
        desc: description,
        category: category,
        price: price,
        address: address,
        image: image,
      });
      console.log("Document updated successfully");

      Alert.alert("Success", "Post updated successfully");
      navigation.goBack();
      // navigation.navigate("product-details", {
      //   updatedProduct: {
      //     ...product,
      //     title,
      //     desc: description,
      //     category,
      //     price,
      //     address,
      //     image: image,
      //   },
      //   refresh: true,
      // });
    } catch (error) {
      console.error("Error updating post:", error);
      console.error("Error stack:", error.stack);
      Alert.alert("Error", "Failed to update post: " + error.message);
    }
  };

  return (
    <ScrollView className="bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Edit Post</Text>

      <Text className="font-bold mb-2">Title</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-4"
        value={title}
        onChangeText={setTitle}
      />

      <Text className="font-bold mb-2">Description</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-4"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text className="font-bold mb-2">Category</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-4"
        value={category}
        onChangeText={setCategory}
      />

      <Text className="font-bold mb-2">Price</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-4"
        value={price}
        onChangeText={setPrice}
      />

      <Text className="font-bold mb-2">Location</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-2 mb-4"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity
        className="bg-green-600 p-4 rounded-lg"
        onPress={updatePost}
      >
        <Text className="text-white text-center font-bold text-lg">
          Update Post
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
