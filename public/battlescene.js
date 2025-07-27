async function loadPyodidePromise() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
        script.onload = async () => {
            console.log("Pyodide script loaded");
            const pyodide = await loadPyodide();

            console.log("Pyodide instance created");
            await pyodide.loadPackage(["numpy", "matplotlib"]);
            resolve(pyodide);
        };
        script.onerror = (error) => {
            console.error("Error loading Pyodide script:", error);
            reject(error);
        };
        document.head.appendChild(script);
    });
}
async function calculateGibbsEnergy(A, B, X,pyodide) {
  if (!A || !B || X === null || X === undefined) {
        console.error("Invalid inputs for Gibbs energy calculation:", { A, B, X });
        throw new Error("Invalid inputs for Gibbs energy calculation");
    }
    // Call the Python function and get the returned Gibbs energy
    const result = pyodide.runPython(`
from HeatOfMixingCalculator import hmix
H = hmix()
H.inputElement('${A}', '${B}', ${X})
H.calRP()
H.assiginP()
H.decideA()
H.calHmix_user()  # This returns the Gibbs energy directly
    `);

const gibbsEnergy = -1 * result; 
    return gibbsEnergy; 
  }
export default class BattleScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BattleScene' });
        this.weaponScores = {};
          this.enemy_dataset = {
  "Electric_TerraWorm": {
    attacks: {
      attack1: { name: "Thunder skin", damage: 15,effect:'n/a',use:25 },
      attack2: { name: "Shock pulse", damage: 30 ,effect:'a',use:15},
      attack3: { name: "Electricute", damage: 35,effect:'n/a',use:10 },
      attack4: { name: "Earthquake", damage: 80,effect:'n/a',use:1 }
    },
    type:{ name: "electric"},
    time:15,
    health:100
  },
  "Fire_TerraWorm": {
    attacks: {
      attack1: { name: "FlameBurst", damage: 25, effect:'a',use:20 },
      attack2: { name: "LavaFlow", damage: 35,effect:'n/a', use:15 },
      attack3:{ name: "Magma Burst", damage: 40, effect:'a', use:10 },
      attack4:{ name: "Earthquake", damage: 80, effect:'n/a', use:1 }
    },
    type:{ name: "fire"},
    time:15,
    health:200

  },
  "Poison_TerraWorm": {
    attacks: {
      attack1: { name: "ToxicSpit", damage: 15, effect:'a', use:25 },
      attack2: { name: "VenomStrike", damage: 20, effect:'a', use:20 },
      attack3: { name: "PoisonCloud", damage: 30, effect:'a', use:15 },
      attack4: { name: "Earthquake", damage: 80, effect:'n/a', use:1 }
    },
      type:{ name: "poison"},
    time:15,
    health:150

  },
  "Slime_TerraWorm": {
    attacks: {
      attack1: { name: "SlimeSplash", damage: 10, effect:'a', use:30 },
      attack2: { name: "AcidRain", damage: 15, effect:'a', use:25 },
      attack3: { name: "Suffocate", damage: 20, effect:'a', use:20 },
      attack4: { name: "Earthquake", damage: 80, effect:'n/a', use:1 }
    },
     type:{ name: "slime"},
    time:15,
    health:120

  }
};
    }

    init(data) {
        this.playerSpriteKey = data.playerSprite;
        this.enemySpriteKey = data.enemySprite;
        this.playerWeapons = data.weapons || {};
        this.playerAssets = data.playerAssets || {}; 
        this.playerHealth = 100;
        this.curr_enemy = this.getRandomEnemy(); 
    this.enemyHealth = this.enemy_dataset[this.curr_enemy].health;

    this.playerTurn = true;
    this.playerActionTaken = false;

    }
