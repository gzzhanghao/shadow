import postcss from 'postcss'
import plugin from './plugin'

postcss([ plugin ])
  .process(`
    some-selector::part(some-part) {
      color: red;
    }
    another-selector[focused]::part(some-part) yet-another-selector::part(another-part) {
      color: green;
    }
  `)
  .then(result => {
    console.log(result.css)
  })
