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
    return this.data[this.data.length - 1]
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