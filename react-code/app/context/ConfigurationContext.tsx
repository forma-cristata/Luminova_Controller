import React, { createContext, useState, useContext, ReactNode } from 'react';
import Setting from '@/app/interface/setting-interface';

interface ConfigurationContextType {
    currentConfiguration: Setting | null;
    setCurrentConfiguration: (config: Setting | null) => void;
    lastEdited: string | null;
    setLastEdited: (timestamp: string | null) => void;
}

const ConfigurationContext = createContext<ConfigurationContextType | undefined>(undefined);

export function ConfigurationProvider({ children }: { children: ReactNode }) {
    const [currentConfiguration, setCurrentConfiguration] = useState<Setting | null>(null); // Maintains what the shelf should show (NOT PREVIEWS)
    const [lastEdited, setLastEdited] = useState<string | null>(null); // Maintains the state of the carousel index / last edited setting as string

    return (
        <ConfigurationContext.Provider value={{ currentConfiguration, setCurrentConfiguration, lastEdited, setLastEdited }}>
            {children}
        </ConfigurationContext.Provider>
    );
}

export function useConfiguration() {
    const context = useContext(ConfigurationContext);
    if (context === undefined) {
        throw new Error('useConfiguration must be used within a ConfigurationProvider');
    }
    return context;
}