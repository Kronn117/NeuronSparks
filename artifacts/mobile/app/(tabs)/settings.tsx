import { Feather } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNotes } from '@/context/NotesContext';
import { useTheme } from '@/context/ThemeContext';
import { useColors } from '@/hooks/useColors';

const ACCENT = '#00f5ff';

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { notes, clearAll, restoreLastDeleted, exportNotes, lastDeleted } = useNotes();
  const { theme, setTheme } = useTheme();
  const [exportSuccess, setExportSuccess] = useState(false);

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const isDark = theme === 'dark';

  const handleThemeToggle = async () => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    await setTheme(isDark ? 'light' : 'dark');
  };

  const handleExport = async () => {
    const data = exportNotes();
    try {
      await Clipboard.setStringAsync(data);
      if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2000);
    } catch {
      Alert.alert('Export', 'Notes data (first 500 chars):\n\n' + data.substring(0, 500));
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Notes',
      `This will permanently delete all ${notes.length} notes.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            if (Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            await clearAll();
          },
        },
      ],
    );
  };

  const handleRestore = async () => {
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    const ok = await restoreLastDeleted();
    Alert.alert(ok ? 'Restored' : 'Nothing to restore', ok ? 'Last deleted note has been restored.' : 'No recently deleted note found.');
  };

  const SettingRow = ({
    icon,
    label,
    subtitle,
    onPress,
    danger,
    right,
    isLast,
  }: {
    icon: string;
    label: string;
    subtitle?: string;
    onPress?: () => void;
    danger?: boolean;
    right?: React.ReactNode;
    isLast?: boolean;
  }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.settingRow,
        { borderBottomColor: isLast ? 'transparent' : colors.border, opacity: pressed && onPress ? 0.7 : 1 },
      ]}
    >
      <View style={[styles.settingIconWrap, { backgroundColor: danger ? '#ff335522' : ACCENT + '22' }]}>
        <Feather name={icon as any} size={17} color={danger ? '#ff3355' : ACCENT} />
      </View>
      <View style={styles.settingTextCol}>
        <Text style={[styles.settingLabel, { color: danger ? '#ff3355' : colors.text }]}>{label}</Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
        )}
      </View>
      {right ?? (onPress ? <Feather name="chevron-right" size={16} color={colors.mutedForeground} /> : null)}
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable testID="settings-back" onPress={() => router.back()} style={styles.iconBtn} hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 32 + (Platform.OS === 'web' ? 34 : 0) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionHeader, { color: colors.mutedForeground }]}>APPEARANCE</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon={isDark ? 'moon' : 'sun'}
            label="Dark Mode"
            subtitle={isDark ? 'Cyberpunk dark theme active' : 'Light theme active'}
            isLast
            right={
              <Switch
                testID="theme-toggle"
                value={isDark}
                onValueChange={handleThemeToggle}
                trackColor={{ false: colors.border, true: ACCENT + '66' }}
                thumbColor={isDark ? ACCENT : colors.mutedForeground}
              />
            }
          />
        </View>

        <Text style={[styles.sectionHeader, { color: colors.mutedForeground }]}>DATA</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon={exportSuccess ? 'check' : 'share'}
            label={exportSuccess ? 'Copied to clipboard!' : 'Export Notes'}
            subtitle={`${notes.length} note${notes.length !== 1 ? 's' : ''} as JSON`}
            onPress={handleExport}
          />
          <SettingRow
            icon="rotate-ccw"
            label="Restore Last Deleted"
            subtitle={lastDeleted ? `"${lastDeleted.title || 'Untitled'}"` : 'No recent deletion'}
            onPress={handleRestore}
          />
          <SettingRow
            icon="trash-2"
            label="Clear All Notes"
            subtitle="Permanently delete all notes"
            onPress={handleClearAll}
            danger
            isLast
          />
        </View>

        <Text style={[styles.sectionHeader, { color: colors.mutedForeground }]}>APP INFO</Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SettingRow
            icon="zap"
            label="NeuronSparks"
            subtitle="Version 1.0.0 · Mobile Notes App"
          />
          <SettingRow
            icon="database"
            label="Local Storage"
            subtitle={`${notes.length} note${notes.length !== 1 ? 's' : ''} stored on device`}
            isLast
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  iconBtn: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 17, fontFamily: 'Inter_600SemiBold' },
  content: { paddingTop: 8, paddingHorizontal: 16 },
  sectionHeader: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    letterSpacing: 1.2,
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  card: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
  },
  settingIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingTextCol: { flex: 1, gap: 2 },
  settingLabel: { fontSize: 15, fontFamily: 'Inter_500Medium' },
  settingSubtitle: { fontSize: 12, fontFamily: 'Inter_400Regular' },
});
