import { child, get, getDatabase, ref } from "firebase/database";
import { getFirebaseApp } from "../firebaseHelper";
import { setUserName } from "./../../store/userSlice";
import auth from "@react-native-firebase/auth";

export const getUserData = async (userID) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const currentUser = auth().currentUser;

    const userRef = child(dbRef, `user/${userID}`);
    if (currentUser) {
      const snapshot = await get(userRef)
        .ref(`users/${currentUser.uid}/name`)
        .once("value");

      if (snapshot.exists()) {
        const userName = snapshot.val();
        dispatch(setUserName(userName));
        return snapshot.val();
      } else {
        console.log("No name found for this user");
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const setUser = (userData) => {
  return { type: "SET_USER", payload: userData };
};
