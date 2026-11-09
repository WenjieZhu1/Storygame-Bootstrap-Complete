// Player information
let health = 50;
let inventory = [];

// Story scenes
const scenes = {

    // Scene 1
    start: {
        title: "Prisoners' Quarters",
        character: "Narrator",
        text: "You wake up in a dark dungeon. You do not remember your past. The air is cold and the walls are broken. You have 50 HP. There are two paths in front of you.",

        choices: [
            {
                text: "Climb to the Promenade",
                next: "promenade"
            },
            {
                text: "Jump into the Toxic Sewers",
                next: "sewers",
                action: function() {
                    updateHealth(-50);
                }
            }
        ]
    },

    // Scene 2
    promenade: {
        title: "Promenade of the Condemned",
        character: "Narrator",
        text: "You walk into a long hallway. An armored guard is standing in front of you. You also see a small path next to the wall. You must choose what to do.",

        choices: [
            {
                text: "Fight the guard",
                next: "fight",
                action: function() {
                    updateHealth(-50);
                }
            },
            {
                text: "Sneak through the side path",
                next: "ramparts",
                action: function() {
                    addItem("Old Key");
                }
            }
        ]
    },

    // Scene 3
    sewers: {
        title: "Toxic Sewers",
        character: "Narrator",
        text: "You jump into the dark sewers. The water is full of poison. You do not have any special protection. You lose 50 HP and cannot survive. GAME OVER!",

        choices: [
            {
                text: "Try Again",
                next: "start",
                action: function() {
                    restartGame();
                }
            }
        ]
    },

    // Scene 4
    fight: {
        title: "Fight the Guard",
        character: "Narrator",
        text: "You fight the armored guard. After a difficult battle, you finally defeat him. But you are badly hurt. You lose 50 HP. GAME OVER!",

        choices: [
            {
                text: "Try Again",
                next: "start",
                action: function() {
                    restartGame();
                }
            }
        ]
    },

    // Scene 5
    ramparts: {
        title: "The Ramparts",
        character: "Narrator",
        text: "You find an old key on the side path and take it. After walking for a long time, you reach the top of a tall wall. You see a locked treasure chest. You wonder what is inside.",

        choices: [
            {
                text: "Open the treasure chest",
                action: openChest
            }
        ]
    },

    // Scene 6
    victory: {
        title: "Victory!",
        character: "Narrator",
        text: "You now have a Warrior Sword and more HP. You feel stronger and ready for new challenges. You continue your adventure. Congratulations! YOU WIN!",

        choices: [
            {
                text: "Play Again",
                next: "start",
                action: function() {
                    restartGame();
                }
            }
        ]
    }
};


// Read the name and role from the Bootstrap form on index.html.
const params = new URLSearchParams(window.location.search);
const playerName = (params.get("player") || "Adventurer").trim().slice(0, 24) || "Adventurer";
const validRoles = ["Explorer", "Scout", "Guardian"];
const requestedRole = params.get("role");
const playerRole = validRoles.includes(requestedRole) ? requestedRole : "Explorer";

document.getElementById("welcome-player").textContent = "Welcome, " + playerName + "! Your journey begins here.";
document.getElementById("player-role-display").textContent = "Role: " + playerRole;

// Show the selected scene and create Bootstrap choice buttons.
function updateScene(sceneName) {
    const scene = scenes[sceneName];
    if (!scene) return;

    document.getElementById("page-title").textContent = scene.title;
    document.getElementById("page-character").textContent = scene.character;
    document.getElementById("page-text").textContent = scene.text;

    const message = document.getElementById("message-display");
    message.textContent = "";
    message.classList.add("d-none");

    const choices = document.getElementById("choices");
    choices.innerHTML = "";

    scene.choices.forEach(function(choice) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn-outline-info";
        button.textContent = choice.text;

        button.onclick = function() {
            if (choice.action) choice.action();
            if (choice.next) updateScene(choice.next);
        };
        choices.appendChild(button);
    });
}

// Update the health number and Bootstrap progress bar.
function updateHealth(amount) {
    health = Math.max(0, Math.min(100, health + amount));
    document.getElementById("health-display").textContent = health;
    const bar = document.getElementById("health-progress");
    bar.style.width = health + "%";
    bar.parentElement.setAttribute("aria-valuenow", String(health));
    bar.classList.toggle("bg-danger", health <= 20);
    bar.classList.toggle("bg-info", health > 20);
}

// Add an item only once.
function addItem(item) {
    if (!inventory.includes(item)) inventory.push(item);
    updateInventory();
}

// Display the inventory using Bootstrap list-group styles.
function updateInventory() {
    const display = document.getElementById("inventory-display");
    display.innerHTML = "";
    document.getElementById("inventory-count").textContent =
        inventory.length + (inventory.length === 1 ? " item" : " items");

    if (inventory.length === 0) {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = "No items yet";
        display.appendChild(li);
    }
    inventory.forEach(function(item) {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = item;
        display.appendChild(li);
    });
}

function showMessage(text) {
    const message = document.getElementById("message-display");
    message.textContent = text;
    message.classList.remove("d-none");
}

// Check whether the player has the old key.
function openChest() {
    if (inventory.includes("Old Key")) {
        addItem("Warrior Sword");
        updateHealth(20);
        showMessage("You opened the chest! You found a Warrior Sword and gained 20 HP.");

        const choices = document.getElementById("choices");
        choices.innerHTML = "";
        const button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn-info fw-semibold";
        button.textContent = "Continue";
        button.onclick = function() { updateScene("victory"); };
        choices.appendChild(button);
    } else {
        showMessage("The chest is locked. You need a key.");
    }
}

function restartGame() {
    health = 50;
    inventory = [];
    updateHealth(0);
    updateInventory();
    updateScene("start");
}

// Start the game.
restartGame();
