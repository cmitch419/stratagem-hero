import { useEffect, useState } from "react";
import { INPUT_HOLD_KEY, KEY_TO_DIRECTION } from "../constants";

function useKeyboard(holdKey) {
    const [holdKeyEngaged, setHoldKeyEngaged] = useState(true);
    const [pressedKey, setPressedKey] = useState(null);
    const [direction, setDirection] = useState(null);

    useEffect(() => {
        function downHandler({ key }) {
            if (key === INPUT_HOLD_KEY) {
                setHoldKeyEngaged(true);
            }
            if (holdKeyEngaged) {
                setPressedKey(key);
            }
        }
    
        function upHandler({ key }) {
            if (holdKey && key === INPUT_HOLD_KEY) {
                setHoldKeyEngaged(false);
            } else {
                setPressedKey(null);
            }
        }

        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);
        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
        };
    }, [holdKey, holdKeyEngaged]);

    useEffect(() => {
        if (pressedKey) {
            setDirection(null);
            const dirKeys = Object.keys(KEY_TO_DIRECTION);
            dirKeys.forEach(d=>{
                if (pressedKey.toLowerCase() === d) {
                    // console.debug(`${pressedKey} --> ${KEY_TO_DIRECTION[d]}`)
                    setDirection(KEY_TO_DIRECTION[d]);
                }
            });
        } else {
            setDirection(null);
        }
    }, [pressedKey])

    return {
        pressed: pressedKey,
        direction,
        holdEngaged: holdKeyEngaged,
    };
}

export default useKeyboard;