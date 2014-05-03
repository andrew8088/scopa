scoreGame = function (game) {
    // most cards
    // most coins
    // sette bello
    // primera
    // scopa

    game.players[game.lastScorer].pile.push.apply(game.players[game.lastScorer].pile, game.table);
    game.table = [];
    game.inProgress = false;
    game.finished = new Date();

    var mostCards = ['x', -1],
        mostCoins = ['x', -1],
        highestPrimera = ['x', -1];

    Object.keys(game.players).forEach(function (id) {
        var pile = game.players[id].pile


        var cardCount = pile.length;
        if (cardCount > mostCards[1]) {
            mostCards = [id, cardCount];
        } else if (cardCount === mostCards[1]) {
            mostCards = false;
        }


        var coinCount = suit('Coins', pile).length;
        if (coinCount > mostCoins[1]) {
            mostCoins = [id, coinCount];
        } else if (coinCount === mostCoins[1]) {
            mostCoins = false;
        }

        if (hasSetteBello(pile)) {
            game.players[id].score.setteBello = 1;
        }

        var primera = getPrimera(pile);
        if (primera > highestPrimera[1]) {
            highestPrimera = [id, primera];
        } else if (primera === highestPrimera[1]) {
            highestPrimera = false;
        }
    });

    if (mostCards) game.players[mostCards[0]].score.mostCards = 1;
    if (mostCoins) game.players[mostCoins[0]].score.mostCoins = 1;
    if (highestPrimera) game.players[highestPrimera[0]].score.primera = 1;

    var highest  = ['x', -1];

    Object.keys(game.players).forEach(function (id) {
        var s = game.players[id].score;

        game.players[id].score.total = s.mostCards + s.mostCoins + s.primera + s.setteBello + s.scopa;
        
        if (game.players[id].score.total > highest[1]) {
            highest = [id, game.players[id].score.total];
        } else if (game.players[id].score.total === highest[1]) {
            highest = false;
        }
    });
    game.winner = highest ? highest[0] : "tie";
};

var primeraPoints = { 
    '7': 21, 
    '6': 18, 
    '1': 16, 
    '5': 15, 
    '4': 14, 
    '3': 13, 
    '2': 12, 
    '10': 10, 
    '8': 0, 
    '9': 0
};

function getPrimera(set) {
    var cards = [suit('Coins', set), suit('Cups', set) , suit('Clubs', set), suit('Swords', set)];

    return cards.map(function (suit) {
        return suit.map(function (card) {
            return primeraPoints[card.value];
        }).sort(function (a, b) { return b - a; })[0];
    }).reduce(function (a, b) {
        return a + b;    
    });
}

function hasSetteBello(set) {
    return _.some(set, function (card) {
        return card.suit === 'Coins' && card.value === 7;
    });
}

function suit(suit, cards) {
    return cards.filter(function (card) {
        return card.suit === suit;
    });
}
