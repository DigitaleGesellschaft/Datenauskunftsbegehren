import Data from './models/Data.js';
export const data = new Data();
import { lightFormat } from 'date-fns'

function isValidOrg(org) {
  return !org || !!data.getCurrentlySelectableOrgs().find(o => o.name === org);
}

export function validateUserData(userData) {
  // if the user was already at step letter or print, we treat everything as valid
  if (userData.step === 'letter1' || userData.step === 'print1') return {
    isValid: true
  }
  const messages = [];
  let validOrg = isValidOrg(userData.org);
  if (!validOrg) {
    messages.push({
      type: 'error',
      text: `Die Organisation ${userData.org} ist nicht (mehr) im Datensatz vorhanden. Deine Eingabe wurde zurückgesetzt.`
    })
  }
  return {
    isValid: validOrg,
    messages
  }
}

export function getValidUserData(userData) {
  if (!isValidOrg(userData.org)) {
    const org = data.getOrg(userData.org);
    delete userData.org;
    if (org && userData.types) {
      userData.types = userData.types.filter(type => !org.hasType(type))
    }
  }
  return userData;
}

export function getOrgHistoryMessage(userData) {
  const org = data.getOrg(userData.org)
  if (!org) return
  if (!org.history.isCurrentlyValid()) {
    const removal = org.history.getRemoval()
    if (!removal) return
    return {
      type: 'message',
      text: `Die Organisation ${userData.org} wurde am ${lightFormat(removal.date, 'dd.MM.yyyy')} aus der Liste entfernt. ${removal.reason}`
    }
  }
  return undefined
}