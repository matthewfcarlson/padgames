var CardList = require("./dixit_cards.json");

var num_cards = CardList.length;



module.exports = {
    NUM_CARDS: num_cards,
    GetCardUrl: function(index){
        if (index < 0 || index >= num_cards) return false;
        return CardList[index];
    }
}