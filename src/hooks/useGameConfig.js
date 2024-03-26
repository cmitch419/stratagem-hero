import { useEffect, useState } from 'react';


const defaultConfig = {
    "pointsPerArrow": 5,
    "minGemsPerRound": 6,
    "maxGemsPerRound": 16,
    "incGemsPerRound": 1,
    "perfectBonus": 100,
    "roundBonusBase": 50,
    "roundBonusMultiplier": 25,
    "timePerRound": 10,
    "timeBonusPerGem": 1,
    "timeBetweenGems": 0.1,
    "updateIntervalMs": 50,
    "dpadScale": 1.2,
    "dpadPositionX": 1.0,
    "dpadPositionY": 1.0,
};

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