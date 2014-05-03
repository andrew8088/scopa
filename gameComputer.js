takeComputerTurn = function (gameId) {
    var game = Games.findOne(gameId),
        id   = Meteor.users.findOne({ username: 'computer'})._id,
        hand = game.players[id].hand,
        matches = [];

    hand.forEach(function (card) {
        var cardMatches = Turns.findMatches(card, game.table),
            match = Turns.bestMatch(cardMatches) || [];
        matches.push(match);
    });

    var bestMatch = Turns.bestMatch(matches);

    var cardToPlay;
    if (bestMatch) {
        cardToPlay = hand[matches.indexOf(bestMatch)]; 
    } else {
        cardToPlay = hand.sort(function (a, b) {
            return a.value - b.value;
        })[0];
    }

    Meteor.call('takeTurn', gameId, id, cardToPlay);
};
