import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

import Card from "../UI/Card";

const ProductItem = ({ title, imageURL, price, onSelect, children }) => {
  return (
    <TouchableOpacity onPress={onSelect} activeOpacity={0.6}>
      <Card style={styles.product}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: imageURL }} />
        </View>

        <View style={styles.details}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.price}>${price.toFixed(2)}</Text>
        </View>
        <View style={styles.actions}>{children}</View>
      </Card>
    </TouchableOpacity>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  product: {
    height: 300,
    margin: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageContainer: {
    width: "100%",
    height: "60%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  details: {
    alignItems: "center",
    height: "17%",
    padding: 10,
  },
  title: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
    marginVertical: 4,
  },
  price: {
    fontFamily: "open-sans",
    fontSize: 14,
    color: "#888",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: "23%",
    paddingHorizontal: 20,
  },
});
