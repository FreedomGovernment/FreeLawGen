/**
 * Metro entry point — registers the FreeLawGen root component.
 * Expo (SDK 54) resolves the app entry here; it must call
 * registerRootComponent with the root App.
 */
import { registerRootComponent } from "expo"

import App from "./App"

// registerRootComponent calls AppRegistry.registerComponent('main', () => App).
// It also ensures the AsyncStorage + other native modules are ready.
registerRootComponent(App)
