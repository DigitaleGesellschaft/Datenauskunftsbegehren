
import { mount } from 'svelte'
import './global.css';
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
      return
    }
  }

  const dataModule = await import('./data.js')
  const data = dataModule.data

  const res = await fetch('./data.json')
  if (res.ok) {
    const json = await res.json();
    await data.load(json)
  }
}

init();

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app