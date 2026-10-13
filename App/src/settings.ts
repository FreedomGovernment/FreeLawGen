/**
 * Settings — persisted local-LLM endpoint config.
 *
 * Everything stays on the user's device: the endpoint URL, API key, and model
 * name are stored in AsyncStorage (local to the device) and never sent anywhere
 * except the user's own LLM endpoint.
 */
import AsyncStorage from "@react-native-async-storage/async-storage"
import { DEFAULT_LLM_SETTINGS, type TLlmSettings } from "./llm"

const KEY = "freelawgen.llm.settings.v1"

export async function loadSettings(): Promise<TLlmSettings> {
  try {
    const raw = await AsyncStorage.getItem(KEY)
    if (!raw) return DEFAULT_LLM_SETTINGS
    const parsed = JSON.parse(raw) as Partial<TLlmSettings>
    return {
      baseUrl: parsed.baseUrl ?? DEFAULT_LLM_SETTINGS.baseUrl,
      apiKey: parsed.apiKey ?? "",
      model: parsed.model ?? DEFAULT_LLM_SETTINGS.model,
    }
  } catch {
    return DEFAULT_LLM_SETTINGS
  }
}

export async function saveSettings(settings: TLlmSettings): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(settings))
}
