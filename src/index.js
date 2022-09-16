const $buttons = document.querySelectorAll(".game_button");
const $startGameButton = document.querySelector("#start_button");
const $startHardGameButton = document.querySelector("#start_hard_button");
const $score = document.querySelector("#score");

let machineSequence = [];
let userSequence = [];
let score = 0;

let highlightTime;
let betweenColourTime;
let oneSecondTime = 1000;

let $hardGameMusic = document.querySelector("#hard_game_music");
let $normalGameMusic = document.querySelector("#game_music");
let $gameClickSound = document.querySelector("#game_click");

let startGame = (e) => {
    
    setDifficulty(e);
    restartGame();
    lockStartButton();
    scorePlus();
    turnManagement();

}

$startGameButton.addEventListener("click", startGame);
$startHardGameButton.addEventListener("click", startGame);


let setDifficulty = (e) => {
    
    

    if (e.target === $startGameButton) {
        [highlightTime, betweenColourTime] = [500, 700];
        $normalGameMusic.volume = 0.5;
        $normalGameMusic.play();
    }
    if (e.target === $startHardGameButton) {
        [highlightTime, betweenColourTime] = [100, 200];
        $hardGameMusic.volume = 0.2;
        $hardGameMusic.play();
    }
}

let scorePlus = () => {
    $score.innerHTML = ++score
}

let lockStartButton = () => {
    $startGameButton.classList.add("disabled");
    $startHardGameButton.classList.add("disabled");
}

let unlockStartButton = () => {
    $startGameButton.classList.remove("disabled");
    $startHardGameButton.classList.remove("disabled");
}


let restartGame = () => {
    machineSequence = [];
    userSequence = [];
    score = 0;
    $score.innerHTML = "";
}

let restartUserSequence = () => {
    userSequence = [];
}


let turnManagement = () => {
    restartUserSequence();
    machineTurn();
    userTurn();
}

let userTurn = () => {
    let timeMachineEndTurn = betweenColourTime * machineSequence.length;
    setTimeout(() => {
        setUserInput(true);
    }, timeMachineEndTurn);
}

let machineTurn = () => {
    machineSequence.push(chooseRandomColour());
    machineSequence.forEach((colour, index) => {
        setTimeout(() => {
            let $colour = document.querySelector(`.${colour}`);
            highlightElement($colour);
            $gameClickSound.load();
            $gameClickSound.play();
        }, betweenColourTime * index);
    });
}

let chooseRandomColour = () => {
    let colours = ["bg-primary", "bg-secondary", "bg-success", "bg-danger"];
    let randomColour = colours[Math.floor(Math.random() * colours.length)];
    return randomColour;
}


let highlightElement = (element) => {
    element.classList.remove("opacity-50");
    setTimeout(() => {
        element.classList.add("opacity-50");
    }, highlightTime);
}


let lockFx = () => {
}

let unlockFx = (e) => {
    $gameClickSound.play();
    let target = e.target;
    let targetColour = e.target.classList[1];

    highlightElement(target);
    userSequence.push(targetColour);


    for (let i = 0; i < userSequence.length; i++) {
        let [userColour, machineColour] = [userSequence[i], machineSequence[i]];
        if (userColour !== machineColour) return endGame();
    }

    if (machineSequence.length === userSequence.length) {

        setUserInput();
        setTimeout(() => {
            scorePlus();
            turnManagement();
        }, oneSecondTime);
    }

}

let setUserInput = (unlockFlag = false) => {
    if (unlockFlag) {
        $buttons.forEach(($button) => {
            $button.removeEventListener("click", lockFx);
            $button.addEventListener("click", unlockFx);

        });
    }
    else {
        $buttons.forEach(($button) => {
            $button.addEventListener("click", lockFx);
            $button.removeEventListener("click", unlockFx);
        });
    }
}
let stopMusic = () => {
    $normalGameMusic.load();
    $hardGameMusic.load();
}

let endGame = () => {
    stopMusic();
    setUserInput();
    restartGame();
    unlockStartButton();

}

