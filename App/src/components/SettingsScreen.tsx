/**
 * SettingsScreen — configure the user's OWN local LLM endpoint.
 *
 * FreeLawGen never calls a hosted LLM. The user points the app at a local
 * endpoint (Ollama / llama.cpp / LM Studio), all of which expose the
 * OpenAI-compatible /chat/completions API. The config is stored on-device.
 */
import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from "react-native"
import type { TLlmSettings } from "../llm"

interface Props {
  settings: TLlmSettings
  onSave: (s: TLlmSettings) => void
}

const PRESETS: { label: string; baseUrl: string; model: string }[] = [
  { label: "Ollama (localhost)", baseUrl: "http://localhost:11434/v1", model: "llama3.1" },
  { label: "llama.cpp (localhost)", baseUrl: "http://localhost:8080/v1", model: "local-model" },
  { label: "LM Studio (localhost)", baseUrl: "http://localhost:1234/v1", model: "local-model" },
]

export function SettingsScreen({ settings, onSave }: Props) {
  const [baseUrl, setBaseUrl] = useState(settings.baseUrl)
  const [apiKey, setApiKey] = useState(settings.apiKey)
  const [model, setModel] = useState(settings.model)
  const [showKey, setShowKey] = useState(false)

  function save() {
    onSave({ baseUrl: baseUrl.trim(), apiKey: apiKey.trim(), model: model.trim() })
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Local LLM endpoint</Text>
      <Text style={styles.subtitle}>
        Point FreeLawGen at a model running on YOUR device or LAN. Nothing is
        sent to a hosted service — the prompt and draft never leave your machine.
      </Text>

      <Text style={styles.presetsLabel}>Presets</Text>
      <View style={styles.row}>
        {PRESETS.map((p) => (
          <TouchableOpacity
            key={p.label}
            style={styles.presetBtn}
            onPress={() => {
              setBaseUrl(p.baseUrl)
              setModel(p.model)
            }}
          >
            <Text style={styles.presetText} numberOfLines={2}>
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Base URL (exposes /chat/completions)</Text>
      <TextInput
        style={styles.input}
        value={baseUrl}
        onChangeText={setBaseUrl}
        placeholder="http://192.168.x.x:11434/v1"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
      />

      <Text style={styles.label}>Model name / tag</Text>
      <TextInput
        style={styles.input}
        value={model}
        onChangeText={setModel}
        placeholder="llama3.1"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <View style={styles.row}>
        <Text style={styles.label}>API key (optional for local)</Text>
        <TouchableOpacity onPress={() => setShowKey((v) => !v)}>
          <Text style={styles.link}>{showKey ? "Hide" : "Show"}</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        value={apiKey}
        onChangeText={setApiKey}
        placeholder="•••• (blank for local servers)"
        secureTextEntry={!showKey}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity style={styles.saveBtn} onPress={save}>
        <Text style={styles.saveText}>Save endpoint</Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        Tip: from a phone, use your machine's LAN IP (e.g.
        http://192.168.x.x:11434/v1), not localhost.
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 12 },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { fontSize: 14, color: "#64748b", lineHeight: 20 },
  presetsLabel: { fontSize: 13, fontWeight: "600", color: "#64748b", marginTop: 8 },
  row: { flexDirection: "row", gap: 8, alignItems: "center" },
  presetBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  presetText: { fontSize: 12, color: "#334155", textAlign: "center" },
  label: { fontSize: 13, fontWeight: "600", color: "#334155", marginTop: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  link: { color: "#2563eb", fontSize: 13, fontWeight: "600" },
  saveBtn: {
    marginTop: 16,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  note: { fontSize: 12, color: "#94a3b8", marginTop: 8, lineHeight: 17 },
})
