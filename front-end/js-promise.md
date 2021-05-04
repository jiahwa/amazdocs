# js-promise

```js
let cache = null
// 定义promise异步函数，
function getValue() {
    return new Promise((resolve) => {
         emitter('input', resolve)
    })

}
console.log('before getValue');
// 定义emitter之后的执行
getValue().then((r) => console.log('getValue: ', r));


// 模拟emitter event
function emitter(input, resolve) {
    console.log(`Emitter event: ${input}`)
    if(cache) resolve(cache) 这里是同步调用
    return fetch('/api/xxx').then(r => resolve(cache = r)); // 这里为异步调用
}
```