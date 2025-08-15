import React, { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
    ScrollView,
    Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, COMMON_STYLES, DIMENSIONS } from "@/src/styles/SharedStyles";
import { FirstTimeUserService } from "@/src/services/FirstTimeUserService";

interface WelcomeTutorialProps {
    visible: boolean;
    onComplete: () => void;
}

interface TutorialPage {
    title: string;
    content: string;
    icon?: string;
    highlight?: string;
}

const tutorialPages: TutorialPage[] = [
    {
        title: "Welcome to Luminova",
        content: "Let's get you started with your LED controller! This quick tutorial will help you understand how to connect and control your LEDs.",
        icon: "sparkles",
    },
    {
        title: "IP Address Setup",
        content: "The IP input field below correlates to LED device. For best results, assign your device a static IP, then enter that IP here.",
        icon: "wifi",
    },
    {
        title: "LED Toggle",
        content: "The toggle switch shows your device status:\n• Green Moon: Device available and off\n• Red Moon: Device not found at the IP given\n• White Sun: Device is connected and on",
        icon: "bulb",
    },
    {
        title: "Info Button",
        content: "Tap the info button in the top-right corner anytime to learn about the app structure, read detailed instructions, and discover all available features.",
        icon: "information-circle",
    },
    {
        title: "Get Started Creating",
        content: "You don't need a connected device to start editing settings! Jump into 'Create' to explore animations, colors, and patterns. Your settings will be saved and ready when you connect your device and emulated here in the meantime.",
        icon: "create",
    },
];

