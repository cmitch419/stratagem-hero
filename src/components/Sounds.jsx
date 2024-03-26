const soundPath = `${import.meta.env.BASE_URL}/sound`;
const audioGameStart = new Audio(`${soundPath}/gamestart.mp3`);
const audioRoundStart = new Audio(`${soundPath}/newround.mp3`);
const audioRoundEnd = new Audio(`${soundPath}/scorescreen.mp3`);
const audioDirectionInput = new Audio(`${soundPath}/inputdirection.mp3`);
const audioGameOver = new Audio(`${soundPath}/gameover.mp3`);

const audioList = {
    'gameStart': audioGameStart,
    'gameOver': audioGameOver,
    'roundStart': audioRoundStart,
    'roundEnd': audioRoundEnd,
    'directionInput': audioDirectionInput,
}

function playSound(audioName) {
    if (!audioList[audioName]) {
        console.error(`audioName must be one of the following: "${Object.keys(audioList).join('", "')}"`);
        return;
    }

    if(audioName === 'directionInput') audioList[audioName].currentTime = 0;
    audioList[audioName].play();
}

export default playSound;