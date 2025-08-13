import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert, Linking, Platform} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BackButton from '@/app/components/BackButton';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function Info() {
    const [textColor, setTextColor] = useState("#ffffff");
    useEffect(() => {
        const animationColors = ['#ff0000', '#000000', '#ff4400', '#000000', '#ff6a00', '#000000', '#ff9100', '#000000', '#ffee00', '#000000', '#00ff1e', '#000000', '#00ff44', '#000000', '#00ff95', '#000000', '#00ffff', '#000000', '#0088ff', '#000000', '#0000ff', '#000000', '#8800ff', '#000000', '#d300ff', '#000000', '#ff00BB', '#000000', '#ff0088', '#000000', '#ff0031', '#000000'];
        let colorIndex = 0;

        const colorInterval = setInterval(() => {
            setTextColor(animationColors[colorIndex]);
            colorIndex = (colorIndex + 1) % animationColors.length;
        }, 10);

        return () => {
            clearInterval(colorInterval);
        }
    }, []);

    const sendFeedback = () => {
      const phoneNumber = '720-665-3101';
      const message = 'Feedback for Pixel Controller: ';

      let url = '';
      if (Platform.OS === 'ios') {
        url = `sms:${phoneNumber}&body=${encodeURIComponent(message)}`;
      } else {
        url = `sms:${phoneNumber}?body=${encodeURIComponent(message)}`;
      }

      Linking.canOpenURL(url)
        .then(supported => {
          if (supported) {
            return Linking.openURL(url);
          } else {
            Alert.alert(
              'Error',
              'SMS messaging is not supported on this device'
            );
          }
        })
        .catch(error => {
          console.error('Error opening SMS app:', error);
        });
    };

    const showFeedbackAlert = () => {
      Alert.alert(
        'Send Feedback',
        'Would you like to send feedback via text message?',
        [
          {
            text: 'Cancel',
            style: 'cancel'
          },
          {
            text: 'Send Feedback',
            onPress: sendFeedback
          }
        ],
        { cancelable: true }
      );
    };

    return (     <SafeAreaProvider>            
        <SafeAreaView style={styles.container}>
                <BackButton />
                <TouchableOpacity
                    style={styles.feedbackButton}
                    onPress={showFeedbackAlert}
                >
                    <Ionicons name="chatbubble-outline" size={24} color="white" />
                    <Text style={styles.feedbackText}>Feedback</Text>
                </TouchableOpacity>
            <Text style={[styles.title, {color: textColor}]}>How to Use This App</Text>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <Section title="Home Screen">
                    <BulletPoint text="Wait for the power toggle to synchronize with your device's state - the toggle will then control turning your device on and off." />
                    <BulletPoint text="Access your saved settings and customization options by tapping the 'Create' button." />
                </Section>
                <Section title="Settings Screen">
                    <BulletPoint text="Navigate settings by swiping left or right on the bottom menu." />
                    <BulletPoint text="The selected setting displays in the center of the screen." />
                    <BulletPoint text="Create a new setting by tapping the plus sign (+) at the carousel's end." />
                    <BulletPoint text="Duplicate settings using the copy icon for easy editing." />
                    <BulletPoint text="Remove custom settings using the trash icon." />
                    <BulletPoint text="Broadcast settings to your device by tapping 'Flash'." />
                    <BulletPoint text="Access settings editor by tapping 'Edit'." />
                </Section>
                <Section title="Color Modification">
                    <BulletPoint text="Select a color by tapping it - selected colors appear larger." />
                    <BulletPoint text="Use HSB sliders to adjust Hue, Saturation, and Brightness values." />
                    <BulletPoint text="Enter hex codes manually - values update with slider changes." />
                    <BulletPoint text="Reverse dot order by swiping left or right." />
                    <BulletPoint text="Copy colors between rows by swiping vertically." />
                    <BulletPoint text="Randomize colors using the shuffle button." />
                    <BulletPoint text="Organize colors by hue with the sort button." />
                    <BulletPoint text="Return to original settings using 'Reset'." />
                    <BulletPoint text="Preserve changes by tapping 'Save'." />
                    <BulletPoint text="Preview changes temporarily using 'Preview'." />
                </Section>
                <Section title="Flashing Pattern Modification">
                    <BulletPoint text="Select patterns using the pattern picker." />
                    <BulletPoint text="Match music tempo using the BPM slider." />
                    <BulletPoint text="Return to original settings using 'Reset'." />
                    <BulletPoint text="Save changes by tapping 'Save'." />
                    <BulletPoint text="Preview changes temporarily using 'Preview'." />
                </Section>
                <Section title="Tips & Tricks">
                    <BulletPoint text="Default settings can be modified but not deleted." />
                    <BulletPoint text="Using black can create distinct setting variations.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      " />
                </Section>
            </ScrollView>
        </SafeAreaView>
    </SafeAreaProvider>
    );
}

const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children}
    </View>
);

const BulletPoint = ({ text }: { text: string }) => (
    <View style={styles.bulletPoint}>
        <Text style={styles.bulletDot}>•</Text>
        <Text style={styles.bulletText}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        padding: 20,
    },
    title: {
        color: 'white',
        fontFamily: 'Thesignature',
        fontSize: 50,
        textAlign: 'center',
        marginBottom: 15,
    },
    scrollView: {
        flex: 1,
        width: "100%",
        padding: 15,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        color: 'white',
        fontFamily: 'Clearlight-lJlq',
        fontSize: 36,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
        paddingBottom: 5,
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 10,
        paddingLeft: 10,
    },
    bulletDot: {
        color: 'white',
        fontSize: 18,
        marginRight: 10,
    },
    bulletText: {
        color: 'white',
        fontFamily: 'Clearlight-lJlq',
        fontSize: 26,
        flex: 1,
    },
    feedbackButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
    },
    feedbackText: {
        color: 'white',
        fontFamily: 'Clearlight-lJlq',
        fontSize: 16,
        marginLeft: 5,
    },
});