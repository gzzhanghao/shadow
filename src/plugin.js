import postcss from 'postcss'
import SelectorParser from 'postcss-selector-parser'

export default postcss.plugin('shadow', opts => css => {
  const vClass = []

  css.walkRules(rule => {
    rule.selector = rule.selectors.map(selector => SelectorParser(transform).process(selector).result).join('')
  })

  console.log(vClass)

  function transform(rootNode) {
    const selector = rootNode.nodes[0]

    const hash = generateHash()
    const partIndex = findAllIndex(selector.nodes, isPartPseudo)

    for (let i = 0, ii = partIndex.length; i < ii; i++) {
      selector.nodes[partIndex[i]] = SelectorParser.attribute({ attribute: 'part', operator: '=', value: selector.nodes[partIndex[i]].nodes[0].nodes[0].value })
    }

    const segIndex = partIndex.slice()

    segIndex.push(selector.nodes.length)
    if (segIndex[0]) {
      segIndex.unshift(0)
    }

    const steps = []

    for (let i = 0, ii = segIndex.length - 1; i < ii; i++) {
      steps.push(selector.nodes.slice(segIndex[i], segIndex[i + 1]).join(''))
    }

    selector.nodes = [SelectorParser.className({ value: 'svc-' + hash })]
    vClass.push({ hash, steps })
  }
})

function isPartPseudo(selector) {
  return selector.type === 'pseudo' && selector.value === '::part'
}

function findAllIndex(array, test) {
  const result = []
  for (let i = 0, ii = array.length; i < ii; i++) {
    if (test(array[i])) {
      result.push(i)
    }
  }
  return result
}

function generateHash() {
  return (Math.random() * Number.MAX_SAFE_INTEGER).toString(36).replace('.', '')
}
