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
];

const basePlaces = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const ext1Places = [10, 11, 12, 13];
const ext2Places = [14, 15, 16, 17];

document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('placesForm').onsubmit = submitForm;
  const ext1Checkbox = document.getElementById('ext1');
  const ext2Checkbox = document.getElementById('ext2');
  const playersSelect = document.getElementById('players');
  const fivePlayersOption = document.getElementById('5p');
  const placesList = document.getElementById('placesList');

  checkAndDisableFivePlayers(ext1Checkbox.checked, ext2Checkbox.checked);

  ext1Checkbox.oninput = (e) => {
    checkAndDisableFivePlayers(e.target.checked, ext2Checkbox.checked);
  }

  ext2Checkbox.oninput = (e) => {
    checkAndDisableFivePlayers(ext1Checkbox.checked, e.target.checked);
  }

  function checkAndDisableFivePlayers(hasExt1, hasExt2) {
    if (!hasExt1 && !hasExt2) {
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
    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);
    console.log(formData); // TODO Remove
    console.log(formProps); // TODO Remove

    const results = computePlaces(
      formProps.ext1 === 'on',
      formProps.ext2 === 'on',
      Number(formProps.players)
    )

    displayResults(results);
  }

  function computePlaces(ext1, ext2, players, bannedPlaces = [], allowBothFaces = false) {
    let possiblePlaces = [...basePlaces];
    if (ext1) {
      possiblePlaces = [...possiblePlaces, ...ext1Places];
    }
    if (ext2) {
      possiblePlaces = [...possiblePlaces, ...ext2Places];
    }
    possiblePlaces = possiblePlaces.filter(p => !bannedPlaces.includes(p));

    const picks = [];

    while (picks.length < players + 2) {
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
    console.log(results); // TODO Remove
    placesList.innerHTML = '<ul>' +
      results.map(r => placeLine(r)).join('') +
      '</ul>';
  }

  function placeLine(place) {
    return `<li><span class="dot ${place.sunSide ? 'sun': 'moon'}"></span><span>${place.name}</span>` +
      (place.extension ? `<span class="extension"><small> - ${place.extension}</small></span>` : '') + '</li>';
  }
});
