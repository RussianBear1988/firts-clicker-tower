class AutoClicker {
  constructor({ name, baseIncome, basePrice, image }) {
    this.name = name;
    this.baseIncome = baseIncome;
    this.basePrice = basePrice;
    this.image = image;
    this.count = 0;
    this.level = 1;
    this.upgrades = [];
    this.canBeOpened = false; // 🔑 ← переменная для контроля доступа к «Открыть»
  }

  get incomePerSecond() {
    return this.count * this.baseIncome * this.level;
  }

  get price() {
    return Math.floor(this.basePrice * Math.pow(1.15, this.count));
  }

  buy() {
    this.count++;
    if (this.count >= 50) {
      this.canBeOpened = true;
    }
  }

  upgradeLevel() {
    this.level++;
  }
}


const autoUnits = [
  new AutoClicker({
    name: "Крестьянин",
    baseIncome: 1,
    basePrice: 1000,
    image: "peasant.png"
  }),
  new AutoClicker({
    name: "Лесники",
    baseIncome: 5,
    basePrice: 5000,
    image: "forester.png"
  })
];
