import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';

// Define the flashing pattern options
const FLASHING_PATTERNS = [
  { id: "0", name: "Blender" },
  { id: "1", name: "Christmas" },
  { id: "2", name: "Comfort Song" },
  { id: "3", name: "Funky" },
  { id: "4", name: "Mold" },
  { id: "5", name: "Progressive" },
  { id: "6", name: "Still Effect" },
  { id: "7", name: "Strobe Change" },
  { id: "8", name: "Techno" },
  { id: "9", name: "Trace Many" },
  { id: "10", name: "Trace One" },
  { id: "11", name: "Trance" },
  { id: "default", name: "Color" }
];

const { width, height } = Dimensions.get('window');
const scale = Math.min(width, height) / 375; // Base scale factor

export default function Picker({ navigation, setting, selectedPattern, setSelectedPattern }: any) {

  const handlePatternSelect = (patternId: string) => {
    setSelectedPattern(patternId);
    // Update the setting object
    setting.flashingPattern = patternId;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Flashing Pattern</Text>
      <View style={styles.pickerContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {FLASHING_PATTERNS.map((pattern) => (
            <TouchableOpacity
              key={pattern.id}
              style={[
                styles.patternOption,
                selectedPattern === pattern.id && styles.selectedOption
              ]}
              onPress={() => handlePatternSelect(pattern.id)}
            >
              <Text style={[
                styles.patternText,
                selectedPattern === pattern.id && styles.selectedText
              ]}>
                {pattern.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  label: {
    color: 'white',
    fontSize: 18 * scale,
    fontFamily: "Clearlight-lJlq",
    marginBottom: 8 * scale,
  },
  pickerContainer: {
    height: 150 * scale,
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingVertical: 5 * scale,
  },
  patternOption: {
    paddingVertical: 12 * scale,
    paddingHorizontal: 15 * scale,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  selectedOption: {
    backgroundColor: '#333',
  },
  patternText: {
    color: 'white',
    fontSize: 16 * scale,
    textAlign: 'center',
    fontFamily: "Clearlight-lJlq",
  },
  selectedText: {
    color: '#ff0000',
  }
});