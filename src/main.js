
import { mount } from 'svelte'
import './global.css';
import './i18n.js';
import { waitLocale } from 'svelte-i18n'
import App from './App.svelte'


const featureTests = [
  () => {
    const matches = [...'a'.matchAll(/(?<name>[a])/g)]
    if (matches[0].groups.name !== 'a') {
      throw new Error('failed named capture group test')
    }
  },
  () => {
    if (![].flatMap) {
      throw new Error('Array.prototype.flatMap is not defined')
    }
  },
]

function getCorrespondenceLanguage() {
  const defaultLang = import.meta.env.VITE_DEFAULT_LANG
  const defaultCorLang = ['de', 'fr'].includes(defaultLang) ? defaultLang : 'de'
  const hash = window.location.hash;
  if (hash.length === 0) return defaultCorLang;
  try {
    const data = JSON.parse(decodeURI(hash.slice(1)));
    return data.langCor || defaultCorLang;
  } catch {
    return defaultCorLang;
  }
}

async function init() {
  for (const test of featureTests) {
    try {
      test()
    } catch (err) {
      console.error('your browser is too old', err)
      const errorMessage = document.createElement('div')
      errorMessage.innerHTML = 'Dein Browser ist veraltet. Bitte verwende eine aktuelle Version des Browsers deiner Wahl.'
      errorMessage.setAttribute('id', 'outdated-browser')
      document.body.appendChild(errorMessage)
      return false
    }
  }

  const dataModule = await import('./data.js')
  const data = dataModule.data

  const langCor = getCorrespondenceLanguage()
  const dataFile = langCor === 'fr' ? 'data_fr.json' : 'data_de.json'
  let res
  try {
    res = await fetch(`./${dataFile}`)
  } catch (err) {
    res = null
  }
  function showDataMissingError() {
    document.querySelector('#loader').remove()
    const errorMessage = document.createElement('div')
    errorMessage.setAttribute('id', 'data-missing')
    errorMessage.innerHTML = `Die Datendatei <code>${dataFile}</code> konnte nicht geladen werden.<br><br>` +
      `Bitte stelle sicher, dass <code>data_de.json</code> und <code>data_fr.json</code> im <code>public</code>-Ordner vorhanden sind.<br>` +
      `Die Dateien sind verfügbar unter: <a href="https://github.com/DigitaleGesellschaft/Datenauskunftsbegehren-Data/releases">github.com/DigitaleGesellschaft/Datenauskunftsbegehren-Data/releases</a>`
    document.body.appendChild(errorMessage)
  }

  if (!res || !res.ok) {
    showDataMissingError()
    return false
  }
  let json
  try {
    json = await res.json()
  } catch (err) {
    showDataMissingError()
    return false
  }
  await data.load(json)
  return true
}

const ready = await init();
if (ready) {
  await waitLocale();

  mount(App, {
    target: document.getElementById('app'),
  })
}