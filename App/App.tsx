/**
 * FreeLawGen — React Native app for self-represented litigants.
 *
 * A thin client that points at YOUR OWN local LLM (Ollama / llama.cpp / LM
 * Studio) and uses the @freelawgen/court deterministic Court procedure toolkit
 * to draft, name, and count docket-ready pleadings. Everything runs on your
 * machine; the model and your data never leave it.
 *
 * Entry point: loads the local-LLM endpoint settings and switches between the
 * Draft and Settings screens.
 */
import { useEffect, useState } from "react"
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity } from "react-native"
import { DraftScreen } from "./src/components/DraftScreen"
import { SettingsScreen } from "./src/components/SettingsScreen"
import { loadSettings, saveSettings } from "./src/settings"
import type { TLlmSettings } from "./src/llm"

type Tab = "draft" | "settings"

export default function App() {
  const [settings, setSettings] = useState<TLlmSettings | null>(null)
  const [tab, setTab] = useState<Tab>("draft")

  useEffect(() => {
    loadSettings().then(setSettings)
  }, [])

  if (!settings) {
    return (
      <SafeAreaView style={styles.loading}>
        <Text>Loading…</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.brand}>FreeLawGen</Text>
        <Text style={styles.tagline}>Defend yourself in court</Text>
      </View>

      <View style={styles.tabs}>
        <TabButton label="Draft" active={tab === "draft"} onPress={() => setTab("draft")} />
        <TabButton label="Endpoint" active={tab === "settings"} onPress={() => setTab("settings")} />
      </View>

      <View style={styles.body}>
        {tab === "draft" ? (
          <DraftScreen settings={settings} />
        ) : (
          <SettingsScreen
            settings={settings}
            onSave={async (s) => {
              setSettings(s)
              await saveSettings(s)
            }}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string
  active: boolean
  onPress: () => void
}) {
  return (
    <TouchableOpacity style={[styles.tab, active && styles.tabActive]} onPress={onPress}>
      <Text style={[styles.tabText, active && styles.tabTextActive]}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f8fafc" },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "#1e293b",
  },
  brand: { color: "#fff", fontSize: 20, fontWeight: "800" },
  tagline: { color: "#94a3b8", fontSize: 12, marginTop: 2 },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: "#1e293b" },
  tabText: { fontSize: 14, color: "#64748b", fontWeight: "600" },
  tabTextActive: { color: "#1e293b" },
  body: { flex: 1 },
})
