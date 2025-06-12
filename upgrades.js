class ClickUpgrade {
  constructor({ name, description, type, baseValue, basePrice, image, priceGrowth, bonusGrowth }) {
    this.name = name;
    this.description = description;
    this.type = type; // "absolute" или "relative"
    this.baseValue = baseValue; // начальное значение бонуса
    this.basePrice = basePrice; // базовая стоимость
    this.image = image; // иконка
    this.level = 0;

    this.priceGrowth = priceGrowth ?? 1.15; // насколько растёт цена
    this.bonusGrowth = bonusGrowth ?? baseValue; // прирост бонуса на уровень
  }

  get value() {
    return this.type === "absolute"
      ? Math.round(this.baseValue + this.bonusGrowth * this.level)
      : Math.ceil((this.baseValue + this.bonusGrowth * this.level) * player.clickPower);
  }

  get price() {
    return Math.floor(this.basePrice * Math.pow(this.priceGrowth, this.level));
  }

  buy() {
  this.level++;
  if (this.type === "absolute") {
    player.clickPower += this.bonusGrowth;
  } else if (this.type === "relative") {
    const bonus = Math.ceil(this.bonusGrowth * player.clickPower);
    player.clickPower += bonus;
  }
  }
}

const upgrades = [
  new ClickUpgrade({
    name: "Перчатка",
    description: "Увеличивает силу клика на +1",
    type: "absolute",
    baseValue: 1,
    basePrice: 50,
    image: "glove.png",
    priceGrowth: 1.15,
    bonusGrowth: 1
  }),
  new ClickUpgrade({
    name: "Кольцо",
    description: "Увеличивает силу клика на 3 от текущего значения",
    type: "absolute",
    baseValue: 3,
    basePrice: 500,
    image: "ring.png",
    priceGrowth: 1.3,
    bonusGrowth: 0.05
  }),
  new ClickUpgrade({
    name: "Простой кулончик",
    description: "Увеличивает силу клика на 25 от текущего значения",
    type: "absolute",
    baseValue: 25,
    basePrice: 1000,
    image: "neckless.png",
    priceGrowth: 1.5,
    bonusGrowth: 0.08
  })
];

