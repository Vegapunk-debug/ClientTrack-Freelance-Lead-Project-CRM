import { NavigationContainer } from "@react-navigation/native";
import { useContext } from "react";
import { View, ActivityIndicator } from "react-native";
import { AuthContext } from "../context/AuthContext.jsx";

import TabNavigator from "./TabNavigator.jsx";
import AuthNavigator from "./AuthNavigator.jsx";

export default function AppNavigator() {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? <TabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
