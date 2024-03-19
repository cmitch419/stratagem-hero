import { useEffect, useState } from "react";


function useGamepad() {
    const DIRECTIONS = ['U','D','L','R'];

    const DEFAULT_BUTTON_MAPPING = [
        {
            id: 'HOLD',
            name: 'Stratagem hold button',
            value: 4, // Left Bumper
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
    const [mapping,setMapping] = useState(DEFAULT_BUTTON_MAPPING);
    const [gamepad, setGamepad] = useState(null);
    const [direction, setDirection] = useState(null);
    const [hold, setHold] = useState(false);

    const HOLD = () => mapping.find(b=>b.id==='HOLD').value;

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
        mapping.forEach(({ id, name, value })=>{
          if (gamepad?.buttons[value]?.pressed) {
            console.debug(`${name}!`);
            if (DIRECTIONS.some(d=>d===id)) {
                setDirection(id);
                return;
            }
          }
        });
        console.log(gamepad?.buttons[HOLD()]);
        if (gamepad?.buttons[HOLD()]?.pressed && !hold) {
            setHold(true);
            console.debug('HOLD!');
        } 
        if (!gamepad?.buttons[HOLD()]?.pressed) {
            console.debug('UNHOLD!');
            setHold(false);
        }
    }, [gamepad, mapping]);

    return {
        direction,
        hold,
    };
}

export default useGamepad;