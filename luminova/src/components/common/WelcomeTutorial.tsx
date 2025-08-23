import React, { useState, useEffect } from "react";
import {
	Modal,
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	SafeAreaView,
	Image,
	PanResponder,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
	COLORS,
	FONTS,
	COMMON_STYLES,
	DIMENSIONS,
} from "@/src/styles/SharedStyles";
import { FirstTimeUserService } from "@/src/services/FirstTimeUserService";
import LedToggle from "@/src/components/welcome/LedToggle";

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
		content:
			"Let's get you started with your LED controller! This quick tutorial will help you understand how to connect and control your LEDs.",
		icon: "sparkles",
	},
	{
		title: "IP Address Setup",
		content:
			"The IP input field on the home screen correlates to LED device. For best results, assign your device a static IP, then enter that IP here.",
	},
	{
		title: "Power",
		content:
			"The toggle switch shows your device's status. Tap the toggle below to learn the different states of the toggler and their meanings:",
	},
	{
		title: "More Information",
		content:
			"Tap the info button in the top-right corner anytime to learn about the app structure, read detailed instructions, and discover all available features. If you wish to return to this menu, tap `Hello` on the home screen five times.",
	},
	{
		title: "Separation of Concerns",
		content:
			"You don't need a connected device to start editing settings! Jump into 'Create' to explore animations, colors, and patterns. Your settings will be saved and ready when you connect your device and emulated here in the meantime.",
	},
];

