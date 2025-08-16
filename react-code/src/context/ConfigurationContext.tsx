import React from "react";
import type { Setting } from "@/src/types/SettingInterface";
import { createContext, type ReactNode, useContext, useState } from "react";

interface ConfigurationContextType {
	currentConfiguration: Setting | null;
	setCurrentConfiguration: (config: Setting | null) => void;
	lastEdited: string | null;
	setLastEdited: (timestamp: string | null) => void;
	isShelfConnected: boolean;
	setIsShelfConnected: (connected: boolean) => void;
	settings: Setting[];
	setSettings: (settings: Setting[]) => void;
	hasChanges: boolean;
	setHasChanges: (hasChanges: boolean) => void;
}

const ConfigurationContext = createContext<
	ConfigurationContextType | undefined
>(undefined);

export { ConfigurationContext };

export function ConfigurationProvider({ children }: { children: ReactNode }) {
	const [currentConfiguration, setCurrentConfiguration] =
		useState<Setting | null>(null);
	const [lastEdited, setLastEdited] = useState<string | null>(null);
	const [isShelfConnected, setIsShelfConnected] = useState<boolean>(false);
	const [settings, setSettings] = useState<Setting[]>([]);
	const [hasChanges, setHasChanges] = useState(false);

	return (
		<ConfigurationContext.Provider
			value={{
				currentConfiguration,
				setCurrentConfiguration,
				lastEdited,
				setLastEdited,
				isShelfConnected,
				setIsShelfConnected,
				settings,
				setSettings,
				hasChanges,
				setHasChanges,
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