getRandomAttack(enemyName) {
    let enemy_name = this.enemy_dataset[enemyName];
    if (!enemy_name) return null;

    const usableAttacks = Object.values(enemy_name.attacks).filter(atk => atk.use > 0);
    if (usableAttacks.length === 0) return null; 

    const randomIndex = Math.floor(Math.random() * usableAttacks.length);
    const chosenAttack = usableAttacks[randomIndex];

    enemy_name.attacks[`attack${randomIndex + 1}`].use--;

    return JSON.parse(JSON.stringify(chosenAttack));
}
getRandomEnemy() {
  const keys = Object.keys(this.enemy_dataset);
  const randomIndex = Math.floor(Math.random() * keys.length);
  return keys[randomIndex];
}
async useGibbsEnergyInPhaser(elem1,elem2,moleFrac) {
        const A = elem1;
        const B = elem2;
        const X = moleFrac/1000;

        try {
            if (!this.pyodideInstance) {
                console.log("Pyodide not yet loaded, waiting...");
                return; // Or handle this differently (e.g., display a loading message)
            }
            console.log("Calculating Gibbs energy with A:", A, "B:", B, "X:", X);
            const gibbsEnergy = await calculateGibbsEnergy(A, B, X, this.pyodideInstance);
            console.log("Gibbs Energy:", gibbsEnergy);

            
             return gibbsEnergy;
        } catch (error) {
            console.error("Error calculating Gibbs energy:", error);
        }
    }
 parseAlloy(alloy) {
    if (!alloy || !alloy.description) {
        console.error("Invalid alloy object passed to parseAlloy:", alloy);
        return {
            elements: { elementA: null, elementB: null },
            moleFraction: null
        };
    }

    const formulaMatch = alloy.description.match(/Formula:\s*([A-Za-z]+-[A-Za-z]+)/i);
    const moleMatch = alloy.description.match(/Mole fraction:\s*([0-9]+(?:\.[0-9]+)?)/i);

    const elements = formulaMatch ? formulaMatch[1].split('-') : [];
    const moleFraction = moleMatch ? parseFloat(moleMatch[1]) : null;

    return {
        id: alloy.tokenId,
        name: alloy.name,
        elements: {
            elementA: elements[0] || null,
            elementB: elements[1] || null
        },
        moleFraction: moleFraction,
        image: alloy.image,
        quantity: alloy.quantity
    };
}
preload(){
  this.load.image('poison_worm', `./assets/poison_worm.png`);
  this.load.image('electric_worm', `./assets/electric_worm.png`);
  this.load.image('fire_worm', `./assets/fire_worm.png`);
  this.load.image('slime_worm', `./assets/slime_worm.png`);
  this.load.image('bg', `./assets/bg.png`);
    this.load.audio('damage','../soundassets/458867__raclure__damage-sound-effect.mp3')
        this.load.audio('bgsound','../soundassets/808501__manuelgraf__first-battle-fantasy-combat-background-music-loop-135bpm-in-e-minor.wav')


}
async create() {

  this.damage=this.sound.add('damage',{volume:0.8});
  this.bgsound=this.sound.add('bgsound',{loop:true,volume:0.9});
  this.bgsound.play()
  console.log("playerAssets:", this.playerAssets);
this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, 'bg').setOrigin(0.5, 0.5).setScale(0.8);  this.lastAttack = '';
    this.e_health = this.enemy_dataset[this.curr_enemy].health;
    this.cameras.main.setBackgroundColor('#222');
if(this.curr_enemy=== 'Electric_TerraWorm') {
  this.enemy=this.add.sprite(1000, 200, 'electric_worm').setScale(0.4);}
else if(this.curr_enemy=== 'Fire_TerraWorm') {
  this.enemy=this.add.sprite(1000, 200, 'fire_worm').setScale(0.4);}
  else if(this.curr_enemy=== 'Poison_TerraWorm') {
  this.enemy=this.add.sprite(1000, 200, 'poison_worm').setScale(0.4);}
  else if(this.curr_enemy=== 'Slime_TerraWorm') {
  this.enemy=this.add.sprite(1000, 200, 'slime_worm').setScale(0.4);}

    this.player = this.add.sprite(590, 400, this.playerSpriteKey).setScale(3);

    this.add.text(250, 455, 'Choose Attack:', { fontSize: '32px', fill: '#fff',fontStyle: 'bold' });

    this.playerHealthBarBg = this.add.rectangle(520, 335, 104, 14, 0xffffff).setOrigin(0, 0.5);
    this.enemyHealthBarBg = this.add.rectangle(650, 80, this.e_health+4, 14, 0xffffff).setOrigin(0, 0.5);
    this.playerHealthBar = this.add.rectangle(520, 335,100 , 10, 0x00ff00).setOrigin(0, 0.5);
    this.enemyHealthBar = this.add.rectangle(650, 80, this.e_health, 10, 0xff0000).setOrigin(0, 0.5);

      try {
            this.pyodideInstance = await loadPyodidePromise();
            console.log("Pyodide instance stored in WorldScene:", this.pyodideInstance);
            // Load the database.dat file into Pyodide's virtual filesystem
            const databaseContent = await fetch('./database.dat').then(res => res.text());
            this.pyodideInstance.FS.writeFile('/database.dat', databaseContent);
            console.log("Files in Pyodide FS:", this.pyodideInstance.FS.readdir('/'));
            // Load the Python script
            const pythonScript = await fetch('./HeatOfMixingCalculator.py').then(res => res.text());
            console.log("Python script loaded",pythonScript);
            this.pyodideInstance.FS.writeFile('HeatOfMixingCalculator.py', pythonScript);

            this.pyodideInstance.runPython(pythonScript);
            console.log("Python script loaded");
             // Call useGibbsEnergyInPhaser after Pyodide is loaded
        } catch (error) { 
            console.error("Error loading Pyodide:", error);
            return; 
        }  
    const panelHTML = document.createElement('div');
