# freemarkerjs

FreemarkerJs is a javascript implementation of the Freemarker (http://freemarker.sourceforge.com).

## Currently supports:
  - basic interpolations
  - directives:
    - `#if`
      - `#elseif`
      - `#else`
    - `#list`
      - `#else`
    - `#include`
  - size builtin for arrays
  - comments `<#-- -->`
  - built-ins:
    - `toUpperCase`
    - `toLowerCase`
    - `capitalize`
    - `length`

## Usage:
```js
const parser = require('freemarkerjs').parser
parser.render("Hello ${name}", {name:'Bob'});
```

## TODO:
  - support default values, i.e. `${user!"Anonymous"}`
  - null resistance in above expressions if in parenthesis
  - support methods, i.e. `${avg(3, 5)}`
  - alternative syntax if starts with `[#ftl]`
  - directives: http://freemarker.sourceforge.net/docs/ref_directives.html
    - `#assign`
    - `#attempt`
    - `#compress`
    - `#default`
    - `#escape`
      - `#noescape`
    - `#fallback`
    - `#function`
    - `#flush`
    - `#global`
    - `#import`
    - `#local`
    - `#lt`
    - `#macro`
    - `#nested`
    - `#nt`
    - `#recover`
    - `#recurse`
    - `#return`
    - `#rt`
    - `#setting`
    - `#stop`
    - `#switch`
      - `#case`
      - `#break`
    - `#t`
    - `#visit`

  - string builtin for booleans, i.e. `boolean?string("yes", "no")`
  - Remove deprecated `escape` / `unescape`

## Based On:
Copyright 2009 amplafi.com, Andreas Andreou - https://github.com/andyhot/freemarkerjs
