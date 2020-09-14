import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerItem,
  DrawerItemList,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { Platform, AsyncStorage } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from "../screens/shop/CartScreen";
import OrdersScreen from "../screens/shop/OrdersScreen";
import UserProductsScreen from "../screens/user/UserProductsScreen";
import EditProductScreen from "../screens/user/EditProductScreen";
import AuthScreen from "../screens/user/AuthScreen";
import * as authActions from "../store/actions/auth";

import { useSelector, useDispatch } from "react-redux";

import Colors from "../constants/Colors";

const defaultNavigationOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : "",
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
};

const Stack = createStackNavigator();

const ProductsNavigator = () => {
  return (
    <Stack.Navigator screenOptions={defaultNavigationOptions}>
      <Stack.Screen
        name="ProductsOverview"
        component={ProductsOverviewScreen}
      />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Auth Screen" component={AuthScreen} />
    </Stack.Navigator>
  );
};

const OrdersNavigator = () => {
  return (
    <Stack.Navigator screenOptions={defaultNavigationOptions}>
      <Stack.Screen name="Orders" component={OrdersScreen} />
    </Stack.Navigator>
  );
};

const AdminNavigator = () => {
  return (
    <Stack.Navigator screenOptions={defaultNavigationOptions}>
      <Stack.Screen name="UserProducts" component={UserProductsScreen} />
      <Stack.Screen name="EditProduct" component={EditProductScreen} />
    </Stack.Navigator>
  );
};

const CustomComponent = (props) => {
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(authActions.logout());
  };
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        onPress={logoutHandler}
        inactiveTintColor={Colors.primary}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      />
    </DrawerContentScrollView>
  );
};
const Drawer = createDrawerNavigator();

const ShopNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContentOptions={{
        activeTintColor: Colors.primary,
      }}
      drawerContent={(props) => <CustomComponent {...props} />}
    >
      <Drawer.Screen
        name="Products"
        component={ProductsNavigator}
        options={{
          drawerIcon: (drawerConfig) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
              size={23}
              color={drawerConfig.color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Orders"
        component={OrdersNavigator}
        options={{
          drawerIcon: (drawerConfig) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-list" : "ios-list"}
              size={23}
              color={drawerConfig.color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Admin"
        component={AdminNavigator}
        options={{
          drawerIcon: (drawerConfig) => (
            <Ionicons
              name={Platform.OS === "android" ? "md-create" : "ios-create"}
              size={23}
              color={drawerConfig.color}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={defaultNavigationOptions}>
      <Stack.Screen name="Auth Screen" component={AuthScreen} />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const userID = useSelector((state) => {
    return state.auth.userId;
  });

  const [isLogged, setIsLogged] = useState(false);
  useEffect(() => {
    if (userID) {
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, [userID]);

  const dispatch = useDispatch();
  // useEffect(() => {
  //   const tryLogin = async () => {
  //     const user = await AsyncStorage.getItem("userData");
  //     if (!user) {
  //       return;
  //     }
  //     const transformedData = JSON.parse(user);
  //     const { token, userId, expiryDate } = transformedData;
  //     const expirationDate = new Date(expiryDate);
  //     if (expirationDate <= new Date() || !token || !userId) {
  //       return;
  //     } else {
  //       setIsLogged(true);
  //       dispatch(authActions.authenticate(userID, token));
  //     }
  //   };
  //   tryLogin();
  // }, []);
  return (
    <NavigationContainer>
      {isLogged ? <ShopNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default MainNavigator;
