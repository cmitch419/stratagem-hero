import { useEffect, useState } from "react";
const soundPath = `${import.meta.env.BASE_URL}/sound`;
const audioGameStart = new Audio(`${soundPath}/gamestart.mp3`);
const audioRoundStart = new Audio(`${soundPath}/newround.mp3`);
const audioRoundEnd = new Audio(`${soundPath}/scorescreen.mp3`);
const audioDirectionInput = new Audio(`${soundPath}/inputdirection.mp3`);
const audioGameOver = new Audio(`${soundPath}/gameover.mp3`);
const audioBgMusic = new Audio(`${soundPath}/sgbg.mp3`);

const audioList = {
    'gameStart': audioGameStart,
    'gameOver': audioGameOver,
    'roundStart': audioRoundStart,
    'roundEnd': audioRoundEnd,
    'directionInput': audioDirectionInput,
    'bgMusic': audioBgMusic,
};

function useGameSound() {
    const [isMuted,setIsMuted] = useState();

    useEffect(() => {
        // default mute
        handleChangeMute(true);
    }, []);

    function playSound(audioName) {
        if (!audioList[audioName]) {
            console.error(`audioName must be one of the following: "${Object.keys(audioList).join('", "')}"`);
            return;
        }
        if(audioName === 'directionInput') audioList[audioName].currentTime = 0;
        audioList[audioName].play();
        if (audioName === 'bgMusic') {
            audioList[audioName].loop = true;
        }
    }

    function stopSound(audioName) {
        if (!audioList[audioName]) {
            console.error(`audioName must be one of the following: "${Object.keys(audioList).join('", "')}"`);
            return;
        }
        audioList[audioName].pause();
        audioList[audioName].currentTime = 0;
    }

    const handleChangeMute = (newState) => {
        console.debug('Muting? ', newState);
        Object.keys(audioList).forEach(key=>audioList[key].muted=newState);
        setIsMuted(newState);
    }

    const handleToggleMute = () => {
        handleChangeMute(!isMuted);
    }

    return { isMuted, handleToggleMute, playSound, stopSound };
}



export default useGameSound;