import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BackButtonProps {
    onPress: () => void;
}

export default function BackButton({ onPress }: BackButtonProps) {
    return (
        <TouchableOpacity
            style={styles.backButton}
            onPress={onPress}
        >
            <Ionicons name="information-circle-outline" size={32} color="white" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    infoButton: {
        position: 'absolute',
        top: 60,
        right: 20,
        zIndex: 10,
    }
});