panelHTML.innerHTML = `
  <style>
    #attack-panel-wrapper {
      text-align: center;
    }

    #attack-panel-wrapper h3 {
      color: #e2f3e4;
      font-family: 'Oxanium', sans-serif;
      margin-bottom: 10px;
      text-shadow: 0 0 5px rgba(110, 69, 226, 0.7);
    }

    #attack-panel {
      display: flex;
      gap: 12px;
      padding: 12px;
      background: rgba(26, 28, 44, 0.9);
      border: 2px solid #6e45e2;
      border-radius: 8px;
      justify-content: center;
      align-items: center;
      transform: scale(1.4);
      transform-origin: center;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
      backdrop-filter: blur(2px);
    }

    .weapon-button {
      background-color: rgba(26, 28, 44, 0.7);
      border: 2px solid #6e45e2;
      border-radius: 8px;
      padding: 10px;
      cursor: pointer;
      transition: all 0.2s ease-out;
      position: relative;
    }

    .weapon-button:hover {
      background-color: rgba(110, 69, 226, 0.3);
      transform: scale(1.1);
      box-shadow: 0 0 8px rgba(110, 69, 226, 0.5);
    }

    .weapon-button img {
      width: 64px;
      height: 64px;
      pointer-events: none;
      filter: drop-shadow(0 0 2px rgba(226, 243, 228, 0.5));
    }

    .alloy-overlay {
      position: absolute;
      top: 10px;
      left: 10px;
      width: 64px;
      height: 64px;
      opacity: 0.4;
      pointer-events: none;
      z-index: -1;
      mix-blend-mode: lighten;
    }
  </style>
  <div id="attack-panel-wrapper">
    <div id="attack-panel"></div>
  </div>
`;

const attackPanelX = 360;
    const attackPanelY = 535;
    const domElement = this.add.dom(attackPanelX, attackPanelY, panelHTML);
    const panel = panelHTML.querySelector('#attack-panel');

    const weaponTypes = ['pickaxe', 'sword', 'shield', 'potion'];
    this.weaponIndexes = { pickaxe: 0, sword: 0, shield: 0, potion: 0 };
    this.usedAlloys = new Set();
    const usedAlloys = this.usedAlloys;

    this.alloyImages = {}; 

   const hasAnyWeapons = weaponTypes.some(type => 
    Array.isArray(this.playerWeapons[type]) && this.playerWeapons[type].length > 0
);

