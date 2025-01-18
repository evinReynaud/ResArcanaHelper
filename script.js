/* Lieux
* Bosquet Sacré // Tour de l'Alchimiste
* Catacombes de la Mort // Puits Sacrificiel
* Forge Maudite // Mine des Nains
* Manoir de Corail // Récif des Naufrageurs
* Repaire des Dragons // Bestiaire du Sorcier
*
* Ext 1
* Antre du Dragon // Forteresse de Cristal
* Temple des Abysses // Porte des Enfers
*
* Ext 2
* Île Sanguinaire // Berceau de Perles
* Ménagerie Mystique // Laboratoire Alchimique
*
* Duo
* Grande Forge Naine // Cœur des bois Elfiques
* Mégalithes Sacrés // Tanière de Dragon
* */

const places = [
  {name: "Bosquet Sacré",          opposite: 1, sunSide: true, extension: undefined},
  {name: "Tour de l'Alchimiste",   opposite: 0, sunSide: false, extension: undefined},
  {name: "Catacombes de la Mort",  opposite: 3, sunSide: true, extension: undefined},
  {name: "Puits Sacrificiel",      opposite: 2, sunSide: false, extension: undefined},
  {name: "Forge Maudite",          opposite: 5, sunSide: true, extension: undefined},
  {name: "Mine des Nains",         opposite: 4, sunSide: false, extension: undefined},
  {name: "Manoir de Corail",       opposite: 7, sunSide: true, extension: undefined},
  {name: "Récif des Naufrageurs",  opposite: 6, sunSide: false, extension: undefined},
  {name: "Repaire des Dragons",    opposite: 9, sunSide: true, extension: undefined},
  {name: "Bestiaire du Sorcier",   opposite: 8, sunSide: false, extension: undefined},
  {name: "Antre du Dragon",        opposite: 11, sunSide: true, extension: 'Lux et Tenebrae'},
  {name: "Forteresse de Cristal",  opposite: 10, sunSide: false, extension: 'Lux et Tenebrae'},
  {name: "Temple des Abysses",     opposite: 13, sunSide: true, extension: 'Lux et Tenebrae'},
  {name: "Porte des Enfers",       opposite: 12, sunSide: false, extension: 'Lux et Tenebrae'},
  {name: "Île Sanguinaire",        opposite: 15, sunSide: true, extension: 'Perlae Imperii'},
  {name: "Berceau de Perles",      opposite: 14, sunSide: false, extension: 'Perlae Imperii'},
  {name: "Ménagerie Mystique",     opposite: 17, sunSide: true, extension: 'Perlae Imperii'},
  {name: "Laboratoire Alchimique", opposite: 16, sunSide: false, extension: 'Perlae Imperii'},
  {name: "Grande Forge Naine",     opposite: 19, sunSide: true, extension: 'Duo'},
  {name: "Cœur des bois Elfiques", opposite: 18, sunSide: false, extension: 'Duo'},
  {name: "Mégalithes Sacrés",      opposite: 21, sunSide: true, extension: 'Duo'},
  {name: "Tanière de Dragon",      opposite: 20, sunSide: false, extension: 'Duo'},
];

const basePlaces = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const ext1Places = [10, 11, 12, 13];
const ext2Places = [14, 15, 16, 17];
const ext3Places = [18, 19, 20, 21];

const twoPlayersPlacesAmount = {
  standard: 4,
  duo: 2
};

