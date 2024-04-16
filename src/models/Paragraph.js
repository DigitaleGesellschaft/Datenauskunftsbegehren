const matchVariableRegExp = /(\{[^}]{1,}\})/g

export default class Paragraph {

  async load ({text, source, sourceType, replaceVariables}) {
    this.text = text
    this.source = source
    this.sourceType = sourceType

    this.calculateTokens()
    this.extractVariables()

    if (replaceVariables) {
      this.replaceVariables({data: replaceVariables})
    }
  }

  calculateTokens() {
    this.tokens =  this.text
      .split(matchVariableRegExp)
      .map(part => {
        if (matchVariableRegExp.test(part)) {
          const variables = getVariablesFromString(part)
          const variable = variables[0]
          return {
            type: 'variable',
            variable
          }
        } else {
          return {
            type: 'text',
            string: part
          }
        }
      })
  }

  replaceVariables({data}) {
    let replaced = false
    for (const variable of this.variables) {
      if (data[variable.name]) {
        this.text = this.text.replace(variable.string, data[variable.name])
        replaced = true
      }
    }
    if (replaced) {
      this.calculateTokens()
      this.extractVariables()
    }
  }

  extractVariables () {
    this.variables = getVariablesFromString(this.text)
      .map(variable => {
        return {
          ...variable,
          source: this.source,
          sourceType: this.sourceType
        }
      })
  }

  getVariables() {
    return this.variables
  }
}

const variableRegExp = /\{(?<type>string|number|tel|email|date)?(?::)?(?<name>[a-zA-Z]{1,})(?::)?(?<label>[^:}]{0,})\}/g;
function getVariablesFromString(string) {
  const matches = [...string.matchAll(variableRegExp)]
  return matches
    .map(match => {
      return {
        type: match.groups.type,
        name: match.groups.name,
        label: match.groups.label.length ? match.groups.label : undefined,
        string: match[0]
      }
    })
}