if (!hasAnyWeapons) {
    const message = document.createElement('div');
    message.style.color = 'white';
    message.style.fontFamily = 'Arial';
    message.style.fontSize = '16px';
    message.textContent = 'You have no weapons in your assets';
    panel.appendChild(message);
} else {
    weaponTypes.forEach(type => {
        const weapons = this.playerWeapons[type] || [];
        const index = this.weaponIndexes[type];

        if (weapons.length > 0) {
            const current = weapons[weapons.length - 1];
            const button = document.createElement('button');
            button.className = 'weapon-button';
            button.dataset.weapon = type;

            const img = document.createElement('img');
            img.src = current.image;
            img.alt = current.name;
            button.appendChild(img);

            // Attack logic
            button.addEventListener('click', () => this.handlePlayerAttack(type));
            button.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                if (weapons.length > 1) {
                    this.weaponIndexes[type] = (this.weaponIndexes[type] + 1) % weapons.length;
                    const newWeapon = weapons[this.weaponIndexes[type]];
                    img.src = newWeapon.image;
                    img.alt = newWeapon.name;
                }
            });

            button.ondragover = (e) => e.preventDefault();
button.ondrop = async (e) => {
    e.preventDefault();
    if (button.dataset.alloyAttached) return;

    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    console.log("Dropped alloy data:", data);
    if (usedAlloys.has(data.id)) return;

    const overlay = document.createElement("img");
    overlay.src = this.alloyImages[data.id];
    overlay.className = "alloy-overlay";
    button.appendChild(overlay);
    button.dataset.alloyAttached = data.id;
    usedAlloys.add(data.id);
    button.dataset.alloyName = data.name;
    button.dataset.alloyId = data.id;

    // Find the alloy object by name
    const alloyObj = Object.values(this.playerAssets).find(
        item => item.name === data.name
    );
    console.log("Matched alloy object:", alloyObj);

    const alloyDetails = this.parseAlloy(alloyObj);
    console.log("Parsed alloy details:", alloyDetails);
    const { elementA, elementB } = alloyDetails.elements;
    console.log("Parsed elements:", elementA, elementB);
    const moleFraction = alloyDetails.moleFraction;
    console.log("Parsed mole fraction:", moleFraction);

    try {
        const gibbsEnergy = await this.useGibbsEnergyInPhaser(elementA, elementB, moleFraction/100);
        console.log(`Gibbs Energy for ${data.name}:`, gibbsEnergy);

        const weaponType = button.dataset.weapon;
        if (!this.weaponScores[weaponType]) {
            this.weaponScores[weaponType] = 0;
        }
        this.weaponScores[weaponType] += gibbsEnergy; 
        console.log(`Updated score for ${weaponType}:`, this.weaponScores[weaponType]);
    } catch (error) {
        console.error("Error calculating Gibbs energy:", error);
    }
};
            panel.appendChild(button);
        } else {
            const naButton = document.createElement('button');
            naButton.className = 'weapon-button';
            naButton.dataset.weapon = type;

            const img = document.createElement('img');
            img.src = '../assets/blank.png'; 
            img.alt = 'N/A';
            img.style.opacity = '0.5'; 
            naButton.appendChild(img);

            panel.appendChild(naButton);
        }
    });
}

    const alloys = Object.values(this.playerAssets).filter(item =>
        item.name?.toLowerCase().includes('alloy')
    );

const alloyPanel = document.createElement('div');
alloyPanel.innerHTML = `
  <style>
    #alloy-panel-draggable {
      position: absolute;
      left: ${attackPanelX + domElement.node.offsetWidth + 60}px;
      top: 420px;
      z-index: 1000;
      cursor: default;
      user-select: none;
    }
    #alloy-panel {
      width: 270px; /* 3 * 90px */
      height: 120px;
      background: rgba(26, 28, 44, 0.9);
      border: 2px solid #6e45e2;
      border-radius: 8px;
      padding: 12px 10px;
      color: #e2f3e4;
      font-family: 'Oxanium', sans-serif;
      display: grid;
      grid-template-columns: repeat(3, 90px);
      grid-template-rows: 1fr;
      overflow-x: auto;
      overflow-y: hidden;
      gap: 16px;
      scroll-snap-type: x mandatory;
      align-items: center;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
      backdrop-filter: blur(2px);
    }
    .alloy-item {
      width: 80px;
      height: 100px;
      flex: 0 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      scroll-snap-align: start;
      background-color: rgba(26, 28, 44, 0.7);
      padding: 6px;
      border-radius: 8px;
      transition: all 0.2s ease-out;
      cursor: grab;
      box-sizing: border-box;
      border: 1px solid rgba(110, 69, 226, 0.5);
    }
    .alloy-item:hover {
      background-color: rgba(110, 69, 226, 0.3);
      transform: scale(1.1);
      box-shadow: 0 0 8px rgba(110, 69, 226, 0.5);
    }
    .alloy-item img {
      width: 64px;
      height: 64px;
      object-fit: contain;
      pointer-events: none;
      filter: drop-shadow(0 0 2px rgba(226, 243, 228, 0.5));
    }
    .alloy-item span {
      font-size: 10px;
      text-align: center;
      pointer-events: none;
      word-break: break-all;
      text-shadow: 0 0 3px rgba(110, 69, 226, 0.7);
    }
    #alloy-panel::-webkit-scrollbar {
      height: 10px;
    }
    #alloy-panel::-webkit-scrollbar-track {
      background: rgba(110, 69, 226, 0.1);
      border-radius: 10px;
    }
    #alloy-panel::-webkit-scrollbar-thumb {
      background: #6e45e2;
      border-radius: 10px;
    }
  </style>
  <div id="alloy-panel-draggable">
    <div id="alloy-panel"></div>
  </div>
`;

