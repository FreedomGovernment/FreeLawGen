/**
 * DraftScreen — the core flow for a self-represented litigant:
 *
 *   1. Pick a document type, court level, and docket tag.
 *   2. Describe your situation in plain language (the facts you want in the doc).
 *   3. "Draft with my local model" → the app asks YOUR local LLM to draft the
 *      pleading as Markdown. Nothing leaves your machine.
 *   4. Review + edit the draft. The docket filename + word count update live
 *      via the @freelawgen/court toolkit (deterministic, like a real filing).
 *
 * The draft is a starting point — the user edits it and files it through their
 * court. FreeLawGen is a drafting aid, not legal advice.
 */
import { useMemo, useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native"
import { draftPleading, type TLlmSettings } from "../llm"
import {
  buildDocketNames,
  countWords,
  courtLevels,
  validateTag,
  defaultRules,
} from "../court"

const DOC_TYPES = [
  "Complaint",
  "Answer",
  "Motion",
  "Brief",
  "Petition",
  "Order",
  "Other",
] as const

interface Props {
  settings: TLlmSettings
}

export function DraftScreen({ settings }: Props) {
  const [docType, setDocType] = useState<string>("Complaint")
  const [level, setLevel] = useState<string>("Local")
  const [tag, setTag] = useState<string>("OriginalComplaint")
  const [facts, setFacts] = useState("")
  const [draft, setDraft] = useState("")
  const [drafting, setDrafting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const wordCount = useMemo(() => countWords(draft), [draft])

  const docketNames = useMemo(
    () => {
      try {
        const n = buildDocketNames({ level, tag })
        return { docketFile: n.docketFile, caseFolder: n.caseFolder, error: undefined as string | undefined }
      } catch (e) {
        return { docketFile: "", caseFolder: "", error: e instanceof Error ? e.message : String(e) }
      }
    },
    [level, tag],
  )

  async function handleDraft() {
    if (!facts.trim()) {
      Alert.alert("Describe your situation first", "Tell the app what happened, in your own words.")
      return
    }
    setDrafting(true)
    setError(null)
    try {
      const res = await draftPleading(settings, docType, facts)
      setDraft(res.content)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setDrafting(false)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Draft a document</Text>
      <Text style={styles.subtitle}>
        Your local model drafts it; you edit and file it. Not legal advice.
      </Text>

      {/* Document type */}
      <Text style={styles.label}>Document type</Text>
      <View style={styles.chipRow}>
        {DOC_TYPES.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.chip, docType === t && styles.chipActive]}
            onPress={() => setDocType(t)}
          >
            <Text style={[styles.chipText, docType === t && styles.chipTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Court level */}
      <Text style={styles.label}>Court level</Text>
      <View style={styles.chipRow}>
        {courtLevels.map((l) => (
          <TouchableOpacity
            key={l.level}
            style={[styles.chip, level === l.level && styles.chipActive]}
            onPress={() => setLevel(l.level)}
          >
            <Text style={[styles.chipText, level === l.level && styles.chipTextActive]}>
              {l.level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Docket tag */}
      <Text style={styles.label}>Docket tag</Text>
      <TextInput
        style={styles.input}
        value={tag}
        onChangeText={setTag}
        placeholder="e.g. OriginalComplaint"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {docketNames.error ? (
        <Text style={styles.errorText}>{docketNames.error}</Text>
      ) : (
        <Text style={styles.filename}>→ {docketNames.docketFile}</Text>
      )}

      {/* Facts */}
      <Text style={styles.label}>Your situation (plain language)</Text>
      <TextInput
        style={[styles.input, styles.facts]}
        value={facts}
        onChangeText={setFacts}
        placeholder="What happened? Who, what, when, where. Be factual. Use [PLACEHOLDER] for anything you don't know yet."
        multiline
        textAlignVertical="top"
      />

      <TouchableOpacity
        style={[styles.draftBtn, drafting && styles.draftBtnDisabled]}
        onPress={handleDraft}
        disabled={drafting}
      >
        {drafting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.draftText}>Draft with my local model</Text>
        )}
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Draft output */}
      {draft ? (
        <View>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Draft (edit freely)</Text>
            <Text style={styles.wordCount}>{wordCount.toLocaleString()} words</Text>
          </View>
          <TextInput
            style={[styles.input, styles.draftBox]}
            value={draft}
            onChangeText={setDraft}
            multiline
            textAlignVertical="top"
          />
          <Text style={styles.filename}>
            Case folder: {docketNames.caseFolder}
          </Text>
          <Text style={styles.note}>
            Copy this into your court's filing system, or export it with your
            local server. The filename is deterministic — it matches what the
            court expects.
          </Text>
        </View>
      ) : null}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 10 },
  title: { fontSize: 22, fontWeight: "700" },
  subtitle: { fontSize: 14, color: "#64748b", lineHeight: 20 },
  label: { fontSize: 13, fontWeight: "600", color: "#334155", marginTop: 8 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  chipActive: { backgroundColor: "#1e293b", borderColor: "#1e293b" },
  chipText: { fontSize: 13, color: "#334155" },
  chipTextActive: { color: "#fff", fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: "#fff",
  },
  facts: { minHeight: 120 },
  filename: { fontSize: 12, color: "#2563eb", fontFamily: "monospace", marginTop: 4 },
  errorText: { fontSize: 13, color: "#dc2626", lineHeight: 18 },
  draftBtn: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
  },
  draftBtnDisabled: { opacity: 0.6 },
  draftText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  wordCount: { fontSize: 13, color: "#64748b", fontWeight: "600" },
  draftBox: { minHeight: 260 },
  note: { fontSize: 12, color: "#94a3b8", marginTop: 8, lineHeight: 17 },
})
