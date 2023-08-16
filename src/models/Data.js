import Org from './Org.js';
import Type from './Type.js';
import Event from './Event.js';
import FollowUp from './FollowUp.js'
import Paragraph from './Paragraph.js'

export default class Data {
  constructor () {
    this.orgs = [];
    this.types = [];
    this.followups = [];
  }

  async load (data){
    const promises = []
    this.data = data;

    const types = data.types
      .map(type => {
        const t = new Type()
        promises.push(t.load({data: type}))
        return t
      })
    
    await Promise.all(promises)

    const orgs = data.orgs
      .map(org => {
        const o = new Org()
        promises.push(o.load({data: org, types}))
        return o
      })

    const events = data.events
      .map(event => {
        const e = new Event()
        promises.push(e.load({data: event}))
        return e
      })

    const followups = data.followups
      .map(followup => {
          const e = new FollowUp()
          promises.push(e.load({data: followup}))
          return e
      })

    await Promise.all(promises)

    this.types = types
      .sort((a, b) => {
        return a.label.toLowerCase().localeCompare(b.label.toLowerCase())
      })

    this.orgs = orgs
      .sort((a, b) => {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      })

    this.events = events
      .sort((a, b) => {
        return a.label.toLowerCase().localeCompare(b.label.toLowerCase())
      })

      this.followups = followups
          .sort((a , b) => {
              return a.label.toLowerCase().localeCompare(b.label.toLowerCase())
          })
  }

  getOrg(name) {
    return this.orgs.find(org => org.name === name);
  }

  getOrgs () {
    return this.orgs;
  }

  getCurrentlySelectableOrgs() {
    return this.orgs.filter(org => org.history.isCurrentlyValid())
  }

  getType (typeHandle) {
    return this.types.find(type => type.handle === typeHandle)
  }

  getTypes (onlyTypes) {
    if (onlyTypes) {
      return this.types.filter(type => onlyTypes.includes(type.handle))
    }
    return this.types
  }

  getEvent (event) {
    return this.events.find(e => e.handle === event)
  }

    getFollowUps (onlyFollowUps) {
        if (onlyFollowUps) {
            return this.followups.filter(followup => onlyFollowUps.includes(followup.handle))
        }
        return this.followups
    }

    getFollowUp(followup) {
        return this.followups.find(followup => followup.handle === followup)
    }

  getCustomOpening(customOpening) {
    const p = new Paragraph()
    return p.load({
      text: customOpening
    })
      .then(() => {
        return p
      })
  }
}