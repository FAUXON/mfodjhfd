// Initialisation de la Web App Telegram
const tg = window.Telegram.WebApp;

// Éléments du DOM
const balanceAmount = document.getElementById('balanceAmount');
const balanceProgressBar = document.getElementById('balanceProgressBar');
const earnTokensButton = document.getElementById('earnTokensButton');
const withdrawTokensButton = document.getElementById('withdrawTokensButton');
const viewHistoryButton = document.getElementById('viewHistoryButton');
const historySection = document.getElementById('historySection');
const transactionHistory = document.getElementById('transactionHistory');
const userInfo = document.getElementById('userInfo'); // Ajoutez cet élément dans votre HTML

// Récupérer les données utilisateur depuis Telegram
const initData = tg.initDataUnsafe; // Données d'initialisation de Telegram
const user = initData.user; // Informations de l'utilisateur

// Afficher les informations de l'utilisateur
if (user) {
    const userName = user.first_name || "Utilisateur";
    const userUsername = user.username ? `@${user.username}` : "";
    userInfo.innerHTML = `
        <p>Bienvenue, <strong>${userName}</strong> ${userUsername}</p>
    `;
} else {
    userInfo.innerHTML = "<p>Utilisateur non connecté.</p>";
}

// Données utilisateur simulées (en mémoire)
let userData = {
    balance: 0,
    transactions: []
};

// Fonction pour charger les données utilisateur
function loadUserData() {
    // Simuler un chargement de données (dans une vraie app, utilisez une base de données)
    const savedData = localStorage.getItem(`user_${user?.id}`);
    if (savedData) {
        userData = JSON.parse(savedData);
    }
    updateUI();
}

// Fonction pour sauvegarder les données utilisateur
function saveUserData() {
    localStorage.setItem(`user_${user?.id}`, JSON.stringify(userData));
}

// Fonction pour mettre à jour l'interface utilisateur
function updateUI() {
    balanceAmount.textContent = userData.balance;
    const progress = (userData.balance % 100); // Exemple : progression basée sur le solde
    balanceProgressBar.style.width = `${progress}%`;

    // Mettre à jour l'historique des transactions
    transactionHistory.innerHTML = '';
    userData.transactions.forEach(transaction => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${transaction.type === 'earn' ? '🎁' : '💸'} ${transaction.amount} Tokens</span>
            <span>${transaction.date}</span>
        `;
        transactionHistory.appendChild(li);
    });
}

// Gagner des Tokens
earnTokensButton.addEventListener('click', () => {
    const earnedAmount = 10; // Montant gagné
    userData.balance += earnedAmount;
    userData.transactions.push({
        amount: earnedAmount,
        type: 'earn',
        date: new Date().toLocaleString()
    });
    saveUserData();
    updateUI();

    // Envoyer les données à Telegram (exemple)
    tg.sendData(JSON.stringify({ action: 'earn', amount: earnedAmount }));
});

// Retirer des Tokens
withdrawTokensButton.addEventListener('click', () => {
    if (userData.balance >= 10) {
        userData.balance -= 10;
        userData.transactions.push({
            amount: 10,
            type: 'withdraw',
            date: new Date().toLocaleString()
        });
        saveUserData();
        updateUI();

        // Envoyer les données à Telegram (exemple)
        tg.sendData(JSON.stringify({ action: 'withdraw', amount: 10 }));
    } else {
        alert("Solde insuffisant !");
    }
});

// Afficher/Masquer l'historique
viewHistoryButton.addEventListener('click', () => {
    historySection.classList.toggle('visible');
});

// Initialisation
tg.ready(); // Indique que la Web App est prête
tg.expand(); // Agrandit la Web App pour occuper tout l'écran
loadUserData(); // Charge les données utilisateur au démarrage