export default function WelcomeTutorial({ visible, onComplete }: WelcomeTutorialProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Reset to first page whenever modal opens
    useEffect(() => {
        if (visible) {
            setCurrentPage(0);
        }
    }, [visible]);

    const handleNext = () => {
        if (currentPage < tutorialPages.length - 1) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentPage(currentPage + 1);
                setIsAnimating(false);
            }, 150);
        } else {
            handleComplete();
        }
    };

    const handlePrevious = () => {
        if (currentPage > 0) {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentPage(currentPage - 1);
                setIsAnimating(false);
            }, 150);
        }
    };

    const handleComplete = async () => {
        await FirstTimeUserService.markTutorialCompleted();
        onComplete();
    };

    const handleSkip = async () => {
        await FirstTimeUserService.markTutorialCompleted();
        onComplete();
    };

    const currentTutorial = tutorialPages[currentPage];
    const isLastPage = currentPage === tutorialPages.length - 1;
    const isFirstPage = currentPage === 0;

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            statusBarTranslucent={true}
        >
            <View style={styles.overlay}>
                <SafeAreaView style={styles.container}>
                    <View style={styles.modalContent}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.pageIndicator}>
                                {currentPage + 1} of {tutorialPages.length}
                            </Text>
                            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                                <Text style={styles.skipText}>Skip</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Content Area - Dynamic Height */}
                        <View style={[
                            styles.dynamicContentArea,
                            currentPage === 0 ? styles.contentAreaWithIcon : styles.contentAreaNoIcon
                        ]}>
                            <View style={[styles.pageContent, isAnimating && styles.animating]}>
                                {/* Icon - Only show on first page */}
                                {currentPage === 0 && currentTutorial.icon ? (
                                    <View style={styles.iconContainer}>
                                        <Image
                                            source={require("@/assets/images/icon.png")}
                                            style={styles.appIcon}
                                            resizeMode="contain"
                                        />
                                    </View>
                                ) : null}

                                {/* Title */}
                                <Text style={styles.title}>{currentTutorial.title}</Text>

                                {/* Content */}
                                <Text style={styles.content}>{currentTutorial.content}</Text>

                            </View>
                        </View>

                        {/* Navigation Footer - Fixed Position */}
                        <View style={styles.fixedFooter}>
                            <View style={styles.singleLineNavigation}>
                                <TouchableOpacity
                                    onPress={handlePrevious}
                                    style={[
                                        styles.navButton,
                                        isFirstPage && styles.navButtonDisabled
                                    ]}
                                    disabled={isFirstPage}
                                >
                                    <Ionicons
                                        name="chevron-back-circle-outline"
                                        size={32}
                                        color={isFirstPage ? "rgba(255,255,255,0.3)" : "white"}
                                    />
                                </TouchableOpacity>

                                {/* Progress Dots - centered */}
                                <View style={styles.dotsContainer}>
                                    {tutorialPages.map((_, index) => (
                                        <View
                                            key={index}
                                            style={[
                                                styles.dot,
                                                index === currentPage && styles.activeDot
                                            ]}
                                        />
                                    ))}
                                </View>

                                <TouchableOpacity
                                    onPress={handleNext}
                                    style={styles.navButton}
                                >
                                    {isLastPage ? (
                                        <Text style={styles.nextButtonText}>Get Started!</Text>
                                    ) : (
                                        <Ionicons
                                            name="chevron-forward-circle-outline"
                                            size={32}
                                            color="white"
                                        />
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: COLORS.BLACK,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: COLORS.WHITE,
        width: "90%",
        minWidth: "90%",
        height: 450, // Fixed height so modal doesn't change size
        padding: 20,
        position: "relative",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    pageIndicator: {
        ...COMMON_STYLES.hintText,
        fontSize: 18,
    },
    skipButton: {
        padding: 8,
    },
    skipText: {
        color: COLORS.WHITE,
        fontFamily: FONTS.CLEAR,
        fontSize: 20,
        opacity: 0.8,
    },
    pageContent: {
        alignItems: "center",
        justifyContent: "flex-start",
        paddingVertical: 10,
    },
    dynamicContentArea: {
        justifyContent: "flex-start",
        marginBottom: 80, // Space for fixed footer
    },
    contentAreaWithIcon: {
        height: 300,
    },
    contentAreaNoIcon: {
        height: 200,
    },
    pageContentWithIcon: {
        height: 300,
    },
    pageContentNoIcon: {
        height: 200,
    },
    animating: {
        opacity: 0.3,
    },
    iconContainer: {
        marginBottom: 20,
        padding: 15,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: COLORS.WHITE,
        borderStyle: "dashed",
        opacity: 0.8,
        alignItems: "center",
        justifyContent: "center",
        width: 90,
        height: 90,
    },
    appIcon: {
        width: 60,
        height: 60,
    },
    title: {
        ...COMMON_STYLES.whiteText,
        fontSize: 34 * DIMENSIONS.SCALE,
        marginBottom: 20,
        textAlign: "center",
    },
    content: {
        color: COLORS.WHITE,
        fontFamily: FONTS.CLEAR,
        fontSize: 22 * DIMENSIONS.SCALE,
        lineHeight: 30 * DIMENSIONS.SCALE,
        textAlign: "center",
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    highlightContainer: {
        alignItems: "center",
        marginTop: 20,
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.WHITE,
        borderStyle: "dashed",
        opacity: 0.7,
    },
    highlightText: {
        color: COLORS.WHITE,
        fontFamily: FONTS.CLEAR,
        fontSize: 18 * DIMENSIONS.SCALE,
        textAlign: "center",
        marginBottom: 8,
    },
    arrowIcon: {
        opacity: 0.8,
    },
    footer: {
        marginTop: 20,
    },
    fixedFooter: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        height: 60,
        justifyContent: "center",
    },
    singleLineNavigation: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    navButton: {
        padding: 12,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 44,
        minHeight: 44,
    },
    navButtonDisabled: {
        opacity: 0.3,
    },
    nextButtonText: {
        color: COLORS.WHITE,
        fontSize: 22 * DIMENSIONS.SCALE,
        fontFamily: FONTS.CLEAR,
    },
    dotsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.WHITE,
        opacity: 0.3,
        marginHorizontal: 4,
    },
    activeDot: {
        opacity: 1,
        transform: [{ scale: 1.2 }],
    },
});
