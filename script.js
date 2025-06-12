const coinsDisplay = document.getElementById('coins');
const tower = document.getElementById('tower');
const shopElement = document.getElementById('upgrade-list');
const incomeDisplay = document.getElementById('income');


const player = {
  coins: 0,
  clickPower: 1,
  autoClickers: autoClickers,
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
  coinsDisplay.textContent = Math.floor(player.coins).toLocaleString("ru-RU");
  updateShop();
  updateIncomeDisplay();
  updateAutoclickerPanel();
}


function updateIncomeDisplay() {
  let totalIncome = 0;
  player.autoClickers.forEach(unit => {
    totalIncome += unit.incomePerSecond;
  });
  incomeDisplay.textContent = Math.floor(totalIncome); // округляем до целых вниз
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
        upgrade.buy();
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

function saveGame() {
  const saveData = {
    coins: player.coins,
    clickPower: player.clickPower,
    upgrades: upgrades.map(u => ({
      level: u.level,
      price: u.price,
      value: u.value
    })),
    autoClickers: player.autoClickers.map(u => ({
      count: u.count,
      level: u.level,
      canBeOpened: u.canBeOpened
    })),
    lastSave: Date.now()
  };

  localStorage.setItem('clickerSave', JSON.stringify(saveData));
}


function loadGame() {
  const data = localStorage.getItem('clickerSave');
  if (!data) return;

  const save = JSON.parse(data);

  // Восстанавливаем базовые параметры
  player.coins = save.coins ?? 0;
  player.clickPower = save.clickPower ?? 1;

  // Восстанавливаем улучшения клика
  upgrades.forEach((u, i) => {
    if (!save.upgrades[i]) return;
    u.level = save.upgrades[i].level;
    u.price = save.upgrades[i].price;
    u.value = save.upgrades[i].value;
  });

  // Восстанавливаем автокликеров
  player.autoClickers.forEach((u, i) => {
    if (!save.autoClickers[i]) return;
    u.count = save.autoClickers[i].count;
    u.level = save.autoClickers[i].level;
    u.canBeOpened = save.autoClickers[i].canBeOpened;
  });

  // === ДОБАВЬ СЮДА расчет дохода за оффлайн ===
  if (save.lastSave) {
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - save.lastSave) / 1000);

    let offlineIncome = 0;
    player.autoClickers.forEach(unit => {
      offlineIncome += unit.incomePerSecond * elapsedSeconds;
    });

    if (offlineIncome > 0) {
      player.addCoins(offlineIncome);

      // Сообщение покажем через 1 сек после загрузки интерфейса
      setTimeout(() => {
        const popup = document.getElementById('offline-popup');
        const message = document.getElementById('offline-message');
        message.textContent = `С момента твоего последнего захода в игру твои слуги заработали ${offlineIncome} монет.`;
        popup.classList.remove('hidden');
      }, 1000);

    }
  }
}

function closeOfflinePopup() {
  document.getElementById('offline-popup').classList.add('hidden');
}


setInterval(saveGame, 500); // каждые 0.5 секунды

loadGame();
updateCoinsDisplay();
