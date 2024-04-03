import axios from "axios";
import { useEffect, useState } from "react";

const getHighscores = async () => {
    // const resp = await axios.get(process.env.)
}

function useHighscores() {
    const [username, setUsername] = useState(null);
    const [highscores, setHighscores] = useState();

    useEffect(() => {
        console.log('setting high scores');
        setHighscores([
            {
                username: 'thyancey',
                score: Math.floor(Math.random()*10000+1),
            },
            {
                username: 'cmitch419',
                score: Math.floor(Math.random()*10000+1),
            },
            {
                username: 'elm18',
                score: Math.floor(Math.random()*10000+1),
            },
            {
                username: 'lam3322',
                score: Math.floor(Math.random()*10000+1),
            },
            {
                username: 'proveitsendbh',
                score: Math.floor(Math.random()*10000+1),
            },
        ]);
    },[]);

    function getHighscores(limit) {
        return highscores.slice(0,limit);
    }

    function addScore(scoreObj) {
        const newHighscores = [...highscores, scoreObj];
        setHighscores(newHighscores);
    }
    
    return { highscores, username, setUsername, addScore, getHighscores };
}

export default useHighscores;