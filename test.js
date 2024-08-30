describe("Sprite Initialization", function () {
  it("should initialize player with correct properties", function () {
    expect(player.position).to.deep.equal({ x: 0, y: 0 });
    expect(player.health).to.equal(100);
  });

  it("should initialize enemy with correct properties", function () {
    expect(enemy.position).to.deep.equal({ x: 400, y: 100 });
    expect(enemy.health).to.equal(100);
  });
});

describe("Game Functions", function () {
  // Test the determineWinner function
  it("should correctly determine winner based on health", function () {
    let displayText = document.querySelector("#displayText");

    // Case 1: Player 1 wins
    player.health = 80;
    enemy.health = 60;
    determineWinner({ player, enemy, timerId: null });
    expect(displayText.innerHTML).to.equal("Player 1 wins");

    // Case 2: Player 2 wins
    player.health = 30;
    enemy.health = 50;
    determineWinner({ player, enemy, timerId: null });
    expect(displayText.innerHTML).to.equal("Player 2 Wins");

    // Case 3: Tie
    player.health = 50;
    enemy.health = 50;
    determineWinner({ player, enemy, timerId: null });
    expect(displayText.innerHTML).to.equal("TIE");
  });

  // Test the decreaseTimer function
  it("should decrease the timer and determine winner when time runs out", function (done) {
    this.timeout(3000); // Extend timeout for async test

    timer = 3;
    decreaseTimer();

    setTimeout(() => {
      expect(timer).to.equal(0);
      let displayText = document.querySelector("#displayText");
      expect(displayText.style.display).to.equal("flex");
      done();
    }, 3100);
  });
});
