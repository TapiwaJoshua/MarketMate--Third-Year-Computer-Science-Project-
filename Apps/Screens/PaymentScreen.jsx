import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import zamtelLogo from "./../../assets/Images/zamtel.png";
import airtelLogo from "./../../assets/Images/airtel.png";
import mtnLogo from "./../../assets/Images/mtn.jpg";

export default function PaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params;

  const [price, setPrice] = useState(product.price);
  const [selectedMethod, setSelectedMethod] = useState(null);

  const paymentMethods = [
    {
      id: "mtn",
      name: "MTN Momo",
      icon: mtnLogo,
    },
    {
      id: "airtel",
      name: "Airtel Money",
      icon: airtelLogo,
    },
    {
      id: "zamtel",
      name: "Zamtel Kwacha",
      icon: zamtelLogo,
    },
    {
      id: "visa",
      name: "Visa",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Select Payment Method</Text>

      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.methodButton,
            selectedMethod === method.id && styles.selectedMethod,
          ]}
          onPress={() => setSelectedMethod(method.id)}
        >
          <Image
            source={
              typeof method.icon === "string"
                ? { uri: method.icon }
                : method.icon
            }
            style={styles.methodIcon}
          />
          <Text style={styles.methodName}>{method.name}</Text>
        </TouchableOpacity>
      ))}

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Amount:</Text>
        <Text style={styles.totalAmount}>K {price}</Text>
      </View>

      <TouchableOpacity
        style={[styles.payButton, !selectedMethod && styles.payButtonDisabled]}
        disabled={!selectedMethod}
      >
        <Text style={styles.payButtonText}>Pay Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  methodButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedMethod: {
    borderColor: "#4CAF50",
    borderWidth: 2,
  },
  methodIcon: {
    width: 40,
    height: 40,
    marginRight: 15,
    resizeMode: "contain",
  },
  methodName: {
    fontSize: 18,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  payButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  payButtonDisabled: {
    backgroundColor: "#9E9E9E",
  },
  payButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
