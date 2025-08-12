import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');
export const scale = Math.min(width, height) / 375;

export const COLORS = {
    BLACK: '#000000',
    WHITE: '#ffffff',
    BORDER: '#ffffff',
    DISABLED_OPACITY: 0.5,
    PLACEHOLDER: '#666',
    ERROR: '#ff0000',
};

export const FONTS = {
    SIGNATURE: 'Thesignature',
    CLEAR: 'Clearlight-lJlq',
};

export const DIMENSIONS = {
    SCREEN_WIDTH: width,
    SCREEN_HEIGHT: height,
    SCALE: scale,
};

export const COMMON_STYLES = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.BLACK,
        alignItems: 'center',
    },

    backButton: {
        height: height / 20,
        width: '100%',
    },

    backButtonText: {
        color: COLORS.WHITE,
        fontSize: 30 * scale,
    },

    whiteText: {
        color: COLORS.WHITE,
        fontFamily: FONTS.SIGNATURE,
        textAlign: 'center',
    },

    styleAButton: {
        backgroundColor: COLORS.BLACK,
        borderRadius: 10,
        paddingVertical: 8 * scale,
        paddingHorizontal: 15 * scale,
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: COLORS.WHITE,
        width: '30%',
    },

    styleADisabledButton: {
        backgroundColor: COLORS.BLACK,
        borderRadius: 10,
        paddingVertical: 8 * scale,
        paddingHorizontal: 15 * scale,
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: COLORS.WHITE,
        width: '30%',
        opacity: COLORS.DISABLED_OPACITY,
    },

    buttonText: {
        color: COLORS.WHITE,
        fontSize: 25 * scale,
        fontFamily: FONTS.CLEAR,
        letterSpacing: 2,
    },

    sliderContainer: {
        width: width * 0.85,
        marginTop: scale * 20,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: COLORS.WHITE,
        padding: 15 * scale,
        borderRadius: 10,
    },

    sliderText: {
        color: COLORS.WHITE,
        fontSize: 22 * scale,
        fontFamily: FONTS.CLEAR,
        letterSpacing: 2,
    },

    buttonContainer: {
        width: width * 0.85,
        marginTop: scale * 20,
    },

    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8 * scale,
    },

    // Additional button styles for specific use cases
    wideButton: {
        backgroundColor: COLORS.BLACK,
        borderRadius: 10,
        paddingVertical: 10 * scale,
        paddingHorizontal: 20 * scale,
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: COLORS.WHITE,
        width: '45%',
    },

    welcomeButton: {
        backgroundColor: COLORS.BLACK,
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: COLORS.WHITE,
        marginBottom: '25%',
    },
});
