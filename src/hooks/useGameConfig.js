import { useEffect, useState } from 'react';
import defaultConfig from '../data/gameConfig.json';

function getConfig() {
    const storedConfig = localStorage.getItem('config');
    return storedConfig ? JSON.parse(storedConfig) : defaultConfig;
}

function useGameConfig() {
    // Retrieve config from localStorage, if available, otherwise use defaultConfig
    const [gameConfig, setGameConfig] = useState(getConfig);

    const restoreDefaultConfig = () => {
        setGameConfig(defaultConfig);
    }

    // Function to handle changes in config values
    const handleConfigChange = (key, value) => {
        setGameConfig(prevConfig => ({
            ...prevConfig,
            [key]: value
        }));
    };

    // Save config to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('stratagemHeroConfig', JSON.stringify(gameConfig));
    }, [gameConfig]);

    return {
        gameConfig,
        handleConfigChange,
        restoreDefaultConfig,
    };
}

export default useGameConfig;