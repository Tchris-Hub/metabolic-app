import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../context/ThemeContext";
import { ToastProvider } from "../contexts/ToastContext";
import Toast from "../component/ui/Toast";
import { Provider } from "react-redux";
import { store } from "../store/store";
import { useDeepLinkHandler } from "../hooks/useDeepLinkHandler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

/**
 * Component that initializes the deep link handler for OAuth callbacks.
 * Must be rendered inside AuthProvider to access auth context.
 * Requirements: 2.3, 3.1
 */
function DeepLinkHandler() {
  useDeepLinkHandler();
  return null;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <DeepLinkHandler />
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              />
              <Toast />
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
