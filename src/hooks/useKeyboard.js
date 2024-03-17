import { useEffect, useState } from "react";
import { INPUT_HOLD_KEY, KEY_TO_DIRECTION } from "../constants";

function useKeyboard() {
    const [holdKey, setHoldKey] = useState(false);
    const [pressedKey, setPressedKey] = useState(null);
    const [direction, setDirection] = useState(null);

    useEffect(() => {
        function downHandler({ key }) {
            if (key === INPUT_HOLD_KEY) {
                setHoldKey(true);
            }
            if (holdKey) {
                setPressedKey(key);
            }
        }
    
        function upHandler({ key }) {
            if (key === INPUT_HOLD_KEY) {
                setHoldKey(false);
            } else {
                setPressedKey(null);
            }
        }

        function pressHandler({ key }) {
            if (holdKey) {
                setPressedKey(key);
            } else {
                setPressedKey(null);
            }
        }
        window.addEventListener('keydown', downHandler);
        window.addEventListener('keyup', upHandler);
        window.addEventListener('keypress', pressHandler);
        return () => {
            window.removeEventListener('keydown', downHandler);
            window.removeEventListener('keyup', upHandler);
            window.removeEventListener('keypress', pressHandler);
        };
    }, [holdKey]);

    useEffect(() => {
        if (pressedKey) {
            setDirection(null);
            const dirKeys = Object.keys(KEY_TO_DIRECTION);
            dirKeys.forEach(d=>{
                if (pressedKey.toLowerCase() === d) {
                    setDirection(KEY_TO_DIRECTION[d]);
                }
            });
        } else {
            setDirection(null);
        }
    }, [pressedKey])

    return {
        direction,
        holdKey,
    };
}

export default useKeyboard;