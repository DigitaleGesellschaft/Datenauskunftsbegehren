export default class History {
  async load ({data}) {
    this.data = data
      .map(event => {
        return {
          action: event.action,
          date: new Date(event.date),
          reason: event.reason
        }
      })
      .sort((a, b) => {
        return b.date.getTime() - a.date.getTime()
      });
  }

  getLastEvent() {
    // this.data is sorted descending by date (newest first), so the most recent
    // event is at index 0. This determines the org's current state, e.g. an org
    // that was removed and later re-added must count as currently valid.
    return this.data[0]
  }

  isCurrentlyValid() {
    if (!this.data) return true
    const lastEvent = this.getLastEvent()
    if (lastEvent.action === 'removed') {
      if (lastEvent.date.getTime() < Date.now()) {
        return false;
      }
    }
    return true
  }

  getRemoval() {
    const lastEvent = this.getLastEvent()
    if (lastEvent.action === 'removed') {
      if (lastEvent.date.getTime() < Date.now()) {
        return lastEvent;
      }
    }
    return undefined;
  }
}