import { getFirebaseApp } from "../firebaseHelper";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { child, getDatabase, set, ref, get } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authSlice, { authenticate } from "./..//../store/authSlice";
import { getUserData } from "./userActions";
// import { setUserName } from "../../store/userSlice";

export const signUp = (fullName, email, address, password, image) => {
  return async (dispatch) => {
    const app = getFirebaseApp();
    const auth = getAuth(app);

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log(result);

      const { uid, stsTokenManager } = result.user;
      const { accessToken, expirationTime } = stsTokenManager;
      const expiryDate = new Date(expirationTime);

      const useData = await createUser(fullName, email, address, image, uid);

      dispatch(authenticate({ token: accessToken, userData: useData }));

      //Save user data and token to storage

      saveToDataStorage(accessToken, uid, expiryDate);
    } catch (error) {
      console.log(error);
      const errorCode = error.code;
      let message = "Something went wrong";

      if (errorCode === "auth/wrong-password") {
        message = "Incorrect password";
      } else if (errorCode === "auth/user-not-found") {
        message = "No user found with this email";
      } else if (errorCode === "auth/invalid-email") {
        message = "Invalid email address";
      } else if (errorCode === "auth/user-disabled") {
        message = "This account has been disabled";
      } else if (errorCode === "auth/too-many-requests") {
        message =
          "Too many unsuccessful login attempts. Please try again later";
      }

      throw new Error(message);
    }
  };
};

export const signIn = (email, password) => {
  return async (dispatch) => {
    const app = getFirebaseApp();
    const auth = getAuth(app);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      const { uid, stsTokenManager } = result.user;
      const { accessToken, expirationTime } = stsTokenManager;
      const expiryDate = new Date(expirationTime);

      const userData = await getUserData(uid);

      dispatch(authenticate({ token: accessToken, userData }));

      saveToDataStorage(accessToken, uid, expiryDate);
    } catch (error) {
      console.log(error);
      const errorCode = error.code;
      let message = "Something went wrong";

      if (errorCode === "auth/wrong-password") {
        message = "Incorrect password";
      } else if (errorCode === "auth/user-not-found") {
        message = "No user found with this email";
      } else if (errorCode === "auth/invalid-email") {
        message = "Invalid email address";
      } else if (errorCode === "auth/user-disabled") {
        message = "This account has been disabled";
      } else if (errorCode === "auth/too-many-requests") {
        message =
          "Too many unsuccessful login attempts. Please try again later";
      }
      throw new Error(message);
    }
  };
};

const createUser = async (fullName, email, address, image, userId) => {
  const userData = {
    fullName: fullName || "",
    email: email || "",
    address: address || "",
    image: image || "",
    userId,
    signUpDate: new Date().toISOString(),
  };

  const cleanedUserData = Object.fromEntries(
    Object.entries(userData).filter(([_, v]) => v != null)
  );

  const dbRef = ref(getDatabase());
  const childRef = child(dbRef, `user/${userId}`);
  await set(childRef, cleanedUserData);
  return cleanedUserData;
};

const saveToDataStorage = (token, userId, expiryDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      userId,
      expiryDate: expiryDate.toISOString(),
    })
  );
};

export const fetchUserName = () => async (dispatch) => {
  const app = getFirebaseApp();
  const auth = getAuth(app);

  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const db = getDatabase(app);
      const userNameRef = ref(db, `user/${currentUser.uid}/fullName`);
      const snapshot = await get(userNameRef);

      if (snapshot.exists()) {
        const userName = snapshot.val();
        dispatch(setUserName(userName));
        console.log("Fetched User Name:", userName);
        return userName;
      } else {
        console.log("No name found for this user");
      }
    } else {
      console.log("No user is signed in");
    }
  } catch (error) {
    console.error("Error fetching user name:", error);
  }
};

export const fetchEmail = () => async (dispatch) => {
  const app = getFirebaseApp();
  const auth = getAuth(app);

  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const db = getDatabase(app);
      const emailRef = ref(db, `user/${currentUser.uid}/email`);
      const snapshot = await get(emailRef);

      if (snapshot.exists()) {
        const email = snapshot.val();
        dispatch(setEmail(email));
        console.log("Fetched Email:", email);
        return email;
      } else {
        console.log("No email found for this user");
      }
    } else {
      console.log("No user is signed in");
    }
  } catch (error) {
    console.error("Error fetching email:", error);
  }
};

export const fetchUserImage = () => async (dispatch) => {
  const app = getFirebaseApp();
  const auth = getAuth(app);

  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const db = getDatabase(app);
      const userImageRef = ref(db, `user/${currentUser.uid}/image`);
      const snapshot = await get(userImageRef);

      if (snapshot.exists()) {
        const userImageURL = snapshot.val();
        dispatch(setUserImage(userImageURL));
        console.log("Fetched image:", userImageURL);
      } else {
        console.log("No image found for this user");
      }
    } else {
      console.log("No user is signed in");
    }
  } catch (error) {
    console.error("Error fetching image:", error);
  }
};

export const setUserName = (userName) => ({
  type: "SET_USER_NAME",
  payload: userName,
});

export const setEmail = (email) => ({
  type: "SET_EMAIL",
  payload: email,
});

export const setUserImage = (userImageURL) => ({
  type: "SET_IMAGE",
  payload: userImageURL,
});

// export const authenticate = authSlice.actions.authenticate;

export default authSlice.reducer;
