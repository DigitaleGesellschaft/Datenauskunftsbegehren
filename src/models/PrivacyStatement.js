import Paragraph from './Paragraph.js'
import Bullet from './Bullet.js'

export default class PrivacyStatement {
  constructor ({org}) {
    this.org = org;
    this.paragraphs = [];
  }

  async load ({data}) {
    const promises = []

    if (data.bullets) {
      this.bullets = data.bullets
        .map(bullet => {
          const b = new Bullet({org: this.org});
          const loaded = b.load({
            data: bullet
          })
          promises.push(loaded);
          return b;
        })
    }

    if (data.paragraphs) { 
      this.paragraphs = data.paragraphs
        .map(text => {
          const p = new Paragraph();
          const loaded = p.load({
            text,
            source: 'privacyStatement',
            replaceVariables: data.variables,
          });
          promises.push(loaded)
          return p;
        })
    }

    await Promise.all(promises)
  }
}