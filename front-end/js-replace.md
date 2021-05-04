# js-replace
.replace(regexp/substr,replacement)

- `arguments1` 如果是字符串，优先按substr 而不是 regexp对待

- `arguments2` 作为字符串，就是替换匹配的字符串；作为函数，它返回的字符串将作为替换使用，它的参数，有$0,$1,...个数由匹配模式的字符串有几个来决定, $在其中表特定含义

- $的用途: $n | $& | $` | $' | $$，
分别代表：子表达式匹配对象 | 子串 | 左边文本 | 右边文本 | 直接量符号

eg:
```js
  return str.replace(/-(\w)/g, function($0, $1) {
    return $1.toUpperCase()
  })
```