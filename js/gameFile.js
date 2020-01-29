file = {
    energy: 0,
    spentEnergy: 0,

    pupinitInterval: 0,
    pupreduceSpeedUp: 0,
    puptimeBonus: 0,
    puppointsGainUp: 0,
    pupscoreToEnergy: 0,

    skillcomboLines: false,
    skillnoBomb: false,
    skillsuddenDeath: false,
    skillrandomLiner: false,

    bloc1: false,
    bloc2: false,
    bloc3: false,
    bloc4: false,
    bloc5: false,
    bloc6: false,
    bloc7: false,
    bloc8: false,
    bloc9: false,

};

var loading = true;

function save() {

    console.log('saving');
    localStorage.setItem('energy', file.energy);

    localStorage.setItem('spentEnergy', file.spentEnergy);

    localStorage.setItem('pupinitInterval', file.pupinitInterval);
    localStorage.setItem('pupreduceSpeedUp', file.pupreduceSpeedUp);
    localStorage.setItem('puptimeBonus', file.puptimeBonus);
    localStorage.setItem('puppointsGainUp', file.puppointsGainUp);
    localStorage.setItem('pupscoreToEnergy', file.pupscoreToEnergy);

    localStorage.setItem('skillcomboLines', file.skillcomboLines);
    localStorage.setItem('skillnoBomb', file.skillnoBomb);
    localStorage.setItem('skillsuddenDeath', file.skillsuddenDeath);
    localStorage.setItem('skillrandomLiner', file.skillrandomLiner);

    localStorage.setItem('bloc1', file.bloc1);
    localStorage.setItem('bloc2', file.bloc2);
    localStorage.setItem('bloc3', file.bloc3);
    localStorage.setItem('bloc4', file.bloc4);
    localStorage.setItem('bloc5', file.bloc5);
    localStorage.setItem('bloc6', file.bloc6);
    localStorage.setItem('bloc7', file.bloc7);
    localStorage.setItem('bloc8', file.bloc8);
    localStorage.setItem('bloc9', file.bloc9);

    console.log('saving complete');
}

function load() {

    console.log('loading', localStorage);

    var energyString = localStorage.getItem('energy');

    if (isNaN(energyString)) {
        file.energy = 0;
    } else {
        file.energy = energyString;
    }


    document.getElementById('energy').innerHTML = file.energy;


    for (let i = 0; i < localStorage.getItem('pupinitInterval'); i++) {buyPowerUp('initInterval');}

    for (let i = 0; i < localStorage.getItem('pupreduceSpeedUp'); i++) {buyPowerUp('reduceSpeedUp');}
    for (let i = 0; i < localStorage.getItem('puptimeBonus'); i++) {buyPowerUp('timeBonus');}
    for (let i = 0; i < localStorage.getItem('puppointsGainUp'); i++) {buyPowerUp('pointsGainUp');}
    for (let i = 0; i < localStorage.getItem('pupscoreToEnergy'); i++) {buyPowerUp('scoreToEnergy');}

    if (localStorage.getItem('skillcomboLines') == 'true') buySkill('comboLines');
    if (localStorage.getItem('skillnoBomb') == 'true') buySkill('noBomb');
    if (localStorage.getItem('skillsuddenDeath') == 'true') buySkill('suddenDeath');
    if (localStorage.getItem('skillrandomLiner') == 'true') buySkill('randomLiner');

    if (localStorage.getItem('bloc1') == 'true') buyPiece(0);
    if (localStorage.getItem('bloc2') == 'true') buyPiece(1);
    if (localStorage.getItem('bloc3') == 'true') buyPiece(2);
    if (localStorage.getItem('bloc4') == 'true') buyPiece(3);
    if (localStorage.getItem('bloc5') == 'true') buyPiece(4);
    if (localStorage.getItem('bloc6') == 'true') buyPiece(5);
    if (localStorage.getItem('bloc7') == 'true') buyPiece(6);
    if (localStorage.getItem('bloc8') == 'true') buyPiece(7);
    if (localStorage.getItem('bloc9') == 'true') buyPiece(8);

    loading = false;

    console.log('loaded succesfully');
}