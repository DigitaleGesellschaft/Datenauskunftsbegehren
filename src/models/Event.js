import Paragraph from './Paragraph.js'

export default class Event {
  async load ({data}) {
    this.data = data;

    this.handle = data.handle;
    this.label = data.label;

    const promises = []

    if (data.paragraphs) {
      this.paragraphs = data.paragraphs
        .map(text => {
            const p = new Paragraph()
            const loaded = p.load({
              text,
              source: 'event',
            })
            promises.push(loaded)
            return p
        })
    }

    await Promise.all(promises)
  }

  get variables() {
    return this.paragraphs
      .flatMap(paragraph => paragraph.getVariables())
      .sort((a, b) => {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      })
  }
}