const alloyPanelDraggable = alloyPanel.querySelector('#alloy-panel-draggable');
const alloyContainer = alloyPanel.querySelector('#alloy-panel');

alloys.forEach(alloy => {
    const div = document.createElement('div');
    div.className = 'alloy-item';
    div.draggable = true;
    div.dataset.name = alloy.name;
    div.dataset.id = alloy.name;

    const img = document.createElement('img');
    img.src = alloy.image;
    img.alt = alloy.name;

    this.alloyImages[alloy.name] = alloy.image;

    const label = document.createElement('span');
    label.textContent = alloy.name;

    div.appendChild(img);
    div.appendChild(label);

    div.addEventListener('dragstart', (e) => {
        if (e.button !== 0) {
            e.preventDefault();
            return false;
        }
        e.dataTransfer.setData("text/plain", JSON.stringify({
            name: alloy.name,
            color: '', // unused
            id: alloy.name
        }));
    });
    alloyContainer.appendChild(div);
});

let isDragging = false, dragOffsetX = 0, dragOffsetY = 0;
alloyPanelDraggable.addEventListener('mousedown', function(e) {
    if (e.button === 2) { 
        isDragging = true;
        dragOffsetX = e.clientX - alloyPanelDraggable.offsetLeft;
        dragOffsetY = e.clientY - alloyPanelDraggable.offsetTop;
        document.body.style.userSelect = 'none';
        e.preventDefault();
    }
});
document.addEventListener('mousemove', function(e) {
    if (isDragging) {
        alloyPanelDraggable.style.left = (e.clientX - dragOffsetX) + 'px';
        alloyPanelDraggable.style.top = (e.clientY - dragOffsetY) + 'px';
    }
});
document.addEventListener('mouseup', function(e) {
    if (isDragging && e.button === 2) {
        isDragging = false;
        document.body.style.userSelect = '';
    }
});
alloyPanelDraggable.addEventListener('contextmenu', e => e.preventDefault());

this.add.dom(0, 0, alloyPanel);

        this.attackMessage = this.add.text(400, 50, '', {
        fontSize: '24px',
        fill: '#fff',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'center',
    }).setOrigin(0.5, 0.5);

    this.timerText = this.add.text(400, 100, '', {
        fontSize: '20px',
        fill: '#ff0000',
        fontFamily: 'Arial',
        fontStyle: 'bold',
        align: 'center',
    }).setOrigin(0.5, 0.5);
    this.startPlayerTurn(this.curr_enemy); 
}
startPlayerTurn(enemy) {
  if (this.playerTimer) {
        this.playerTimer.destroy();
    }
    this.playerTurn = true;
    this.playerActionTaken = false;
      let timeLeft = this.enemy_dataset[enemy]?.time || 7; 


    this.showAttackMessage("Your turn! Choose an attack.");


    this.updateTimerText(timeLeft); 
    this.playerTimer = this.time.addEvent({
        delay: 1000, 
        repeat: timeLeft-1, 
        callback: () => {
            timeLeft--;
            this.updateTimerText(timeLeft);

            if (timeLeft <= 0) {
                this.playerTimer.destroy();
                if (!this.playerActionTaken) {
                    this.showAttackMessage("You took too long! Enemy's turn.");
                    this.enemyAttack();
                }
            }
        },
    });
}

handlePlayerAttack(weaponType) {
    if (!this.playerTurn || this.playerActionTaken) return;

    this.playerActionTaken = true;
    if (this.playerTimer) {
        this.playerTimer.remove(false);
    }
    this.updateTimerText(''); 

    const weaponLower = weaponType.toLowerCase();
    let baseDamage = 0;

    switch (weaponLower) {
        case 'pickaxe': 
            baseDamage = 25; 
            this.lastAttack = 'pickaxe';
            this.showAttackMessage("Player used a Pickaxe!");
            break;
        case 'sword': 
            baseDamage = 35; 
            this.lastAttack = 'sword';
            this.showAttackMessage("Player used a Sword!");
            break;
        case 'shield': 
            baseDamage = 0;
            this.lastAttack = 'shield'; 
            this.showAttackMessage("Player used a Shield to defend!");
            break;
        case 'potion':
            baseDamage = 0;
            this.playerHealth = Math.min(this.playerHealth + 30, 100);
            this.updateHealthBars();
            this.time.delayedCall(1000, () => this.showAttackMessage("Player used a Potion to heal!"));
            this.time.delayedCall(500, () => this.enemyAttack());
            return;
    }

    const weaponScore = this.weaponScores[weaponLower] || 0; 
    const extraDamage = weaponScore / 100;
    console.log("extra damage",extraDamage) 
    const totalDamage = baseDamage + extraDamage;

    console.log(`Weapon: ${weaponLower}`);
    console.log(`Base Damage: ${baseDamage}`);
    console.log(`Weapon Score: ${weaponScore}`);
    console.log(`Extra Damage (from Gibbs energy): ${extraDamage}`);
    console.log(`Total Damage: ${totalDamage}`);

    this.enemyHealth -= totalDamage;
    this.updateHealthBars();
    this.damage.play();

    if (this.enemyHealth <= 0) {
        this.endBattle('win');
    } else {
        this.time.delayedCall(1000, () => this.enemyAttack());
    }
}

