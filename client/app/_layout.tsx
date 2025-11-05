import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { Provider } from "react-redux";
import { store } from "../store/store";
import "./global.css";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}
