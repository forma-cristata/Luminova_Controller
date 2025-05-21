import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';

// Define the flashing pattern options
const FLASHING_PATTERNS = [
  { id: "8", name: "Berghain Bitte" },
  { id: "5", name: "Cortez" },
  { id: "4", name: "Decay" },
  { id: "3", name: "Feel the Funk" },
  { id: "9", name: "Lapis Lazuli" },
  { id: "10", name: "Medusa" },
  { id: "2", name: "The Piano Man" },
  { id: "1", name: "Smolder" },
  { id: "11", name: "State of Trance" },
  { id: "6", name: "Still" },
  { id: "0", name: "Stuck in a Blender" },
  { id: "7", name: "The Underground" },
];

/*
* Berghain
* Cortez
* Decay
* Feel the Funk
* Lapis Lazuli
* Medusa
* The Piano Man
* Smolder
* State of Trance
* Still
* Stuck
* The Underground
* */


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
{/*
      <Text style={styles.label}>Flashing Pattern</Text>
*/}
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
    color: 'darkgray',
    fontSize: 25 * scale,
    textAlign: 'center',
    fontFamily: "Clearlight-lJlq",
  },
  selectedText: {
    color: '#ffffff',
  }
});