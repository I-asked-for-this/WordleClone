function closeNotif() {
    const popup = document.querySelector(".popup");
    const confetti = document.querySelector("#my-canvas")
    popup.classList.remove("animate__fadeIn")
    popup.classList.add("animate__fadeOut")
    setTimeout(() => {
        popup.style = "visibility : hidden;";
        // confetti.style = "visibility : hidden;";
    }, 1000)
}

function conf() {
    var confettiSettings = {target: 'my-canvas'};
    var confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
}




