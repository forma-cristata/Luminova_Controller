import React from "react";
import InfoButton from "@/src/components/buttons/InfoButton";
import LedToggle from "@/src/components/welcome/LedToggle";
import BackButton from "@/src/components/buttons/BackButton";
import { useConfiguration } from "@/src/context/ConfigurationContext";
import { useRoute, type RouteProp } from "@react-navigation/native";
import { View, StyleSheet, type ViewStyle } from "react-native";
import { DIMENSIONS } from "@/src/styles/SharedStyles";
import type { RootStackParamList } from "@/src/screens/index";

interface BackButtonProps {
    beforePress?: () => void | Promise<void>;
    afterPress?: () => void;
    onPress?: () => void;
    style?: ViewStyle;
}

interface HeaderProps {
    isEnabled?: boolean;
    setIsEnabled?: (enabled: boolean) => void;
    disableAnimation?: boolean;
    containerStyle?: ViewStyle;
    backButtonProps?: BackButtonProps;
}

export default function Header({
    isEnabled = false,
    setIsEnabled = () => { },
    disableAnimation = false,
    containerStyle,
    backButtonProps,
}: HeaderProps) {
    const { isShelfConnected, setIsShelfConnected } = useConfiguration();
    const route = useRoute<RouteProp<RootStackParamList>>();
    const routeName = route?.name ?? "";

    const showToggle = routeName === "Welcome";
    const showInfo = routeName !== "Info";

    // Deterministic header sizing (avoid Math.min/Math.max in layout math)
    const topOffset = DIMENSIONS.SCREEN_HEIGHT * 0.005;
    const iconSize = DIMENSIONS.SCREEN_HEIGHT * 0.04;
    const headerHeight = topOffset * 2 + iconSize;

    return (
        <View style={[styles.headerWrapper, { height: headerHeight }, containerStyle]}>
            <View style={[styles.headerBar]}>
                <View style={styles.left}>
                    {showToggle ? (
                        <LedToggle
                            isShelfConnected={isShelfConnected}
                            setIsShelfConnected={setIsShelfConnected}
                            isEnabled={isEnabled}
                            setIsEnabled={setIsEnabled}
                            disableAnimation={disableAnimation}
                        />
                    ) : (
                        <BackButton {...backButtonProps} />
                    )}
                </View>

                <View style={styles.center} />

                <View style={styles.right}>{showInfo ? <InfoButton /> : null}</View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerWrapper: {
        width: "100%",
    },
    headerBar: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: DIMENSIONS.SCREEN_WIDTH * 0.05,
    },
    left: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "center",
    },
    center: {
        flex: 1,
    },
    right: {
        flex: 1,
        alignItems: "flex-end",
        justifyContent: "center",
    },
});
