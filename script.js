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
  updateAutoclickerPanel();
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

const autoclickerList = document.getElementById('autoclicker-list');

function updateAutoclickerPanel() {
  autoclickerList.innerHTML = '';

  player.autoClickers.forEach(unit => {
  // Пропускаем, если ещё нельзя купить и ничего не куплено
  if (unit.count === 0 && player.autoClickers.find(u => u.count > 0) && player.coins < unit.price) return;

  const card = document.createElement('div');
  card.className = 'autoclicker-card';

  const name = document.createElement('h3');
  name.textContent = unit.name;

  const img = document.createElement('img');
  img.src = `images/autoclickers/${unit.image}`;
  img.alt = unit.name;
  img.style.width = "48px";
  img.style.height = "48px";
  img.style.marginRight = "10px";

  const info = document.createElement('div');
  info.className = 'autoclicker-info';
  info.innerHTML = `
    Уровень: ${unit.level}<br>
    Кол-во: ${unit.count}<br>
    Доход: ${unit.incomePerSecond} / сек<br>
    Стоимость: ${unit.price} монет
  `;

  const btns = document.createElement('div');
  btns.className = 'autoclicker-buttons';

  const buyBtn = document.createElement('button');
  buyBtn.textContent = 'Купить';

  const canAfford = player.coins >= unit.price;
  buyBtn.disabled = !canAfford;
  buyBtn.style.opacity = canAfford ? '1' : '0.5';
  buyBtn.style.cursor = canAfford ? 'pointer' : 'not-allowed';

  buyBtn.onclick = () => {
    if (player.coins >= unit.price) {
      player.coins -= unit.price;
      unit.buy(); // ← здесь происходит переключение canBeOpened
      updateCoinsDisplay();
    }
  };

  const openBtn = document.createElement('button');
  openBtn.textContent = 'Открыть';
  openBtn.disabled = !unit.canBeOpened;
  openBtn.style.opacity = unit.canBeOpened ? '1' : '0.5';
  openBtn.style.cursor = unit.canBeOpened ? 'pointer' : 'not-allowed';

  openBtn.onclick = () => {
    if (unit.canBeOpened) {
      alert(`Открывается меню улучшений для ${unit.name}`);
    }
  };

  btns.appendChild(buyBtn);
  btns.appendChild(openBtn);

  card.appendChild(img);
  card.appendChild(name);
  card.appendChild(info);
  card.appendChild(btns);
  autoclickerList.appendChild(card);
});
}

updateShop();
updateAutoclickerPanel();