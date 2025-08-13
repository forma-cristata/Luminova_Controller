import React from 'react';
import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from './SharedStyles';
import { useNavigation } from '@react-navigation/native';

interface BackButtonProps {
    beforePress?: () => void | Promise<void>;
    style?: any;
}

export default function BackButton({ beforePress, style }: BackButtonProps) {
    const navigation = useNavigation();

    const handlePress = async () => {
        if (beforePress) {
            await beforePress();
        }
        navigation.goBack();
    };

    return (
        <TouchableOpacity
            style={styles.backButton}
            onPress={handlePress}
        >
            <Ionicons name="chevron-back-circle-outline" size={32} color="white" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({    
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 10,
    }
});