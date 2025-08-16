import type React from "react";
import {
    Keyboard,
    TouchableWithoutFeedback,
    type ViewProps,
} from "react-native";

interface DismissKeyboardViewProps extends ViewProps {
    children: React.ReactNode;
}

const DismissKeyboardView: React.FC<DismissKeyboardViewProps> = ({
    children,
    ...props
}) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <>{children}</>
    </TouchableWithoutFeedback>
);

export default DismissKeyboardView;