export default function WelcomeTutorial({
	visible,
	onComplete,
}: WelcomeTutorialProps) {
	const [currentPage, setCurrentPage] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);

	// Demo toggle state for the tutorial
	const [demoIsShelfConnected, setDemoIsShelfConnected] = useState(true);
	const [demoIsEnabled, setDemoIsEnabled] = useState(false);

	// Pan responder for swipe gestures
	const panResponder = PanResponder.create({
		onStartShouldSetPanResponder: () => true,
		onMoveShouldSetPanResponder: (_evt, gestureState) => {
			// Only respond to horizontal swipes - much more sensitive
			return Math.abs(gestureState.dx) > 10;
		},
		onPanResponderMove: (_evt, gestureState) => {
			// Prevent scrolling interference during horizontal swipes
			return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
		},
		onPanResponderRelease: (_evt, gestureState) => {
			const { dx, dy } = gestureState;

			// iOS-level sensitivity - much lower threshold
			if (Math.abs(dx) > 30 && Math.abs(dy) < 100) {
				if (dx < 0) {
					// Right-to-left swipe - advance to next page
					handleNext();
				} else if (dx > 0) {
					// Left-to-right swipe - go to previous page
					handlePrevious();
				}
			}
		},
	});

	// Demo toggle state descriptions
	const getToggleStateDescription = () => {
		if (!demoIsShelfConnected) {
			return "Device not found at the IP given";
		}
		if (demoIsEnabled) {
			return "Device is connected and on";
		}
		return "Device available and off";
	};

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

	const _handleDemoToggle = () => {
		// Cycle through the three states: connected+off -> connected+on -> disconnected -> back to connected+off
		if (demoIsShelfConnected && !demoIsEnabled) {
			// Green Moon -> White Sun
			setDemoIsEnabled(true);
		} else if (demoIsShelfConnected && demoIsEnabled) {
			// White Sun -> Red Moon
			setDemoIsShelfConnected(false);
			setDemoIsEnabled(false);
		} else {
			// Red Moon -> Green Moon
			setDemoIsShelfConnected(true);
			setDemoIsEnabled(false);
		}
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
			<View style={styles.overlay} {...panResponder.panHandlers}>
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
						<View
							style={[
								styles.dynamicContentArea,
								currentPage === 0
									? styles.contentAreaWithIcon
									: styles.contentAreaNoIcon,
							]}
						>
							<View
								style={[styles.pageContent, isAnimating && styles.animating]}
							>
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

								{/* Demo Toggle - Only show on LED Toggle page (page 2, index 1) */}
								{currentPage === 2 ? (
									<View style={styles.demoToggleContainer}>
										{/* First Row - Connected and Enabled Toggle */}
										<View style={styles.toggleRow}>
											<LedToggle
												isShelfConnected={demoIsShelfConnected}
												setIsShelfConnected={setDemoIsShelfConnected}
												isEnabled={demoIsEnabled}
												setIsEnabled={setDemoIsEnabled}
												disableAnimation={true}
												containerStyle={styles.toggleInlineContainer}
											/>
											<Text style={styles.toggleRowText}>
												{getToggleStateDescription()}
											</Text>
										</View>

										{/* Second Row - Disconnected Toggle */}
										<View style={styles.toggleRow}>
											<LedToggle
												isShelfConnected={false}
												setIsShelfConnected={() => {}} // No-op for demo
												isEnabled={false}
												setIsEnabled={() => {}} // No-op for demo
												disableAnimation={true}
												containerStyle={styles.toggleInlineContainer}
											/>
											<Text style={styles.toggleRowText}>
												Device not found at the given IP
											</Text>
										</View>
									</View>
								) : null}
							</View>
						</View>

						{/* Navigation Footer - Fixed Position */}
						<View style={styles.fixedFooter}>
							<View style={styles.singleLineNavigation}>
								<TouchableOpacity
									onPress={handlePrevious}
									style={[
										styles.navButton,
										isFirstPage && styles.navButtonDisabled,
									]}
									disabled={isFirstPage}
								>
									<Ionicons
										name="chevron-back-circle-outline"
										size={32 * DIMENSIONS.SCALE}
										color={isFirstPage ? "rgba(255,255,255,0.3)" : "white"}
									/>
								</TouchableOpacity>

								{/* Progress Dots - centered */}
								<View style={styles.dotsContainer}>
									{tutorialPages.map((page, index) => (
										<View
											key={`tutorial-dot-${page.title}-${index}`}
											style={[
												styles.dot,
												index === currentPage && styles.activeDot,
											]}
										/>
									))}
								</View>

								<TouchableOpacity onPress={handleNext} style={styles.navButton}>
									{isLastPage ? (
										<Text style={styles.nextButtonText}>Get Started!</Text>
									) : (
										<Ionicons
											name="chevron-forward-circle-outline"
											size={32 * DIMENSIONS.SCALE}
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
		paddingHorizontal: 20 * DIMENSIONS.SCALE,
	},
	modalContent: {
		backgroundColor: COLORS.BLACK,
		borderRadius: 15 * DIMENSIONS.SCALE,
		borderWidth: 2 * DIMENSIONS.SCALE,
		borderColor: COLORS.WHITE,
		width: Math.min(DIMENSIONS.SCREEN_WIDTH * 0.9, 500 * DIMENSIONS.SCALE),
		minWidth: Math.min(DIMENSIONS.SCREEN_WIDTH * 0.85, 400 * DIMENSIONS.SCALE),
		height: Math.max(450 * DIMENSIONS.SCALE, DIMENSIONS.SCREEN_HEIGHT * 0.6),
		maxHeight: DIMENSIONS.SCREEN_HEIGHT * 0.85,
		padding: 20 * DIMENSIONS.SCALE,
		position: "relative",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20 * DIMENSIONS.SCALE,
	},
	pageIndicator: {
		...COMMON_STYLES.hintText,
		fontSize: 18 * DIMENSIONS.SCALE,
	},
	skipButton: {
		padding: 8 * DIMENSIONS.SCALE,
	},
	skipText: {
		color: COLORS.WHITE,
		fontFamily: FONTS.CLEAR,
		fontSize: 20 * DIMENSIONS.SCALE,
		opacity: 0.8,
	},
	pageContent: {
		alignItems: "center",
		justifyContent: "flex-start",
		paddingVertical: 10 * DIMENSIONS.SCALE,
	},
	dynamicContentArea: {
		justifyContent: "flex-start",
		marginBottom: 80 * DIMENSIONS.SCALE, // Space for fixed footer
	},
	contentAreaWithIcon: {
		height: 300 * DIMENSIONS.SCALE,
	},
	contentAreaNoIcon: {
		height: 200 * DIMENSIONS.SCALE,
	},
	animating: {
		opacity: 0.3,
	},
	iconContainer: {
		marginBottom: 20 * DIMENSIONS.SCALE,
		padding: 15 * DIMENSIONS.SCALE,
		borderRadius: 50 * DIMENSIONS.SCALE,
		borderWidth: 1 * DIMENSIONS.SCALE,
		borderColor: COLORS.WHITE,
		borderStyle: "dashed",
		opacity: 0.8,
		alignItems: "center",
		justifyContent: "center",
		width: 90 * DIMENSIONS.SCALE,
		height: 90 * DIMENSIONS.SCALE,
	},
	appIcon: {
		width: 60 * DIMENSIONS.SCALE,
		height: 60 * DIMENSIONS.SCALE,
	},
	title: {
		...COMMON_STYLES.whiteText,
		fontSize: 34 * DIMENSIONS.SCALE,
		marginBottom: 20 * DIMENSIONS.SCALE,
		textAlign: "center",
	},
	content: {
		color: COLORS.WHITE,
		fontFamily: FONTS.CLEAR,
		fontSize: 22 * DIMENSIONS.SCALE,
		lineHeight: 30 * DIMENSIONS.SCALE,
		textAlign: "center",
		marginBottom: 20 * DIMENSIONS.SCALE,
		paddingHorizontal: 10 * DIMENSIONS.SCALE,
	},
	// removed unused styles: pageContentWithIcon, pageContentNoIcon, highlightContainer, highlightText, arrowIcon
	footer: {
		marginTop: 20 * DIMENSIONS.SCALE,
	},
	fixedFooter: {
		position: "absolute",
		bottom: 20 * DIMENSIONS.SCALE,
		left: 20 * DIMENSIONS.SCALE,
		right: 20 * DIMENSIONS.SCALE,
		height: 60 * DIMENSIONS.SCALE,
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
		marginBottom: 20 * DIMENSIONS.SCALE,
	},
	navButton: {
		padding: 12 * DIMENSIONS.SCALE,
		borderRadius: 50 * DIMENSIONS.SCALE,
		alignItems: "center",
		justifyContent: "center",
		minWidth: 44 * DIMENSIONS.SCALE,
		minHeight: 44 * DIMENSIONS.SCALE,
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
		width: 8 * DIMENSIONS.SCALE,
		height: 8 * DIMENSIONS.SCALE,
		borderRadius: 4 * DIMENSIONS.SCALE,
		backgroundColor: COLORS.WHITE,
		opacity: 0.3,
		marginHorizontal: 4 * DIMENSIONS.SCALE,
	},
	activeDot: {
		opacity: 1,
		transform: [{ scale: 1.2 * DIMENSIONS.SCALE }],
	},
	demoToggleContainer: {
		alignItems: "center",
		width: "100%",
	},
	toggleRow: {
		flexDirection: "row",
		alignItems: "center",
		width: "100%",
		paddingHorizontal: 20 * DIMENSIONS.SCALE,
		marginBottom: 6 * DIMENSIONS.SCALE,
	},
	toggleInlineContainer: {
		position: "relative",
		marginRight: 15 * DIMENSIONS.SCALE,
	},
	toggleRowText: {
		color: COLORS.WHITE,
		fontFamily: FONTS.CLEAR,
		fontSize: 16 * DIMENSIONS.SCALE,
		textAlign: "left",
		lineHeight: 20 * DIMENSIONS.SCALE,
		flex: 1,
		paddingLeft: 10 * DIMENSIONS.SCALE,
	},
});
