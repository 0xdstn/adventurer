var sCount = document.getElementById('s_count');
var cCount = document.getElementById('c_count');
var hCount = document.getElementById('h_count');
var dCount = document.getElementById('d_count');
var outputText = document.getElementById('output_text');
var returnBtn = document.getElementById('return');
var resetBtn = document.getElementById('reset');
var listBtn = document.getElementById('list');
var closeBtn = document.getElementById('close');
var customWrapper = document.getElementById('custom_wrapper');
var saveBtn = document.getElementById('save');
var resetListBtn = document.getElementById('reset_list');
var sPile = document.getElementById("spades");
var cPile = document.getElementById("clubs");
var hPile = document.getElementById("hearts");
var dPile = document.getElementById("diamonds");
var listInput = document.getElementById('list_input');

const defaultList = {
    "SA": "Island",
    "S2": "Ancient ruin",
    "S3": "Town or Village",
    "S4": "Wood or Forrest",
    "S5": "Castle",
    "S6": "Safe House",
    "S7": "Place of worship",
    "S8": "Battlefield",
    "S9": "Barren landscape",
    "S1": "Gardens",
    "SJ": "Coastline",
    "SQ": "City",
    "SK": "Palace",        
    "CA": "A new species",
    "C2": "A new / old foe",
    "C3": "A wandering spirit",
    "C4": "A lone traveller",
    "C5": "A tyrant king",
    "C6": "A scholar",
    "C7": "An ancient evil",
    "C8": "An unknown presence",
    "C9": "A beast",
    "C1": "The plants",
    "CJ": "A playful creature",
    "CQ": "A new/ old love",
    "CK": "A bandit leader",
    "HA": "A sign",
    "H2": "Natural disaster",
    "H3": "Lost on way",
    "H4": "Met an interesting stranger",
    "H5": "Extreme weather",
    "H6": "Cross dangerous terrain",
    "H7": "Attacked at camp",
    "H8": "Taken in by strangers",
    "H9": "Saw Death",
    "H1": "Wild animals",
    "HJ": "A vision",
    "HQ": "An illness",
    "HK": "Path blocked",
    "DA": "The remains of a past visitor",
    "D2": "Ancient artefact",
    "D3": "Unknown object",
    "D4": "A book",
    "D5": "A curse or spell",
    "D6": "A lost treasure",
    "D7": "A trinket",
    "D8": "A mechanical contraption",
    "D9": "A map",
    "D1": "A small box",
    "DJ": "A weapon",
    "DQ": "A toy",
    "DK": "A new food"
};

var list = {...defaultList};

function setLocalDeck(d) {
    var tmpDeck = [];
    for(var s in d) {
        for(var c in d[s]) {
            tmpDeck.push(`${s}${d[s][c]}`);
        }
    }
    window.localStorage.setItem('deck',tmpDeck.join(','));
}

function getLocalDeck() {
    var localDeck = window.localStorage.getItem('deck');
    var tmpDeck = {};
    if(localDeck !== null && localDeck !== '') {
        localDeck.split(',').forEach(c => {
            if(tmpDeck[c[0]] === undefined) {
                tmpDeck[c[0]] = []; 
            }
            tmpDeck[c[0]].push(c[1]);
        });
        deck = tmpDeck;
    }
}

function newDeck() {
    var tmpDeck = {};
    ['S','C','H','D'].forEach(s => {
        tmpDeck[s] = [];
        ['A','2','3','4','5','6','7','8','9','1','J','Q','K'].forEach(c => {
            tmpDeck[s].push(c);
        });
    });
    setLocalDeck(tmpDeck);
    deck = tmpDeck;
}

function updateCounts() {
    if(deck.S !== undefined) { sCount.innerHTML = (deck.S.length<10?'0':'')+deck.S.length.toString() }
    if(deck.C !== undefined) { cCount.innerHTML = (deck.C.length<10?'0':'')+deck.C.length.toString() }
    if(deck.H !== undefined) { hCount.innerHTML = (deck.H.length<10?'0':'')+deck.H.length.toString() }
    if(deck.D !== undefined) { dCount.innerHTML = (deck.D.length<10?'0':'')+deck.D.length.toString() }
}

function getCardName(key) {
    var sp = key.split('');
    var name = '';

    switch(sp[0]) {
        case 'S':
            name += '<span class="out-suit">&spades;</span>';
            break;
        case 'C':
            name += '<span class="out-suit">&clubs;</span>';
            break;
        case 'H':
            name += '<span class="out-suit red">&hearts;</span>';
            break;
        case 'D':
            name += '<span class="out-suit red">&diams;</span>';
            break;
    }

    if(sp[1] === '1') {
        name += '10';
    } else {
        name += sp[1];
    }

    return name;
}

function drawCard(s) {
    if(deck[s] !== undefined && deck[s].length > 0) {
        var c = deck[s][Math.floor((Math.random()*deck[s].length))];
        const card = `${s}${c}`;
        outputText.innerHTML = getCardName(card)+'<br>'+list[card];
        returnBtn.classList.add('show');
        returnBtn.setAttribute('data-card',card);
        deck[s].splice(deck[s].indexOf(c),1);
        if(deck[s] === undefined) {
            deck[s] = [];
        }
        setLocalDeck(deck);
        updateCounts();
    }
}

function getLocalList() {
    var localList = window.localStorage.getItem('list');
    if(localList !== null && localList !== '') {
        localList.split(',').forEach(ln => {
            var sp = ln.split(':');
            if(sp.length === 2 && sp[0].length === 2 && list[sp[0]] !== undefined) {
                list[sp[0]] = sp[1];
            }
        });
    }
}

function updateLocalList() {
    var localList = [];
    for(var c in list) {
        localList.push(`${c}:${list[c]}`);
    }
    window.localStorage.setItem('list',localList.join(','));
}

var deck = {};
getLocalDeck();
if(
    deck.S === undefined && 
    deck.C === undefined &&
    deck.H === undefined &&
    deck.D === undefined
) {
    newDeck()
}
updateCounts();
getLocalList();

resetBtn.addEventListener('click',function(){
    outputText.innerHTML = '';
    returnBtn.classList.remove('show');
    newDeck();
    updateCounts();
});

listBtn.addEventListener('click',function(){
    customWrapper.classList.add('open');
});

closeBtn.addEventListener('click',function(){
    customWrapper.classList.remove('open');
});

saveBtn.addEventListener('click',function(){
    var input = listInput.value.split('\n');
    var tmpList  = {};
    var count = 0;
    input.forEach(ln => {
        var sp = ln.split(':');
        if( sp.length === 2 && sp[0].length == 2 && list[sp[0]] !== undefined) {
            tmpList[sp[0]] = sp[1];
            count++;
        }
    });
    if(Object.keys(tmpList).length === 52) {
        list = tmpList;
        updateLocalList();
    }
    customWrapper.classList.remove('open');
});

resetListBtn.addEventListener('click',function(){
    list = {...defaultList};
    updateLocalList();
    customWrapper.classList.remove('open');
});

returnBtn.addEventListener('click',function(){
    returnBtn.classList.remove('show');
    outputText.innerHTML = '';
    var card = returnBtn.getAttribute('data-card');
    deck[card[0]].push(card[1]);
    updateCounts();
});

sPile.addEventListener('click',function(){ drawCard('S') });
cPile.addEventListener('click',function(){ drawCard('C') });
hPile.addEventListener('click',function(){ drawCard('H') });
dPile.addEventListener('click',function(){ drawCard('D') });
