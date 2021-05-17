import { getHash } from '../lib.js'

export default class Bullet {

  constructor({org, parent}) {
    this.org = org;
    this.parent = parent;
  }

  async load({data}) {
    if (typeof data === 'string') {
      data = {
        text: data
      }
    }
    this.text = data.text

    let hashText = this.text + this.org.name
    if (this.parent) {
      hashText += this.parent.hash
    }
    this.hash = await getHash({text: hashText, length: 10})

    if (data.bullets) {
      this.bullets = []
      for (const bullet of data.bullets) {
        const b = new Bullet({org: this.org, parent: this})
        await b.load({data: bullet, parent: this})
        this.bullets.push(b)
      }
    }
  }
}