# freemarkerjs

FreemarkerJs is a javascript implementation of the Freemarker (http://freemarker.sourceforge.com).

## Currently supports:
  - basic interpolations
  - directives:
    - `if`
    - `elseif`
    - `else`
    - `list`
  - size builtin for arrays
  - comments
  - includes
  - built-ins:
    - `toUpperCase`
    - `toLowerCase`
    - `capitalize`
    - `length`

## Usage:
```js
freemarker.render("Hello ${name}", {name:'Bob'});
```

## TODO:
  - support default values, i.e. `${user!"Anonymous"}`
  - null resistance in above expressions if in parenthesis
  - support methods, i.e. `${avg(3, 5)}`
  - alternative syntax if starts with `[#ftl]`
  - directives ``, `switch`, `case`, `default`, `break`, `stop`, `compress`, `noparse`, `assign`
see http://freemarker.sourceforge.net/docs/ref_directives.html
  - string builtin for booleans, i.e. `boolean?string("yes", "no")`
  - `t`, `lt`, `rt`, `nt` directives (or atleast ignore them)
  - Remove deprecated `escape` / `unescape`

## Based On:
Copyright 2009 amplafi.com, Andreas Andreou - https://github.com/andyhot/freemarkerjs
