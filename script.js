if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/my_app/service-worker.js')  // Ensure it's root-relative
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}



// Fix Timer Button Event Listener
document.getElementById("startButton").addEventListener("click", startTimer);

// Fix Menu Toggle Behavior
// Fix menu toggle behavior
function toggleMenu() {
    let menu = document.getElementById("menu");
    menu.classList.toggle("open");
}


// Function to switch between pages
function showPage(pageId) {
    let pages = document.querySelectorAll('.page');

    pages.forEach(page => {
        page.classList.remove('active');
    });

    document.getElementById(pageId).classList.add('active');
    document.getElementById('menu').classList.remove('open'); // Close menu after selection
}

function startTimer() {
    const rounds = parseInt(document.getElementById("rounds").value);
    const interval = parseFloat(document.getElementById("interval").value).toFixed(1);
    const display = document.getElementById("display");
    const button = document.getElementById("startButton");
    const progressCircleRound = document.getElementById("progressCircleRound");
    const progressCircleTotal = document.getElementById("progressCircleTotal");
    const beep = new Audio("beep.mp3");
    const strokeRound = parseInt(progressCircleRound.getAttribute("stroke-dasharray"));
    const strokeTotal = parseInt(progressCircleTotal.getAttribute("stroke-dasharray"));

    let currentRound = 1;
    let countdown;
    let running = true;

    button.textContent = "Stop Timer";
    button.removeEventListener("click", startTimer);
    button.addEventListener("click", stopTimer);

    function startRound(round) {
        if (!running) return;
        if (round > rounds) {
            display.innerHTML = "<div class='time'>Finished!</div>";
            resetButton();
            return;
        }

        beep.play().catch(error => console.log("Sound playback failed: ", error));
        let timeLeft = parseFloat(interval);
        display.innerHTML = `<div class='round'>Round ${round}</div><div class='time'>${timeLeft.toFixed(1)}</div>`;

        let totalTime = timeLeft;
        countdown = setInterval(() => {
            if (!running) {
                clearInterval(countdown);
                return;
            }
            timeLeft -= 0.1;
            display.innerHTML = `<div class='round'>Round ${round}</div><div class='time'>${timeLeft.toFixed(1)}</div>`;

            let roundProgress = (totalTime - timeLeft) / totalTime;
            progressCircleRound.style.strokeDashoffset = strokeRound * (1 - roundProgress);

            let totalProgress = ((round - 1) + roundProgress) / rounds;
            progressCircleTotal.style.strokeDashoffset = strokeTotal * (1 - totalProgress);

            if (timeLeft <= 0) {
                clearInterval(countdown);
                startRound(round + 1);
            }
        }, 100);
    }

    function stopTimer() {
        running = false;
        clearInterval(countdown);
        display.innerHTML = "<div class='time'>Stopped!</div>";
        resetButton();
    }

    function resetButton() {
        button.textContent = "Start Timer";
        button.removeEventListener("click", stopTimer);
        button.addEventListener("click", startTimer);
        progressCircleRound.style.strokeDashoffset = strokeRound;
        progressCircleTotal.style.strokeDashoffset = strokeTotal;
    }

    startRound(currentRound);
}

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault(); // Prevents the default mini-infobar from appearing
    deferredPrompt = event; // Store the event for later use

    // Optionally, show a custom install button
    const installButton = document.createElement('button');
    installButton.textContent = 'Install App';
    installButton.style.position = 'fixed';
    installButton.style.bottom = '20px';
    installButton.style.right = '20px';
    installButton.style.padding = '10px';
    installButton.style.background = '#b27cf0';
    installButton.style.color = 'white';
    installButton.style.border = 'none';
    installButton.style.cursor = 'pointer';
    document.body.appendChild(installButton);

    installButton.addEventListener('click', () => {
        if (deferredPrompt) {
            deferredPrompt.prompt(); // Show the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                deferredPrompt = null; // Clear the event after use
            });
        }
        installButton.remove(); // Remove the button after interaction
    });
});

