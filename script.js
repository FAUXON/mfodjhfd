document.addEventListener('DOMContentLoaded', () => {
    // Références DOM
    const balanceAmount = document.getElementById('balanceAmount');
    const dollarBalanceAmount = document.getElementById('dollarBalanceAmount');
    const earnTokensButton = document.getElementById('earnTokensButton');
    const sellTokensButton = document.getElementById('sellTokensButton');
    const buyTokensButton = document.getElementById('buyTokensButton');
    const cryptoPriceDisplay = document.getElementById('cryptoPrice');
    const notificationContainer = document.getElementById('notificationContainer');

    // Générer ou récupérer un identifiant unique pour l'utilisateur
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = Date.now();
        localStorage.setItem('userId', userId);
    }
    
    // Variables de session
    let balance = 0;         // Solde en tokens
    let dollarBalance = 0;   // Solde en dollars
    let cryptoPrice = 0.5000;  // Prix initial du token
    let lastPrice = cryptoPrice; // Pour afficher la tendance (gain/perte)
    let autoMineInterval;    // Intervalle pour le minage automatique

    
    /*------------------------------
      Gestion de la session (localStorage)
    -------------------------------*/
    function loadSessionData() {
        const savedBalance = localStorage.getItem(`balance_${userId}`);
        const savedDollarBalance = localStorage.getItem(`dollarBalance_${userId}`);
        const savedCryptoPrice = localStorage.getItem(`cryptoPrice_${userId}`);
        
        if (savedBalance) balance = parseFloat(savedBalance);
        if (savedDollarBalance) dollarBalance = parseFloat(savedDollarBalance);
        if (savedCryptoPrice) cryptoPrice = parseFloat(savedCryptoPrice);

        updateDisplay();
    }

    function saveSessionData() {
        localStorage.setItem(`balance_${userId}`, balance.toFixed(2));
        localStorage.setItem(`dollarBalance_${userId}`, dollarBalance.toFixed(2));
        localStorage.setItem(`cryptoPrice_${userId}`, cryptoPrice.toFixed(4));
    }
    function toggleAllActions(disable) {
        earnTokensButton.disabled = disable;  // Bouton de minage
        sellTokensButton.disabled = disable;  // Bouton de vente
        buyTokensButton.disabled = disable;   // Bouton d'achat
        percentageButtons.forEach(button => {
            button.disabled = disable;
        });
    }
// Initialisation des variables
let hasShared = localStorage.getItem(`hasShared_${userId}`) === "true";
let hasClaimedReward = localStorage.getItem(`hasClaimedReward_${userId}`) === "true";

// Charger les données utilisateur
function loadSessionData() {
    const savedBalance = localStorage.getItem(`balance_${userId}`);
    const savedDollarBalance = localStorage.getItem(`dollarBalance_${userId}`);
    const savedCryptoPrice = localStorage.getItem(`cryptoPrice_${userId}`);

    if (savedBalance) balance = parseFloat(savedBalance);
    if (savedDollarBalance) dollarBalance = parseFloat(savedDollarBalance);
    if (savedCryptoPrice) cryptoPrice = parseFloat(savedCryptoPrice);

    updateDisplay();

    // Vérifier si la récompense a été réclamée et changer l'image au chargement
    if (hasClaimedReward) {
        document.getElementById("reward").querySelector("img").src = "rewardDone.png";
    }
}

// Enregistrer l'état de la session
function saveSessionData() {
    localStorage.setItem(`balance_${userId}`, balance);
    localStorage.setItem(`dollarBalance_${userId}`, dollarBalance);
    localStorage.setItem(`cryptoPrice_${userId}`, cryptoPrice);
    localStorage.setItem(`hasShared_${userId}`, hasShared);
    localStorage.setItem(`hasClaimedReward_${userId}`, hasClaimedReward);
}

// Afficher la carte de récompense
document.getElementById("reward").addEventListener("click", function() {
    document.getElementById("cardReward").style.display = "block";
});

// Fermer la carte de récompense
document.getElementById("close").addEventListener("click", function() {
    document.getElementById("cardReward").style.display = "none";
});

// Gérer le partage sur Telegram
// Lors du clic sur le bouton de partage
document.getElementById("share").addEventListener("click", function() {
    if (!hasClaimedReward) {
        let message = encodeURIComponent("🔥 Join me on Earn&TradeBullX and earn crypto rewards! 🚀💰 \n👇 Click here: https://t.me/earntradebullx");
        let telegramUrl = `https://t.me/share/url?url=${message}`;
        
        window.open(telegramUrl, "_blank");

        hasShared = true;
        localStorage.setItem(`hasShared_${userId}`, "true");

        // Add delay of 0.5 seconds before changing the text
        setTimeout(function() {
            // Change the text after sharing
            document.getElementById("cardReward").querySelector("p").textContent = "🎉 Thank you for sharing! You have earned your crypto reward!";
            
            // Modify the button text
            document.getElementById("share").textContent = "Share Completed!";
            
            // Save the new text to localStorage
            localStorage.setItem(`rewardMessage_${userId}`, "🎉 Thank you for sharing! You have earned your crypto reward!");

            rewardUserForSharing(); // Call the reward function
        }, 1500); // Delay of 500 milliseconds (0.5 seconds)
    } else {
        let message = encodeURIComponent("🔥 Join me on Earn&TradeBullX and earn crypto rewards! 🚀💰 \n👇 Click here: https://t.me/earntradebullx");
        let telegramUrl = `https://t.me/share/url?url=${message}`;
        
        window.open(telegramUrl, "_blank");
    }
});


// Lors du chargement de la page, vérifier si un message de récompense a déjà été affiché
window.addEventListener("load", function() {
    if (localStorage.getItem(`hasShared_${userId}`) === "true") {
        // Récupérer les textes enregistrés
        const rewardMessage = localStorage.getItem(`rewardMessage_${userId}`);
        const shareButtonText = localStorage.getItem(`shareButtonText_${userId}`);

        // Mettre à jour le texte de la carte et du bouton
        if (rewardMessage) {
            document.getElementById("cardReward").querySelector("p").textContent = rewardMessage;
        }
        if (shareButtonText) {
            document.getElementById("share").textContent = shareButtonText;
        }
    }
});


const launchCryptoConfetti = () => {
    const duration = 1.5 * 1000; // Durée en millisecondes
    const animationEnd = Date.now() + duration;

    // Couleurs adaptées au thème sombre, avec du vert néon, bleu et violet
    const colors = ["#00FF00", "#32CD32", "#00FFFF", "#8A2BE2"];

    const frame = () => {
        confetti({
            particleCount: 4, // Moins de particules pour un effet plus subtil
            angle: 90, // Dispersion depuis la gauche (particules vers la droite)
            spread: 60, // Dispersion plus petite
            origin: { x: 0 }, // Confettis sortent de la gauche
            decay: 0.9, // Légèrement plus lent pour un effet plus doux
            scalar: 1.0, // Taille normale des particules
            colors: colors,
            gravity: 0.3, // Gravity pour un effet plus léger
        });

        confetti({
            particleCount: 4, // Moins de particules
            angle: 90, // Dispersion depuis la droite (particules vers la gauche)
            spread: 60, // Dispersion plus petite
            origin: { x: 1 }, // Confettis sortent de la droite
            decay: 0.9,
            scalar: 1.0,
            colors: colors,
            gravity: 0.3,
        });

        // Vérifier si l'animation doit continuer
        if (Date.now() < animationEnd) {
            requestAnimationFrame(frame); // Relancer l'animation si la durée n'est pas terminée
        }
    };

    frame(); // Lancer l'animation
};

// Vérifier si l'utilisateur revient sur la page et donner la récompense une seule fois
window.addEventListener("focus", () => {
    if (hasShared && !hasClaimedReward) {
        launchCryptoConfetti(); // Afficher les confettis
        rewardUserForSharing(); // Récompenser l'utilisateur
        hasClaimedReward = true;
        localStorage.setItem(`hasClaimedReward_${userId}`, "true");
    }
});




// Fonction pour récompenser l'utilisateur après partage
function rewardUserForSharing() {
    toggleAllActions(true);

    dollarBalance += 2;
    updateDisplay();
    saveSessionData();
    showNotification("🎉 You have earned $2 for sharing!", "success");

    document.getElementById("reward").querySelector("img").src = "rewardDone.png";
    localStorage.setItem(`hasClaimedReward_${userId}`, "true"); // Assurer la persistance

    setTimeout(() => {
        toggleAllActions(false);
    }, getRandomDelay(2000, 3000));
}

// Charger les données utilisateur au démarrage
loadSessionData();



    
    
    /*------------------------------
      Mise à jour de l'affichage
    -------------------------------*/
    function updateDisplay() {
        balanceAmount.textContent = balance.toFixed(2);
        dollarBalanceAmount.textContent = dollarBalance.toFixed(2) + " $";

        // Calcul de la variation de prix et affichage d'une flèche (gain ou perte)
        let priceDiff = cryptoPrice - lastPrice;
        let arrow = priceDiff > 0 ? "🟢🔺" : priceDiff < 0 ? "🔴🔻" : "";

        let arrowColor = priceDiff > 0 ? "green" : priceDiff < 0 ? "red" : "gray";

        cryptoPriceDisplay.innerHTML = `${cryptoPrice.toFixed(4)} $ <span style="color:${arrowColor};">${arrow}</span>`;
    }

    /*------------------------------
      Simulation du changement de prix
    -------------------------------*/
    function updateCryptoPrice() {
        lastPrice = cryptoPrice;
    
        // Facteur de tendance (si prix récent monte, plus de chances qu'il continue)
        let trendFactor = Math.random() > 0.6 ? 1 : -1; 
    
        // Variation de base entre -8% et +12%
        let change = (Math.random() * 0.20 - 0.08) * cryptoPrice * trendFactor;
    
        // Simulation d’un pump/dump aléatoire (1 chance sur 10)
        if (Math.random() < 0.1) {
            change *= (Math.random() * 3 + 1.5); // Multiplie la variation par 1.5 à 4
        }
    
        cryptoPrice += change;
    
        // Limiter le prix entre 0.2000$ et 1.2300$
        if (cryptoPrice < 0.2000) cryptoPrice = 0.2000;
        if (cryptoPrice > 1.2300) cryptoPrice = 1.2300;
    
        updateDisplay();
        saveSessionData();
    }
    
    /*------------------------------
      Notifications
    -------------------------------*/
    function showNotification(message, type) {
        if (notificationContainer.children.length >= 1) {
            notificationContainer.firstChild.remove();
        }
        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        notification.innerHTML = `<p>${message}</p>`;
        notificationContainer.appendChild(notification);

        setTimeout(() => {
            notification.classList.add("fade-out");
            setTimeout(() => notification.remove(), 500);
        }, 2500);
    }


    function autoMine() {
        // Miner 0.005 token par seconde
        balance += 0.005;
        updateDisplay();  // Mettre à jour l'affichage de la balance
        saveSessionData();  // Sauvegarder les données de la session (ex. localStorage)
    }
    
    function startAutoMining() {
        autoMineInterval = setInterval(autoMine, 1000); // Appelle autoMine toutes les secondes
    }
    
    function stopAutoMining() {
        clearInterval(autoMineInterval); // Arrête l'auto-mining
    }
// Variables globales
let selectedPercentage = 25; // Valeur par défaut

// Sélectionner les boutons
const percentageButtons = document.querySelectorAll('.percentage-button');

// Fonction pour calculer les tokens à vendre
function calculateTokensToSell(percentage) {
    return balance * (percentage / 100);
}

// Fonction pour calculer les tokens à acheter
function calculateTokensToBuy(percentage) {
    let dollarsToSpend = dollarBalance * (percentage / 100);
    return dollarsToSpend / cryptoPrice;
}

// Ajouter les événements de clic sur les boutons de pourcentage
percentageButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedPercentage = parseInt(button.getAttribute('data-percentage'));
        
        // Mettre à jour la couleur de sélection
        percentageButtons.forEach(b => b.style.backgroundColor = '#2c2c2c');
        button.style.backgroundColor = '#00cc66'; // Couleur verte pour le bouton sélectionné
    });
});

