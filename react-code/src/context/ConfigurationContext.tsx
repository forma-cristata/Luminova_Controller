import type { Setting } from "@/src/types/SettingInterface";
import React, {
	createContext,
	type ReactNode,
	useContext,
	useState,
} from "react";

interface ConfigurationContextType {
	currentConfiguration: Setting | null;
	setCurrentConfiguration: (config: Setting | null) => void;
	lastEdited: string | null;
	setLastEdited: (timestamp: string | null) => void;
	isShelfConnected: boolean;
	setIsShelfConnected: (connected: boolean) => void;
}

const ConfigurationContext = createContext<
	ConfigurationContextType | undefined
>(undefined);

export function ConfigurationProvider({ children }: { children: ReactNode }) {
	const [currentConfiguration, setCurrentConfiguration] =
		useState<Setting | null>(null);
	const [lastEdited, setLastEdited] = useState<string | null>(null);
	const [isShelfConnected, setIsShelfConnected] = useState<boolean>(false);

	return (
		<ConfigurationContext.Provider
			value={{
				currentConfiguration,
				setCurrentConfiguration,
				lastEdited,
				setLastEdited,
				isShelfConnected,
				setIsShelfConnected,
			}}
		>
			{children}
		</ConfigurationContext.Provider>
	);
}

export function useConfiguration() {
	const context = useContext(ConfigurationContext);
	if (context === undefined) {
		throw new Error(
			"useConfiguration must be used within a ConfigurationProvider",
		);
	}
	return context;
}
