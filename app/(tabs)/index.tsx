import React, { useRef } from "react";
import { Alert, FlatList, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import irCommands, { IrCommand } from "@/constants/ir-commands";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { hasIrEmitter, sendIr } from "@/lib/ir";

const powerNames = new Set(["Power On", "Power Off"]);
const brightnessNames = new Set(["Brightness up", "Brightness down"]);
const effectNames = new Set(["Flash", "Strobe", "Fade", "Smooth"]);

const toHex = (value: string) => `#${value}`;

const getReadableTextColor = (hex: string) => {
  const cleaned = hex.replace("#", "");
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.55 ? "#11181C" : "#F6F7F9";
};

const groupCommands = (commands: IrCommand[]) => {
  const power = commands.filter((item) => powerNames.has(item.name));
  const brightness = commands.filter((item) => brightnessNames.has(item.name));
  const effects = commands.filter((item) => effectNames.has(item.name));
  const colors = commands.filter(
    (item) =>
      !powerNames.has(item.name) &&
      !brightnessNames.has(item.name) &&
      !effectNames.has(item.name),
  );

  return [
    { title: "Power", items: power },
    { title: "Brightness", items: brightness },
    { title: "Colors", items: colors },
    { title: "Effects", items: effects },
  ];
};

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? "dark";
  const groups = groupCommands(irCommands);

  const hasEmitterRef = useRef<boolean | null>(null);
  const isSending = useRef(false);

  const getHasEmitter = async () => {
    if (hasEmitterRef.current === null) {
      hasEmitterRef.current = await hasIrEmitter();
    }
    return hasEmitterRef.current;
  };

  const handleSend = async (command: IrCommand) => {
    if (isSending.current) return;
    isSending.current = true;

    console.info("[IR] button pressed", { name: command.name });

    try {
      const hasEmitter = await getHasEmitter();
      if (!hasEmitter) {
        console.warn("[IR] no IR emitter detected");
        Alert.alert(
          "IR transmit failed",
          "No IR emitter detected on this device.",
          [{ text: "OK" }],
        );
        return;
      }

      const ok = await sendIr(command.pattern);
      if (!ok) {
        console.error("[IR] send failed", { name: command.name });
        Alert.alert(
          "IR transmit failed",
          `Failed to send: ${command.name}. Check logs for details.`,
          [{ text: "OK" }],
        );
        return;
      }

      console.info("[IR] send success", { name: command.name });
    } finally {
      isSending.current = false;
    }
  };

  return (
    <ThemedView style={styles.screen} darkColor="#0C0D0E" lightColor="#0C0D0E">
      <View style={styles.header}>
        <ThemedText type="title">RGB LED Remote</ThemedText>
        <View style={styles.divider} />
      </View>

      <FlatList
        data={groups}
        keyExtractor={(group) => group.title}
        contentContainerStyle={styles.listContent}
        renderItem={({ item: group }) => (
          <View style={styles.section}>
            <ThemedText style={styles.sectionLabel}>
              {group.title.toUpperCase()}
            </ThemedText>
            <FlatList
              data={group.items}
              keyExtractor={(item) => item.name}
              numColumns={3}
              scrollEnabled={false}
              columnWrapperStyle={styles.row}
              renderItem={({ item }) => {
                const background = toHex(item.color);
                const textColor = getReadableTextColor(background);

                return (
                  <Pressable
                    onPress={() => handleSend(item)}
                    style={({ pressed }) => [
                      styles.button,
                      { backgroundColor: background },
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <ThemedText
                      style={[styles.buttonLabel, { color: textColor }]}
                      numberOfLines={2}
                    >
                      {item.name}
                    </ThemedText>
                  </Pressable>
                );
              }}
            />
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 10,
  },
  header: {
    marginBottom: 20,
    gap: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#2A2F35",
  },
  listContent: {
    gap: 22,
    paddingBottom: 16,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.4,
    opacity: 0.35,
  },
  row: {
    gap: 8,
  },
  button: {
    flex: 1,
    minHeight: 68,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.8,
  },
  buttonLabel: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.2,
  },
});