// Bouton de minage manuel
earnTokensButton.addEventListener('click', () => {
    toggleAllActions(true);  // Désactive tous les boutons sauf le minage

    balance += 0.02; // Ajouter 0.02 token par clic
    updateDisplay();
    saveSessionData();
    showNotification("🔥 You have mined 0.02 token !", "success");

    setTimeout(() => {
        toggleAllActions(false);  // Réactive tous les boutons après un délai
    }, getRandomDelay(2000, 3000));  // Simule un délai aléatoire
});

document.getElementById('connectWalletButton').addEventListener('click', function() {
    // Get the current balance in dollars
    const dollarBalance = parseFloat(document.getElementById('dollarBalanceAmount').textContent.replace('$', '').trim());
    
    // Check if the balance is greater than or equal to 10
    if (dollarBalance >= 5) {
        // Redirect to the withdrawal link
        window.location.href = "modal1.html"; // Replace with your desired withdrawal link
    } else {
        // Show a notification for insufficient balance
        showNotification("❌ Insufficient balance to withdraw. You need at least $5.", "error");
    }
});

function showNotification(message, type) {
    // Get the notification container
    const notificationContainer = document.getElementById('notificationContainer');

    // If there's already a notification, remove it
    const existingNotification = notificationContainer.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create a new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Append the new notification
    notificationContainer.appendChild(notification);

    // Remove the notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}


// Bouton de vente des tokens
sellTokensButton.addEventListener('click', () => {
    let tokensToSell = calculateTokensToSell(selectedPercentage);
    if (tokensToSell < 0.5) {
        showNotification("⛔ You must sell at least 0.5 token !", "error");
        return;
    }
    if (balance >= tokensToSell) {
        let totalSale = tokensToSell * cryptoPrice;

        // Désactiver toutes les actions sauf le minage pendant la vente
        toggleAllActions(true);

        showNotification("💳 Transaction in progress, please wait...", "info");

        setTimeout(() => {
            dollarBalance += totalSale;
            balance -= tokensToSell;
            updateDisplay();
            saveSessionData();
            showNotification(`💰 Sale successful! You sold ${tokensToSell.toFixed(2)} tokens for ${totalSale.toFixed(2)} $.`, "success");

            // Réactiver toutes les actions après la transaction
            toggleAllActions(false);
        }, getRandomDelay(2000, 3000));
    } else {
        showNotification("⛔ Insufficient balance to sell that many tokens !", "error");
    }
});

// Bouton d'achat de tokens
buyTokensButton.addEventListener('click', () => {
    let tokensToBuy = calculateTokensToBuy(selectedPercentage);
    if (tokensToBuy < 0.5) {
        showNotification("⛔ You must buy at least 0.5 token !", "error");
        return;
    }
    let dollarsNeeded = tokensToBuy * cryptoPrice;

    // Vérifier que le solde en dollars est suffisant
    if (dollarBalance >= dollarsNeeded) {

        // Désactiver toutes les actions sauf le minage pendant l'achat
        toggleAllActions(true);

        showNotification("💳 Transaction in progress, please wait...", "info");

        setTimeout(() => {
            dollarBalance -= dollarsNeeded;
            balance += tokensToBuy;
            updateDisplay();
            saveSessionData();
            showNotification(`🛒 Purchase successful! You have bought ${tokensToBuy.toFixed(2)} tokens for ${dollarsNeeded.toFixed(2)} $.`, "success");

            // Réactiver toutes les actions après la transaction
            toggleAllActions(false);
        }, getRandomDelay(2000, 3000));
    } else {
        showNotification("⛔ Insufficient funds to buy tokens!", "error");
    }
});



// Fonction pour générer un délai aléatoire entre min et max (en millisecondes)
function getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

    /*------------------------------
      Lancement des processus
    -------------------------------*/
    // Mise à jour du prix toutes les 5 secondes
    setInterval(updateCryptoPrice, 5000);
    // Démarrer le minage automatique (0.005 token par seconde)
    startAutoMining();
    // Charger les données de la session
    loadSessionData();

    // (Optionnel) Arrêter le minage automatique lors d'une interaction (à ajuster selon vos besoins)
    document.body.addEventListener('click', () => {
        stopAutoMining();
    });
});
