import { Linking, StyleSheet, View, Pressable } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

const REPO_URL = "https://github.com/razzat008/rgb-led-control";

const notes = [
  { emoji: "-", text: "Do what you want with this." },
  { emoji: "-", text: "Tested only on my RN10 Pro (sweet)." },
  { emoji: "-", text: "Vibe-coded — manage expectations accordingly." },
];

export default function AboutScreen() {
  return (
    <ThemedView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="title">About</ThemedText>
        <View style={styles.divider} />
        <ThemedText style={styles.subtitle}>
          Built this because existing apps didn&apos;t work for me.
        </ThemedText>
      </View>

      {/* Repo card */}
      <Pressable
        onPress={() => Linking.openURL(REPO_URL)}
        style={({ pressed }) => [
          styles.repoCard,
          pressed && styles.repoCardPressed,
        ]}
      >
        <View style={styles.repoCardInner}>
          <View style={styles.repoIcon}>
            <ThemedText style={styles.repoIconText}>⭐</ThemedText>
          </View>
          <View style={styles.repoTextGroup}>
            <ThemedText style={styles.repoLabel}>Star on GitHub</ThemedText>
            <ThemedText style={styles.repoUrl}>
              razzat008/rgb-led-control
            </ThemedText>
          </View>
          <ThemedText style={styles.repoArrow}>›</ThemedText>
        </View>
      </Pressable>

      {/* Notes */}
      <View style={styles.notesSection}>
        <ThemedText style={styles.notesSectionLabel}>NOTES</ThemedText>
        <View style={styles.notesList}>
          {notes.map((note, i) => (
            <View key={i} style={styles.noteRow}>
              <ThemedText style={styles.noteEmoji}>{note.emoji}</ThemedText>
              <ThemedText style={styles.noteText}>{note.text}</ThemedText>
            </View>
          ))}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    backgroundColor: "transparent",
  },
  header: {
    marginBottom: 24,
    gap: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#2A2F35",
    marginVertical: 2,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.65,
  },

  // Repo card
  repoCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2A2F35",
    backgroundColor: "#15181C",
    marginBottom: 28,
    overflow: "hidden",
  },
  repoCardPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.985 }],
  },
  repoCardInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  repoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#1E2228",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2F35",
  },
  repoIconText: {
    fontSize: 18,
  },
  repoTextGroup: {
    flex: 1,
    gap: 2,
  },
  repoLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  repoUrl: {
    fontSize: 12,
    opacity: 0.45,
    fontFamily: "monospace",
  },
  repoArrow: {
    fontSize: 22,
    opacity: 0.3,
    marginRight: -2,
  },

  // Notes
  notesSection: {
    gap: 10,
  },
  notesSectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
    opacity: 0.35,
    marginBottom: 2,
  },
  notesList: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2A2F35",
    backgroundColor: "#15181C",
    overflow: "hidden",
  },
  noteRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#1E2228",
  },
  noteEmoji: {
    fontSize: 16,
    width: 22,
    textAlign: "center",
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
    flex: 1,
  },
});
