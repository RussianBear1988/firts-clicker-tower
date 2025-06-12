class AutoClicker {
  constructor({ name, baseIncome, basePrice, image, priceGrowth, incomeGrowth }) {
    this.name = name;
    this.baseIncome = baseIncome;
    this.basePrice = basePrice;
    this.image = image;
    this.count = 0;
    this.level = 1;
    this.canBeOpened = false;

    this.priceGrowth = priceGrowth ?? 1.15;
    this.incomeGrowth = incomeGrowth ?? 1.1;
  }

  get incomePerSecond() {
  return Math.floor(this.count * this.baseIncome * this.level);
  }

  get price() {
    return Math.floor(this.basePrice * Math.pow(this.priceGrowth, this.count));
  }

  buy() {
    this.count++;
    this.baseIncome *= this.incomeGrowth;
    if (this.count >= 50) this.canBeOpened = true;
  }

  upgradeLevel() {
    this.level++;
  }
}

const autoClickers = [
  new AutoClicker({
    name: "Крестьянин",
    baseIncome: 1,
    basePrice: 1000,
    image: "peasant.png",
    priceGrowth: 1.12,
    incomeGrowth: 1.05
  }),
  new AutoClicker({
    name: "Лесник",
    baseIncome: 5,
    basePrice: 5000,
    image: "forester.png",
    priceGrowth: 1.18,
    incomeGrowth: 1.1
  })
];
