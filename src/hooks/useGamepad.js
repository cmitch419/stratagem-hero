import { useEffect, useState } from "react";
import { DPAD_TO_DIRECTION } from "../constants";

function useGamepad() {
    const [gamepad, setGamepad] = useState(null);
    const [direction, setDirection] = useState(null);

    useEffect(() => {
        const updateGamepad = () => {
            const gamepads = navigator.getGamepads();
            const firstGamepad = gamepads[0]; // @TODO: multi controller support?
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

    useEffect(() => {
        const dpad = Object.keys(DPAD_TO_DIRECTION);
        setDirection(null);
        dpad.forEach(d=>{
          if (gamepad?.buttons[d]?.pressed) {
            setDirection(DPAD_TO_DIRECTION[d]);
          }
        });
    }, [gamepad]);

    return {
        direction,
    };
}

export default useGamepad;