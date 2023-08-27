import Paragraph from './Paragraph.js';

export default class Desire {
  async load ({data}) {
      this.data = data;
      this.handle = data.handle;
      this.label = data.label;

      const promises = []

      // Aus "Event.ja": Absätze und Variablen für den Brief des Datenauskunftsbegehrens
      if (data.paragraphs) {
          this.paragraphs = data.paragraphs
            .map(text => {
                const p = new Paragraph()
                const loaded = p.load({
                    text,
                    source: 'followup',
                    sourceType: this.handle
                })
                promises.push(loaded)
                return p;
            })
      }

      await Promise.all(promises)
  }

  get variables() {
      return this.paragraphs
        .flatMap(paragraph => paragraph.getVariables())
        .sort((a, b) => {
            return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        })  }

  get serviceLabel () {
      return this.data.serviceLabel || this.label
  }
}