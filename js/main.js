document.addEventListener("DOMContentLoaded", () => {

    createSquares()
    let word
    newWord()

    function newWord() {
        fetch('../words.json')
            .then(response => response.json())
            .then(data => {
                let index = Math.floor(Math.random() * data.words.length);
                word = data.words[index];
                console.log(word)
            })
            .catch(error => console.error('Error:', error));
    }

    function verifyWordInJson(sugWord) {
        return fetch('../words.json')
            .then(response => response.json())
            .then(data => {
                return data.words.includes(sugWord)
            })
            .catch(error => console.error('Error: ' + error));
    }


    const guessedWords = [[]]
    const keys = document.querySelectorAll(".keyboard-row button")


    let avaiSpace = 1
    let guessedWordCount = 0

    function getCurrentWordArray() {
        const nbrGuessedWords = guessedWords.length
        return guessedWords[nbrGuessedWords - 1]
    }

    function updateGuessedWords(lettre) {
        const currentWordArr = getCurrentWordArray()
        if (currentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(lettre)

            const avaiSpaceEl = document.getElementById(String(avaiSpace))
            avaiSpace = avaiSpace + 1

            avaiSpaceEl.textContent = lettre

        }
    }

    function createSquares() {
        const gameBoard = document.getElementById("board")
        for (let i = 0; i < 30; i++) {
            let square = document.createElement("div")
            square.classList.add("square")
            square.classList.add("animate__animated")
            square.setAttribute("id", i + 1)
            gameBoard.appendChild(square)

        }
    }

    function getTileColor(lettre, index) {
        const isCorrect = word.includes(lettre)
        if (!isCorrect) {
            return "rgb(54,54,54)"
        }

        const lettreInPosition = word.charAt(index)
        if (lettreInPosition === lettre) {
            return "rgb(101,138,89)"
        }
        return "rgb(178,159,75)"

    }

    function handleSubmitWord() {
        const currentWordArr = getCurrentWordArray()
        const firstLettreId = guessedWordCount * 5 + 1
        if (currentWordArr.length !== 5) {
            const warning = document.querySelector(".warning");
            warning.textContent = "Word must be 5 letters!";

            warning.style.visibility = "visible";
            warning.classList.add("animate__fadeIn");

            setTimeout(() => {
                warning.classList.remove("animate__fadeIn");
                warning.classList.add("animate__fadeOut");
            }, 3000);

            setTimeout(() => {
                warning.style.visibility = "hidden";
                warning.classList.remove("animate__fadeOut");
            }, 4000);
        }

        let currentWord = currentWordArr.join('')

        verifyWordInJson(currentWord).then(result => {
            if (result) {
                const interval = 200;
                const feedback = document.querySelector('.warning')
                currentWordArr.forEach((lettre, index) => {
                    setTimeout(() => {
                        const tileColor = getTileColor(lettre, index)
                        const lettreId = firstLettreId + index
                        const lettreEl = document.getElementById(lettreId)
                        const lettreKeyboard = document.querySelector(`button[data-key="${lettre}"]`)
                        const currentColor = getComputedStyle(lettreKeyboard).backgroundColor;
                        if (currentColor !== "rgb(101, 138, 89)") {
                            lettreKeyboard.style = `background-color: ${tileColor}`
                        }
                        lettreEl.classList.add("animate__flipInX")
                        lettreEl.style = `background-color: ${tileColor};border-color: ${tileColor}`
                    }, interval * index)
                })

                guessedWordCount += 1
                let won = false
                if (currentWord === word) {
                    won = true
                    bringNotifForward("Congratulations", "You did great!", true)
                    const btns = document.querySelectorAll("button");
                    btns.forEach(btn => {
                        btn.disabled = true;
                        btn.style = "cursor : default;";
                    });
                    feedback.classList.add("animate__fadeIn")
                    feedback.style = "visibility : visible;"
                    feedback.textContent = "You Won! Well Done :)."

                }

                if ((guessedWords.length === 6) && (won === false)) {
                    bringNotifForward("Better luck next time!", `The word was ${word}.`, false)
                    const btns = document.querySelectorAll("button");
                    btns.forEach(btn => {
                        btn.disabled = true;
                        btn.style = "cursor : default;";
                    });
                    feedback.classList.add("animate__fadeIn")
                    feedback.style = "visibility : visible;"
                    feedback.textContent = "You Lost! Maybe try again?"
                }
                guessedWords.push([])
            } else {
                if (currentWord.length === 5) {
                    const warning = document.querySelector(".warning");
                    warning.textContent = "That word is not in the game dictionary.";

                    warning.style.visibility = "visible";
                    warning.classList.add("animate__fadeIn");

                    setTimeout(() => {
                        warning.classList.remove("animate__fadeIn");
                        warning.classList.add("animate__fadeOut");
                    }, 3000);

                    setTimeout(() => {
                        warning.style.visibility = "hidden";
                        warning.classList.remove("animate__fadeOut");
                    }, 4000);
                }
            }
        }).catch(error => 'Error: ' + error)
    }

    function handleDeleteLettre() {

        const currentWordArr = getCurrentWordArray()
        if (currentWordArr.length !== 0) {
            console.log(currentWordArr)
            currentWordArr.pop()
            guessedWords[guessedWords.length - 1] = currentWordArr
            avaiSpace = avaiSpace - 1
            const lastLettre = document.getElementById(String(avaiSpace))
            lastLettre.textContent = ''
        }
    }

    function bringNotifForward(textH2, textP, conf) {
        const popup = document.querySelector(".popup")
        const results = document.querySelector(".results")
        const paraResults = document.querySelector(".paraResults")
        const confetti = document.querySelector("#my-canvas")
        paraResults.textContent = textP
        results.textContent = textH2
        if (conf === true) {
            confetti.style = "visibility : visible;"
            confetti.classList.add("animate__fadeIn")
        }
        popup.style = "visibility : visible;"
        popup.classList.add("animate__fadeIn")

    }

    function giveUp() {
        const surrender = document.querySelector(".giveUp");
        const feedback = document.querySelector('.warning')
        surrender.addEventListener('click', () => {
            bringNotifForward("Better luck next time!", `The word was ${word}`, false);
            const btns = document.querySelectorAll("button");
            btns.forEach(btn => {
                btn.disabled = true;
                btn.style = "cursor : default;";
            });
            feedback.classList.add("animate__fadeIn")
            feedback.style = "visibility : visible;"
            feedback.textContent = "You Lost! Maybe try again?"
        });

    }

    giveUp();


    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({target}) => {
            const lettre = (target.getAttribute("data-key"));

            if (lettre === 'enter') {
                handleSubmitWord()
                return;
            }
            if (lettre === 'del') {
                handleDeleteLettre()
                return;
            }
            updateGuessedWords(lettre)
        }
    }
})


