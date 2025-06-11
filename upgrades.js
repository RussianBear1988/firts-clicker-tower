class ClickUpgrade {
  constructor({ name, type, value, price, image }) {
    this.name = name;
    this.type = type;
    this.baseValue = value;
    this.value = value;
    this.price = price;
    this.image = image;
    this.level = 0;
  }

  apply(player) {
    if (this.type === 'absolute') {
      player.clickPower += this.value;
    } else if (this.type === 'relative') {
      player.clickPower = Math.ceil(player.clickPower * (1 + this.value / 100));
    }

    this.level++;
    this.value = Math.ceil(this.value * 1.03);
    this.price = Math.ceil(this.price * 1.6);
  }
}

class AutoClicker {
  constructor({ name, baseIncome, basePrice }) {
    this.name = name;
    this.baseIncome = baseIncome;
    this.basePrice = basePrice;
    this.count = 0;
    this.level = 1;
    this.upgrades = [];
  }

  get incomePerSecond() {
    return this.count * this.baseIncome * this.level;
  }

  get price() {
    return Math.floor(this.basePrice * Math.pow(1.15, this.count));
  }

  buy() {
    this.count++;
  }

  upgradeLevel() {
    this.level++;
  }
}

const upgrades = [
  new ClickUpgrade({ name: "Кожаная перчатка", type: "absolute", value: 1, price: 10, image: "glove.png" }),
  new ClickUpgrade({ name: "Рунический перстень", type: "relative", value: 10, price: 100, image: "ring.png" })
];

const autoUnits = [
  new AutoClicker({ name: "Крестьянин", baseIncome: 1, basePrice: 50 }),
  new AutoClicker({ name: "Лесник", baseIncome: 5, basePrice: 250 })
];
