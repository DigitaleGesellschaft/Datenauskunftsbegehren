import { readable, writable, get } from 'svelte/store';
import {nl2br, br2nl} from './lib.js'
import { throttle } from 'lodash-es';
import {data as d, validateUserData, getValidUserData, getOrgHistoryMessage} from './data.js';

export const data = readable(d)
export const messages = writable([])

window.addEventListener('hashchange', (event) => {
  userData.update(() => {
    return getUserDataFromHash()
  })
})

function getUserDataFromHash() {
  const hash = window.location.hash;
  if (hash.length === 0) return {}
  try {
    const data = JSON.parse(decodeURI(hash.slice(1)))
    const validState = validateUserData(data)
    if (validState.isValid) {
      return data
    } else {
      messages.update(messages => {
        messages.push(...validState.messages)
        return messages
      })
      return getValidUserData(data)
    }
  } catch (err) {
    console.error("URL fragment parsing failed!")
    console.error(err)
    return {}
  }
}

let lastStep
function setUserDataToHash(data) {
  // we version everything, so we can break the data model in the future
  // but still support v1
  data.v = 1
  const hash = encodeURI(JSON.stringify(data))
  const title = `Datenauskunftsbegehren - ${data.step}`;

  // only if the step changes, we want to push a new state to the history
  // otherwise we are going to replace the state
  let pushState = false
  if (data.step) {
    if (data.step !== lastStep) {
      lastStep = data.step;
      pushState = true;
    }
  }

  if (pushState) {
    window.history.pushState({step: data.step}, title, `#${hash}`)
  } else {
    window.history.replaceState({step: data.step}, title, `#${hash}`)
  }
}

// We should not call replaceState than 100 times in 30s
// as some browsers throw if done so.
// we throttle to update max once per 300ms
const setUserDataToHashThrottled = throttle(setUserDataToHash, 300, {
  leading: true,
  trailing: true
})

function updateMessages(userData) {
  const orgHistoryMessage = getOrgHistoryMessage(userData)
  messages.update(messages => {
    const newMessages = messages
      .filter(message => message.type === 'error')
    if (orgHistoryMessage) newMessages.push(orgHistoryMessage)
    return newMessages
  })
}

const updateMessagesThrottled = throttle(updateMessages, 300, {
  leading: true,
  trailing: true
})

const currentUserData = getUserDataFromHash()
export const userData = writable(currentUserData)
userData.subscribe(val => {
  setUserDataToHashThrottled(val)
  updateMessagesThrottled(val)
})

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

export const userDesire = writable(currentUserData.desire)
userDesire.subscribe(desire => {
  userData.update(userData => {
    if (!desire || desire === '') {
      delete userData.desire
    } else {
      userData.desire = desire
    }
    return userData;
  })
})

userData.subscribe(val => {
  console.log("subscribe: " + val)
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
  /**
   * ggf. erweitern auf "step / desire", datum versand / datum antwort des jeweiligen begehrens
   */
  if (val.desire) {
    const isSame = get(userDesire) === val.desire
    const isEmpty = val.desire.length === 0
    if (!isSame || isEmpty) {
      userDesire.set(val.desire)
    }
  }
})

const currentImages = get(userData).idImages ? get(userData).idImages : {
  front: undefined,
  back: undefined
}

export const idImages = writable(currentImages)
