$(function() {
    var cards = [];
    var cur = -1;

    function trim(s) {
        return s.replace(/^\s*(.*?)\s*$/, '$1');
    }
    
    function dataLoaded(data) {
        var lines = trim(data).split('\n');
        for (var i in lines) {
            var line = lines[i].split(/\s+\=\s+/);
            if (line.length == 2) {
                cards.push(line);
            }
        }
        shuffle();
        next();
    }

    function shuffle() {
        for (var i in cards) {
            var j = Math.floor(Math.random() * cards.length);
            var t = cards[i];
            cards[i] = cards[j];
            cards[j] = t;
        }
    }

    function next() {
        cur += 1;
        if (cur >= cards.length) {
            shuffle();
            cur = 0;
        }
        var side = Math.floor(Math.random() * 5) % 2;
        $('#zh').text(side == 1 ? cards[cur][0] : '');
        $('#en').text(side == 0 ? cards[cur][1] : '');
    }

    function show() {
        $('#zh').text(cards[cur][0]);
        $('#en').text(cards[cur][1]);
    }
    
    $.get('./data.txt', '', dataLoaded);

    $('#next').click(next);
    $('#show').click(show);
});