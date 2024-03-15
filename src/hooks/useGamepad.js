import { useEffect, useState } from "react";

function useGamepad() {
    const [gamepad, setGamepad] = useState(null);

    useEffect(() => {
        const updateGamepad = () => {
            const gamepads = navigator.getGamepads();
            const firstGamepad = gamepads[0];
            setGamepad(firstGamepad);
        };

        const animationFrame = () => {
            updateGamepad();
            window.requestAnimationFrame(animationFrame);
        };
        
        window.requestAnimationFrame(animationFrame);

        return () => {
            window.cancelAnimationFrame(animationFrame);
        };
    }, []);

    return gamepad;
}

export default useGamepad;