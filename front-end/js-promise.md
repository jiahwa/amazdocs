# js-promise

```js
let cache = null
// Define the promise asynchronous function
function getValue() {
    return new Promise((resolve) => {
         emitter('input', resolve)
    })

}
console.log('before getValue');
// Define the execution after the emitter
getValue().then((r) => console.log('getValue: ', r));


// Simulate emitter event
function emitter(input, resolve) {
    console.log(`Emitter event: ${input}`)
    if(cache) resolve(cache) // Here is the synchronous call
    return fetch('/api/xxx').then(r => resolve(cache = r)); // Here is an asynchronous call
}
```