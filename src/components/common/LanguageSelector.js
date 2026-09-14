import React, { useRef, useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useLanguage } from '../../i18n/LanguageContext';

const MENU_WIDTH = 166;
const MENU_HEIGHT = 112;
const SCREEN_PADDING = 12;
const languageOptions = [
  { value: 'en', label: 'English', shortLabel: 'EN' },
  { value: 'hi', label: 'हिंदी', shortLabel: 'हि' },
];

const LanguageSelector = ({ style }) => {
  const { language, setLanguage } = useLanguage();
  const selectorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const selectedLanguage = languageOptions.find(option => option.value === language) || languageOptions[0];

  const showDropdown = () => {
    selectorRef.current?.measureInWindow((x, y, width, height) => {
      const screen = Dimensions.get('window');
      const left = Math.min(Math.max(x + width - MENU_WIDTH, SCREEN_PADDING), screen.width - MENU_WIDTH - SCREEN_PADDING);
      const showAbove = y + height + MENU_HEIGHT + SCREEN_PADDING > screen.height;
      setMenuPosition({ left, top: showAbove ? Math.max(SCREEN_PADDING, y - MENU_HEIGHT - 6) : y + height + 6 });
      setOpen(true);
    });
  };

  const selectLanguage = value => {
    setLanguage(value);
    setOpen(false);
  };

  return <>
    <TouchableOpacity ref={selectorRef} activeOpacity={0.8} accessibilityRole="button" accessibilityLabel="Select language" accessibilityState={{ expanded: open }} style={[styles.selector, style]} onPress={showDropdown}>
      <View style={styles.webIcon}><Ionicons name="globe-outline" size={18} color="#4C7A1E" /></View>
      <Text style={styles.selectedText}>{selectedLanguage.label}</Text>
      <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color="#58704A" />
    </TouchableOpacity>

    <Modal visible={open} transparent animationType="fade" statusBarTranslucent onRequestClose={() => setOpen(false)}>
      <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
        <View style={[styles.menu, menuPosition]}>
          {languageOptions.map((option, index) => {
            const selected = option.value === language;
            return <TouchableOpacity key={option.value} activeOpacity={0.75} style={[styles.option, index > 0 && styles.optionDivider, selected && styles.selectedOption]} onPress={() => selectLanguage(option.value)}>
              <View style={[styles.optionBadge, selected && styles.selectedBadge]}><Text style={[styles.optionBadgeText, selected && styles.selectedBadgeText]}>{option.shortLabel}</Text></View>
              <Text style={[styles.optionText, selected && styles.selectedOptionText]}>{option.label}</Text>
              {selected ? <Ionicons name="checkmark-circle" size={20} color="#4C7A1E" /> : null}
            </TouchableOpacity>;
          })}
        </View>
      </Pressable>
    </Modal>
  </>;
};

const styles = StyleSheet.create({
  selector: {
    width: 142, height: 42, paddingHorizontal: 10, borderWidth: 1, borderColor: '#D8E2D1', borderRadius: 12,
    backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', shadowColor: '#1F3814',
    shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 3,
  },
  webIcon: { width: 28, height: 28, marginRight: 8, borderRadius: 14, backgroundColor: '#EEF5E9', alignItems: 'center', justifyContent: 'center' },
  selectedText: { flex: 1, color: '#24351C', fontSize: 14, fontWeight: '600' },
  backdrop: { flex: 1, backgroundColor: 'rgba(22, 35, 16, 0.08)' },
  menu: {
    position: 'absolute', width: MENU_WIDTH, padding: 6, borderWidth: 1, borderColor: '#DCE6D6', borderRadius: 14,
    backgroundColor: '#FFFFFF', shadowColor: '#162310', shadowOpacity: 0.16, shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 }, elevation: 10,
  },
  option: { minHeight: 49, paddingHorizontal: 9, borderRadius: 9, flexDirection: 'row', alignItems: 'center' },
  optionDivider: { marginTop: 2 },
  selectedOption: { backgroundColor: '#F0F7EB' },
  optionBadge: { width: 29, height: 29, marginRight: 10, borderRadius: 8, backgroundColor: '#F2F3F1', alignItems: 'center', justifyContent: 'center' },
  selectedBadge: { backgroundColor: '#4C7A1E' },
  optionBadgeText: { color: '#667260', fontSize: 11, fontWeight: '700' },
  selectedBadgeText: { color: '#FFFFFF' },
  optionText: { flex: 1, color: '#2A3425', fontSize: 14, fontWeight: '500' },
  selectedOptionText: { color: '#3F6818', fontWeight: '700' },
});

export default LanguageSelector;
