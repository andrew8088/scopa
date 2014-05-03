Turns = {};

Turns.inHand = function (set, card) {
    for (var i = 0; i < set.length; i++) {
        if (matchCard(set[i], card)) return true; 
    }
    return false;
};

function matchCard(a, b) {
    return a.suit === b.suit && a.value === b.value;
}

Turns.getMatch = function (card, set) {
    var matches = Turns.findMatches(card, set);
    if (matches.length > 0) {
        return Turns.bestMatch(matches);
    }
    return null;
};

Turns.findMatches = function (card, set) {
    var matches = [];
    set.forEach(function (tableCard) {
        if (tableCard.value === card.value) matches.push([tableCard]);
    });

    if (matches.length > 0) return matches;

    for (var i = 2; i <= set.length; i++) {
        combinations(set, i, function (potentialMatch) {
            if (sumCards(potentialMatch) === card.value) matches.push(potentialMatch.slice());
        });
    }
    return matches;
};

Turns.bestMatch = function (matches) {
    var mostCoins = [0, null],
        mostCards = [0, null];

    for (var i = 0; i < matches.length; i++) {
        var match = matches[i];

        for (var j = 0; j < match.length; j++)
            if (match[j].suit === 'Coins' && match[j].value === 7) return match;

        var coinCount = match.filter(function (card) { return card.suit === 'Coins' }).length;

        if (coinCount > mostCoins[0]) mostCoins = [coinCount, match];
        if (match.length > mostCards[0]) mostCards = [match.length, match];
    }

    return (mostCards[0] > mostCoins[0]) ? mostCards[1] : mostCoins[1];
};

Turns.takeMatch = function (game, id, card, match) {
    match.forEach(function (matchCard) {
        game.players[id].pile.push(matchCard);
        game.table = Turns.removeCard(matchCard, game.table);
    });

    game.players[id].pile.push(card);
    game.lastScorer = id;
    
    if (game.table.length === 0) {
        game.players[id].score.scopa++; 
    }
};

Turns.removeCard = function (card, set) {
    return set.filter(function (setCard) {
        return !matchCard(card, setCard);
    });
};

function sumCards(set) {
    return set.reduce(function (a, b) {
        return a + b.value; 
    }, 0);
}

function combinations(numArr, choose, callback) {
    var n = numArr.length;
    var c = [];
    var inner = function(start, choose_) {
        if (choose_ == 0) {
            callback(c);
        } else {
            for (var i = start; i <= n - choose_; ++i) {
                c.push(numArr[i]);
                inner(i + 1, choose_ - 1);
                c.pop();
            }
        }
    }
    inner(0, choose);
}
