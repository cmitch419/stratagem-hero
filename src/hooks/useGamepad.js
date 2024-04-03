import { useEffect, useState } from "react";


function useGamepad(holdButtonValue) {
    const DIRECTIONS = ['U','D','L','R'];

    const DEFAULT_BUTTON_MAPPING = [
        {
            id: 'HOLD',
            name: 'Stratagem hold button',
            value: holdButtonValue ?? 4, // default 4 - Left Bumper
        },
        {
            id: 'U',
            name: 'Up',
            value: 12, // D-pad up
        },
        {
            id: 'D',
            name: 'Down',
            value: 13, // D-pad down
        },
        {
            id: 'L',
            name: 'Left',
            value: 14, // D-pad left
        },
        {
            id: 'R',
            name: 'Right',
            value: 15, // D-pad right
        },
    ];
    const [mapping, setMapping] = useState(DEFAULT_BUTTON_MAPPING);
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
        setDirection(null);
        mapping.forEach(({ id, value })=>{
          if (gamepad?.buttons[value]?.pressed) {
            if (DIRECTIONS.some(d=>d===id)) {
                setDirection(id);
                return;
            }
          }
        });
    }, [gamepad, mapping]);

    return {
        direction,
    };
}

export default useGamepad;