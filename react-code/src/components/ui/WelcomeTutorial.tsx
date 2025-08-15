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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, FONTS, COMMON_STYLES, DIMENSIONS } from "@/src/styles/SharedStyles";
import Button from "@/src/components/ui/buttons/Button";
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
        content: "Let's get you started with your LED controller! This quick tutorial will help you understand how to connect and control your device.",
        icon: "sparkles",
    },
    {
        title: "IP Address Setup",
        content: "The IP input field below is for device detection. Your Luminova device will connect to any available spot on your router. For best results, set your device to a static IP address in your router settings, then enter that IP here.",
        icon: "wifi",
        highlight: "ip",
    },
    {
        title: "LED Toggle Explained",
        content: "The toggle switch shows your device status:\n\n• Green/On: Device connected and LEDs active\n• Red/Off: Device connected but LEDs off\n• Gray: Device not connected or offline",
        icon: "bulb",
        highlight: "toggle",
    },
    {
        title: "Info Button",
        content: "Tap the info button (ℹ) in the top-left corner anytime to learn about the app structure, read detailed instructions, and discover all available features.",
        icon: "information-circle",
        highlight: "info",
    },
    {
        title: "Get Started Creating",
        content: "You don't need a connected device to start editing settings! Jump into 'Create' to explore animations, colors, and patterns. Your settings will be saved and ready when you connect your device.",
        icon: "create",
        highlight: "create",
    },
];

export default function WelcomeTutorial({ visible, onComplete }: WelcomeTutorialProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

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

                        {/* Content Area */}
                        <ScrollView
                            contentContainerStyle={styles.contentContainer}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={[styles.pageContent, isAnimating && styles.animating]}>
                                {/* Icon */}
                                {currentTutorial.icon ? (
                                    <View style={styles.iconContainer}>
                                        <Ionicons
                                            name={currentTutorial.icon as any}
                                            size={60}
                                            color={COLORS.WHITE}
                                        />
                                    </View>
                                ) : null}

                                {/* Title */}
                                <Text style={styles.title}>{currentTutorial.title}</Text>

                                {/* Content */}
                                <Text style={styles.content}>{currentTutorial.content}</Text>

                                {/* Highlight indicator */}
                                {currentTutorial.highlight ? (
                                    <View style={styles.highlightContainer}>
                                        <Text style={styles.highlightText}>
                                            Look for the {currentTutorial.highlight} below
                                        </Text>
                                        <Ionicons
                                            name="arrow-down"
                                            size={24}
                                            color={COLORS.WHITE}
                                            style={styles.arrowIcon}
                                        />
                                    </View>
                                ) : null}
                            </View>
                        </ScrollView>

                        {/* Navigation Footer */}
                        <View style={styles.footer}>
                            <View style={styles.buttonRow}>
                                <TouchableOpacity
                                    onPress={handlePrevious}
                                    style={[
                                        styles.navButton,
                                        isFirstPage && styles.navButtonDisabled
                                    ]}
                                    disabled={isFirstPage}
                                >
                                    <Text style={[
                                        styles.navButtonText,
                                        isFirstPage && styles.navButtonTextDisabled
                                    ]}>
                                        Previous
                                    </Text>
                                </TouchableOpacity>

                                <Button
                                    title={isLastPage ? "Get Started!" : "Next"}
                                    onPress={handleNext}
                                    variant="secondary"
                                    textStyle={styles.nextButtonText}
                                />
                            </View>

                            {/* Progress Dots */}
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
        maxWidth: 350,
        maxHeight: "75%",
        padding: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    pageIndicator: {
        ...COMMON_STYLES.hintText,
        fontSize: 14,
    },
    skipButton: {
        padding: 8,
    },
    skipText: {
        color: COLORS.WHITE,
        fontFamily: FONTS.CLEAR,
        fontSize: 16,
        opacity: 0.8,
    },
    contentContainer: {
        flexGrow: 1,
        paddingBottom: 10,
    },
    pageContent: {
        alignItems: "center",
        minHeight: 250,
        justifyContent: "flex-start",
        paddingVertical: 10,
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
        opacity: 0.8,
    },
    title: {
        ...COMMON_STYLES.whiteText,
        fontSize: 28 * DIMENSIONS.SCALE,
        marginBottom: 20,
        textAlign: "center",
    },
    content: {
        color: COLORS.WHITE,
        fontFamily: FONTS.CLEAR,
        fontSize: 18 * DIMENSIONS.SCALE,
        lineHeight: 26 * DIMENSIONS.SCALE,
        textAlign: "center",
        marginBottom: 20,
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
        fontSize: 14 * DIMENSIONS.SCALE,
        textAlign: "center",
        marginBottom: 8,
    },
    arrowIcon: {
        opacity: 0.8,
    },
    footer: {
        marginTop: 20,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    navButton: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.WHITE,
        opacity: 0.8,
        minWidth: 80,
        alignItems: "center",
    },
    navButtonDisabled: {
        opacity: 0.3,
        borderColor: COLORS.WHITE,
    },
    navButtonText: {
        color: COLORS.WHITE,
        fontFamily: FONTS.CLEAR,
        fontSize: 16 * DIMENSIONS.SCALE,
    },
    navButtonTextDisabled: {
        opacity: 0.5,
    },
    nextButtonText: {
        fontSize: 18 * DIMENSIONS.SCALE,
        fontFamily: FONTS.CLEAR,
    },
    dotsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
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
