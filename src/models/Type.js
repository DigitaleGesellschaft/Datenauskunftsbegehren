import Paragraph from './Paragraph.js';

export default class Type {
  async load ({data}) {
    this.data = data;
    this.handle = data.handle;
    this.label = data.label;

    const promises = []

    this.paragraphs = data.paragraphs
      .map(text => {
        const p = new Paragraph()
        const loaded = p.load({
          text,
          source: 'type',
          sourceType: this.handle
        })
        promises.push(loaded)
        return p;
      })
    
    await Promise.all(promises)
  }

  get variables() {
    return this.paragraphs
      .flatMap(paragraph => paragraph.variables)
  }

  get serviceLabel () {
    return this.data.serviceLabel || this.label
  }
}