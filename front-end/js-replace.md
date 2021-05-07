# js-replace
.replace(regexp/substr,replacement)

- `arguments1` If it is a string, it will be treated as substr instead of regexp

- `arguments2` As a string, it replaces the matched string; as a function, the string it returns will be used as a replacement, its parameters are $0, $1,... The number is determined by the number of strings that match the pattern, and $ represents a specific meaning in it

- The purpose of $: $n | $& | $` | $' | $$，
Respectively represent: sub-expression matching object | substring | left text | right text | direct quantity symbol

eg:
```js
  return str.replace(/-(\w)/g, function($0, $1) {
    return $1.toUpperCase()
  })
```