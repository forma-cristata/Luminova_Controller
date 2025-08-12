import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InfoButtonProps {
    onPress: () => void;
}

export default function InfoButton({ onPress }: InfoButtonProps) {
    return (
        <TouchableOpacity
            style={styles.infoButton}
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
