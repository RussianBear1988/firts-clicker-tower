const coinsDisplay = document.getElementById('coins');
const tower = document.getElementById('tower');
const shopElement = document.getElementById('upgrade-list');
const incomeDisplay = document.getElementById('income');


const player = {
  coins: 0,
  clickPower: 1,
  autoClickers: autoUnits,
  addCoins(amount) {
    this.coins += amount;
    updateCoinsDisplay();
  }
};

tower.addEventListener('click', () => {
  player.addCoins(player.clickPower);
});

tower.ondragstart = () => false;

document.querySelectorAll('img').forEach(img => {
  img.addEventListener('dragstart', event => event.preventDefault());
});

setInterval(() => {
  let totalIncome = 0;
  player.autoClickers.forEach(unit => {
    totalIncome += unit.incomePerSecond;
  });
  player.addCoins(totalIncome);
}, 1000);

function updateCoinsDisplay() {
  coinsDisplay.textContent = player.coins;
  updateShop();
  updateIncomeDisplay();
}


function updateIncomeDisplay() {
  let totalIncome = 0;
  player.autoClickers.forEach(unit => {
    totalIncome += unit.incomePerSecond;
  });
  incomeDisplay.textContent = totalIncome;
}


function updateShop() {
  shopElement.innerHTML = '';

  upgrades.forEach((upgrade, index) => {
    if (index > 0 && upgrades[index - 1].level === 0) return;

    const card = document.createElement('div');
    card.className = 'upgrade-card';

    const canAfford = player.coins >= upgrade.price;
    if (!canAfford) card.classList.add('locked');

    const img = document.createElement('img');
    img.src = `images/upgrades/${upgrade.image}`;
    img.alt = upgrade.name;

    const info = document.createElement('div');
    info.className = 'upgrade-info';
    let bonusText = '';
        if (upgrade.type === 'absolute') {
        bonusText = `+${upgrade.value} монет за клик`;
        } else if (upgrade.type === 'relative') {
    bonusText = `+${upgrade.value}% к текущему клику`;
    }

    info.innerHTML = `
    <div class="upgrade-name">${upgrade.name}</div>
    <div class="upgrade-cost">Цена: ${upgrade.price} монет</div>
    <div class="upgrade-level">Уровень: ${upgrade.level}</div>
    <div class="upgrade-bonus">Бонус: ${bonusText}</div>
    `;


    card.appendChild(img);
    card.appendChild(info);

    card.addEventListener('click', () => {
      if (player.coins >= upgrade.price) {
        player.coins -= upgrade.price;
        upgrade.apply(player);
        updateCoinsDisplay();
      }
    });

    shopElement.appendChild(card);
  });
}

updateShop();
