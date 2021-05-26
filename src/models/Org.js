import PrivacyStatement from './PrivacyStatement.js'
import History from './History.js'

export default class Org {
  constructor () {
    this.types = []
  }

  async load ({data, types}) {
    this.data = data;
    this.name = data.name;
    this.address = data.address;

    if (data.privacyStatement) {
      this.privacyStatement = new PrivacyStatement({org: this});
      await this.privacyStatement.load({data: data.privacyStatement})
    }

    this.types = types
      .filter(type => this.data.types && this.data.types.includes(type.handle))

    this.history = new History();
    if (data.history) {
      await this.history.load({data: data.history})
    }
  }

  hasType (type) {
    return !!this.types.find(t => t === type)
  }

  get paragraphs() {
    if (this.privacyStatement) {
      return this.privacyStatement.paragraphs
        .concat(this.types.flatMap(type => type.paragraphs))
    } else {
      return this.types.flatMap(type => type.paragraphs)
    }
  }

  get variables() {
    return this.paragraphs
      .flatMap(paragraph => paragraph.getVariables())
      .sort((a, b) => {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      })
  }
}