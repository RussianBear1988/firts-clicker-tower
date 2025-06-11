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

const upgrades = [
  new ClickUpgrade({ name: "Кожаная перчатка", type: "absolute", value: 1, price: 10, image: "glove.png" }),
  new ClickUpgrade({ name: "Рунический перстень", type: "absolute", value: 5, price: 500, image: "ring.png" }),
  new ClickUpgrade({ name: "Ожерелье на нитке", type: "absolute", value: 25, price: 5000, image: "neckless.png" })
];

