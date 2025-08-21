import React from "react";
import InfoButton from "@/src/components/buttons/InfoButton";
import LedToggle from "@/src/components/welcome/LedToggle";
import { useConfiguration } from "@/src/context/ConfigurationContext";

interface HeaderProps {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  disableAnimation?: boolean;
  containerStyle?: object;
}

export default function Header({
  isEnabled,
  setIsEnabled,
  disableAnimation = false,
  containerStyle,
}: HeaderProps) {
  const { isShelfConnected, setIsShelfConnected } = useConfiguration();

  return (
    <>
      <InfoButton />
      <LedToggle
        isShelfConnected={isShelfConnected}
        setIsShelfConnected={setIsShelfConnected}
        isEnabled={isEnabled}
        setIsEnabled={setIsEnabled}
        disableAnimation={disableAnimation}
        containerStyle={containerStyle}
      />
    </>
  );
}