const STATE = {
  isBaseGameSelected: true,
  isOnlyDuo: false
};

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('placesForm');
  const submitButton = document.getElementById('submit');

  const ext1Checkbox = document.getElementById('ext1');
  const ext2Checkbox = document.getElementById('ext2');

  const playersSelect = document.getElementById('players');
  const twoPlayersOption = document.getElementById('2p');
  const threePlayersOption = document.getElementById('3p');
  const fourPlayersOption = document.getElementById('4p');
  const fivePlayersOption = document.getElementById('5p');

  const placesList = document.getElementById('placesList');
  const errorMessageNoBaseGame = document.getElementById('errorMessageNoBaseGame');

  form.oninput = checkForm;

  form.onsubmit = submitForm;

  function checkForm() {
    const formProps = Object.fromEntries(new FormData(form));

    checkValidForm(formProps);
    checkIsBaseGameSelected(formProps);
    checkIsOnlyDuo(formProps);
    checkIsFivePlayersAllowed(formProps);
  }

  function checkValidForm(formProps) {
    if ( // Both base game and Duo extension are unselected
        formProps.ext0 !== 'on' &&
        formProps.ext3 !== 'on' &&
        !submitButton.disabled
    ) {
      submitButton.setAttribute('disabled', '');
      errorMessageNoBaseGame.removeAttribute('hidden');
    } else if (submitButton.disabled) {
      submitButton.removeAttribute('disabled');
      errorMessageNoBaseGame.setAttribute('hidden', '');
    }
  }

  function checkIsBaseGameSelected(formProps) {
    if (formProps.ext0 === 'on' && !STATE.isBaseGameSelected) {
      // Base game is selected, enabling all extensions
      STATE.isBaseGameSelected = true;
      ext1Checkbox.removeAttribute('disabled');
      ext2Checkbox.removeAttribute('disabled');
    } else if (formProps.ext0 !== 'on' && STATE.isBaseGameSelected) {
      // Base game is not selected, disabling all extensions
      STATE.isBaseGameSelected = false;
      ext1Checkbox.checked = false;
      ext1Checkbox.setAttribute('disabled', '');
      ext2Checkbox.checked = false;
      ext2Checkbox.setAttribute('disabled', '');
    }
  }

  function checkIsOnlyDuo(formProps) {
    if (isOnlyDuoSelected(formProps) && !STATE.isOnlyDuo) {
      // Only Duo is selected, updating player count
      STATE.isOnlyDuo = true;
      playersSelect.value = '2';
      twoPlayersOption.innerText = `2 joueurs (${twoPlayersPlacesAmount.duo} lieux de puissance)`;
      threePlayersOption.setAttribute('disabled', '');
      fourPlayersOption.setAttribute('disabled', '');
      fivePlayersOption.setAttribute('disabled', '');
    } else if (!isOnlyDuoSelected(formProps) && STATE.isOnlyDuo) {
      // Base game is selected, updating player count
      STATE.isOnlyDuo = false;
      twoPlayersOption.innerText = `2 joueurs (${twoPlayersPlacesAmount.standard} lieux de puissance)`;
      threePlayersOption.removeAttribute('disabled');
      fourPlayersOption.removeAttribute('disabled');
      checkIsFivePlayersAllowed(formProps);
    }
  }

  function isOnlyDuoSelected(formProps) {
    return formProps.ext3 === 'on' && formProps.ext0 !== 'on';
  }

  function checkIsFivePlayersAllowed(formProps) {
    if (formProps.ext1 !== 'on' && formProps.ext2 !== 'on') {
      disableFivePlayers();
    } else {
      fivePlayersOption.removeAttribute('disabled');
    }
  }

  function disableFivePlayers() {
    fivePlayersOption.setAttribute('disabled', '');
    if (playersSelect.value === '5') {
      playersSelect.value = '2';
    }
  }

  function submitForm(e) {
    e.preventDefault();
    const formProps = Object.fromEntries(new FormData(e.target));

    const nbOfPlaces = computeNbOfPlaces(formProps)
    const results = computePlaces(
        formProps.ext0 === 'on',
        formProps.ext1 === 'on',
        formProps.ext2 === 'on',
        formProps.ext3 === 'on',
        nbOfPlaces
    );

    displayResults(results);
  }

  function computeNbOfPlaces(formProps) {
    if (isOnlyDuoSelected(formProps)) {
      return 2;
    } else return Number(formProps.players) + 2;
  }

  function computePlaces(ext0, ext1, ext2, ext3, nbOfPlaces, bannedPlaces = [], allowBothFaces = false) {
    let possiblePlaces = [];
    if (ext0) {
      possiblePlaces = [...possiblePlaces, ...basePlaces];
    }
    if (ext1) {
      possiblePlaces = [...possiblePlaces, ...ext1Places];
    }
    if (ext2) {
      possiblePlaces = [...possiblePlaces, ...ext2Places];
    }
    if (ext3) {
      possiblePlaces = [...possiblePlaces, ...ext3Places];
    }
    possiblePlaces = possiblePlaces.filter(p => !bannedPlaces.includes(p));

    const picks = [];

    while (picks.length < nbOfPlaces) {
      picks.push(places[getAndRemove(possiblePlaces, getRandomInt(possiblePlaces.length))]);
      if (!allowBothFaces) {
        removeValue(possiblePlaces, picks[picks.length - 1].opposite);
      }
    }
    return picks;
  }

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function getAndRemove(array, index) {
    const v = array[index];
    array.splice(index, 1);
    return v;
  }

  function removeValue(array, value) {
    const i = array.findIndex(v => v === value)
    if (i < 0) {
      console.log('Could not find item', value, 'in array', array);
    } else {
      array.splice(i, 1);
    }
  }

  function displayResults(results) {
    placesList.innerHTML = '<ul>' +
      results.map(r => placeLine(r)).join('') +
      '</ul>';
  }

  function placeLine(place) {
    return `<li><span class="dot ${place.sunSide ? 'sun': 'moon'}"></span><span>${place.name}</span>` +
      (place.extension ? `<span class="extension"><small> - ${place.extension}</small></span>` : '') + '</li>';
  }

  checkForm(); // Initial check
});
