import React, { useCallback, useReducer, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/UI/HeaderButton";
import { useSelector, useDispatch } from "react-redux";
import * as productActions from "../../store/actions/products";
import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";
const FORM_UPDATE = "UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValues: updatedValues,
      inputValidities: updatedValidities,
    };
  }
  return state;
};

const EditProductScreen = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const { productId } = route.params;
  const { type } = route.params;

  const editedProduct = useSelector((state) => {
    return state.products.userProducts.find((product) => {
      return product.id === productId;
    });
  });
  const dispatch = useDispatch();
  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      imageURL: editedProduct ? editedProduct.imageURL : "",
      description: editedProduct ? editedProduct.description : "",
      price: "",
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageURL: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
    },
    formIsValid: editedProduct ? true : false,
  });
  useEffect(() => {
    if (error) {
      Alert.alert("An error occured!", error, [{ text: "Okay" }]);
    }
  }, [error]);
  navigation.setOptions({
    headerTitle: type === "EDIT" ? "Edit Product" : "Add Product",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
          }
          onPress={() => {
            submitHandler();
          }}
        />
      </HeaderButtons>
    ),
  });

  const submitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong input!", "Please check the errors in the form", [
        { text: "Okay" },
      ]);
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      if (editedProduct) {
        await dispatch(
          productActions.updateProduct(
            productId,
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageURL
          )
        );
      } else {
        await dispatch(
          productActions.createProduct(
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.imageURL,
            +formState.inputValues.price
          )
        );
      }
      navigation.goBack();
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, productId, formState]);

  const inputChangeHandler = useCallback(
    (inputIdentifer, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifer,
      });
    },
    [dispatchFormState]
  );
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={10}
      style={{ flex: 1 }}
    >
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="title"
            keyboardType="default"
            label="Title"
            errorText="Please enter a valid title!"
            autoCapitalize="sentences"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.title : ""}
            initiallyValid={!!editedProduct}
            required
          />
          <Input
            id="imageURL"
            keyboardType="default"
            label="Image url"
            errorText="Please enter a valid image url!"
            autoCapitalize="sentences"
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.imageURL : ""}
            initiallyValid={!!editedProduct}
            required
          />
          {editedProduct ? null : (
            <Input
              id="price"
              label="Price"
              errorText="Please enter a valid price!"
              keyboardType="number-pad"
              onInputChange={inputChangeHandler}
              required
              min={0.1}
            />
          )}
          <Input
            id="description"
            keyboardType="default"
            label="Description"
            errorText="Please enter a valid description!"
            keyboardType="default"
            autoCapitalize="sentences"
            multiline
            numberOfLines={3}
            onInputChange={inputChangeHandler}
            initialValue={editedProduct ? editedProduct.description : ""}
            initiallyValid={!!editedProduct}
            required
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditProductScreen;

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
