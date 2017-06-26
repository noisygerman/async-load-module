# aync-load-module

Load CommonJs modules asynchronously, and without caching them.

## Usage

```JavaScript
const asyncLoadModule = require( 'async-load-module' );
const isEqual         = require( 'lodash/isEqual' );
const pkg             = require( './package.json' );

ascynLoadModule( 'package.json', ( err, result )=>{

  assert( !err );
  console.log( `Logically equal: ${ isEqual( pkg, result.module ) }` );

  // output
  // Logically equal: true

} );
```

## Motivation

I needed a way to temporarily load previously validated user code
on the server.
To do this within a streaming pipeline I needed an async way to do so. This
utility provides the facilities to do just that, relying on CommonJs
`module.exports` syntax for scripts, while also providing support for
JSON files.