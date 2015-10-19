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
        var side = $('#dir').val();
        switch (side) {
            case 'both': side = Math.floor(Math.random() * 5) % 2; break;
            case 'zh' : side = 1; break;
            case 'en' : side = 0; break;
        }
        $('#zh2').text('');
        $('#zh').text(side == 1 ? cards[cur][0] : '');
        $('#en').text(side == 0 ? cards[cur][1] : '');
    }

    function show() {
        var zh = $('#zh');
        var zhText = cards[cur][0];
        if (zh.text()) {
            zh.text(zhText);
        } else {
            $('#zh2').text(zhText);
        }
        $('#en').text(cards[cur][1]);
    }

    function hide() {
        cards.splice(cur, 1);
        cur -= 1;
        next();
    }
    
    function param(key) {
        var s = location.href;
        var pattern = '[\\?\\&]' + key + '\\=';
        if (!new RegExp(pattern).test(s)) {
            return null;
        }
        var replPattern = new RegExp(pattern + '([A-Za-z0-9\\-]+)');
        var m = s.match(replPattern);
        return m[1];
    }
    
    function loadTopic(topic) {
        $.get('./data/' + topic + '.txt', '', dataLoaded);
    }

    function listLinks() {
        var s = location.href;
        var m = s.match(/.*\/(.*)\.github\.io.*/);
        $.get("https://api.github.com/repos/" + (m != null ? m[1] : 'rodiongork') + "/chinese-flash-cards/contents/data", function(data) {
            var en = $('#en');
            for (var i in data) {
                var title = data[i]['name'].replace(/\..*/, '');
                var href = s + '?topic=' + title;
                $('<a/>').text(title).attr('href', href).appendTo(en);
            }
        });
    }

    function toList() {
        location.href = location.href.replace(/\?.*/, '');
    }
    
    var topic = param('topic');
    if (topic) {
        loadTopic(topic);
        $('#next').click(next);
        $('#hide').click(hide);
        $('#show').click(show);
        $('#back').click(toList);
    } else {
        listLinks();
    }
    
});
