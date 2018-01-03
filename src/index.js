import csp from 'js-csp'
import t from 'transducers-js'

csp.go(function* () {
const ch = csp.chan(1)
let val = yield csp.putAsync(ch,1)   
console.log('Got', yield csp.take(ch)) 
})