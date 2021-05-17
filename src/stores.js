import { readable, writable, get } from 'svelte/store';
import {nl2br, br2nl, ab2str} from './lib.js'
import d from './data.js';
export const data = readable(d)

let lastStep

const currentUserData = getUserDataFromHash()
export const userData = writable(currentUserData)
userData.subscribe(val => {
  // only if the step changes, we want to push a new state to the history
  // otherwise we are going to replace the state
  let pushState = false
  if (val.step) {
    if (val.step !== lastStep) {
      lastStep = val.step;
      pushState = true;
    }
  }
  setUserDataToHash(val, pushState)
})

window.addEventListener('hashchange', (event) => {
  userData.update(() => {
    return getUserDataFromHash()
  })
})

function getUserDataFromHash() {
  const hash = window.location.hash;
  if (hash.length === 0) return {}
  try {
    return JSON.parse(decodeURI(hash.slice(1)))
  } catch (err) {
    console.error("URL fragment parsing failed!")
    console.error(err)
    return {}
  }
}

function setUserDataToHash(data, pushState = false) {
  // we version everything so we can break the data model in the future
  // but still support v1
  data.v = 1
  const hash = encodeURI(JSON.stringify(data))
  const title = `Datenauskunftsbegehren - ${data.step}`;
  if (pushState) {
    window.history.pushState({step: data.step}, title, `#${hash}`)
  } else {
    window.history.replaceState({step: data.step}, title, `#${hash}`)
  }
}

export const userAddressHtml = writable(nl2br(currentUserData.address))
userAddressHtml.subscribe(address => {
  userData.update(userData => {
    if (!address || address === '') {
      delete userData.address
    } else {
      userData.address = br2nl(address)
    }
    return userData;
  })
})
export const orgAddressHtml = writable(nl2br(currentUserData.orgAddressEntry))
orgAddressHtml.subscribe(orgAddressEntry => {
  userData.update(userData => {
    if (!orgAddressEntry || orgAddressEntry === '') {
      delete userData.orgAddressEntry
    } else {
      userData.orgAddressEntry = br2nl(orgAddressEntry)
    }
    return userData;
  })
})
userData.subscribe(val => {
  if (val.address) {
    // only update if different
    const isSame = br2nl(get(userAddressHtml)) === val.address
    const isEmpty = val.address.length === 0
    if (!isSame || isEmpty) {
      userAddressHtml.set(nl2br(val.address))
    }
  }
  if (val.orgAddressEntry) {
    // only update if different
    const isSame = br2nl(get(orgAddressHtml)) === val.orgAddressEntry
    const isEmpty = val.orgAddressEntry.length === 0
    if (!isSame || isEmpty) {
      orgAddressHtml.set(nl2br(val.orgAddressEntry))
    }
  }
})

const currentImages = get(userData).idImages ? get(userData).idImages : {
  front: undefined,
  back: undefined
}

export const idImages = writable(currentImages)
