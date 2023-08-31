import { ThemeProvider } from "./assets/theme/theme";
import AppNavigator from "./AppNavigator";


export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}