enemyAttack() {
    this.playerTurn = false;
    this.showAttackMessage("Enemy is attacking...");
    
    const attack = this.getRandomAttack(this.curr_enemy);
    if (!attack) {
        this.showAttackMessage("Enemy has no attacks left!");
        this.time.delayedCall(2000, () => this.startPlayerTurn());
        return;
    }

    this.time.delayedCall(2000, () => {
        let damage = 0;
        console.log(`Enemy attack: ${attack.name} with effect ${attack.effect}`);
        if (this.lastAttack == 'shield' && attack.effect === 'a') {
            console.log(`Enemy attack: ${attack.name} with damage ${attack.damage}`);
            damage = 0;
        }
        else {
            console.log(`Enemy attack: ${attack.name} with damage ${attack.damage}`);
            damage = attack.damage;
          this.damage.play( );
        }
        
        this.playerHealth -= damage;
        this.updateHealthBars();
        
        this.time.delayedCall(2000, () => {
        this.showAttackMessage(`${this.curr_enemy} used ${attack.name}!`);
        });
        if (this.playerHealth <= 0) {
            this.endBattle('lose');
        } else {
            this.time.delayedCall(4000, () => this.startPlayerTurn(this.curr_enemy));
        }
    });
}


showAttackMessage(message) {
    if (this.messageClearEvent) {
        this.messageClearEvent.remove(false);
    }

    this.attackMessage.setText(message);

    this.messageClearEvent = this.time.delayedCall(3000, () => {
        this.attackMessage.setText('');
    });
}
updateTimerText(timeLeft) {
    if (timeLeft === '') {
        this.timerText.setText('');
    } else {
        this.timerText.setText(`Time Left: ${timeLeft}s`);
    }
}

    updateHealthBars() {
        const playerBarWidth = Phaser.Math.Clamp(this.playerHealth, 0, 100);
        const enemyBarWidth = Phaser.Math.Clamp(this.enemyHealth, 0, this.e_health);

        this.playerHealthBar.displayWidth = playerBarWidth;
        this.enemyHealthBar.displayWidth = enemyBarWidth;
    }

    endBattle(result) {
    if (this.playerTimer) {
        this.playerTimer.remove();
    }

    if (result === 'win') {
        this.showAttackMessage("You Won!");
    } else if (result === 'lose') {
        this.showAttackMessage("You Lost!");
    }

    this.time.delayedCall(4000, () => {
      this.bgsound.stop();

        this.scene.get('WorldScene').events.emit('battle-ended', { result });

        this.scene.stop('BattleScene');
        this.scene.resume('WorldScene');

        this.battleResult = result === 'win';
    });
}
updateWeaponScore(weaponType, scoreIncrement) {
    if (!this.weaponScores) {
        this.weaponScores = {};
    }
    if (!this.weaponScores[weaponType]) {
        this.weaponScores[weaponType] = 0;
    }
    this.weaponScores[weaponType] += scoreIncrement;
    console.log(`Updated ${weaponType} score:`, this.weaponScores[weaponType]);
}

handleAlloyDrop(alloy, weaponType) {
    const parsedAlloy = this.parseAlloy(alloy);
    if (parsedAlloy.elements.elementA && parsedAlloy.elements.elementB && parsedAlloy.moleFraction) {
        this.useGibbsEnergyInPhaser(parsedAlloy.elements.elementA, parsedAlloy.elements.elementB, parsedAlloy.moleFraction)
            .then(gibbsEnergy => {
                const scoreIncrement = Math.round(gibbsEnergy / 10); 
                this.updateWeaponScore(weaponType, scoreIncrement);
            })
            .catch(error => {
                console.error("Error handling alloy drop:", error);
            });
    }
}
}