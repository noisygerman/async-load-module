const path
  = require( 'path' );

const fs
  = require( 'fs' );

const vm
  = require( 'vm' );

const scriptExecutionOptions = Object.freeze( {

  timeout:       500,  // milliseconds
  displayErrors: true  // show compile time errors

} );


/**
 * Asynchronously load the script at the specified script path.
 *
 * @param { string } scriptPath
 *   The path to the script file
 *
 * @param { OnScriptLoadedCallback } onScriptLoaded
 *   Called with (err, CostModel)
 *
 * @returns { void }
 *
 * @note Scripts loaded with this mechanism are expected to load quickly
 *       and should not try and execute large amounts of code when they are
 *       first compiled.
 *
 * @callback OnScriptLoadedCallback
 * @param { Error } err
 *   set if an error occurred while parsing the script
 * @param { any } result
 *   set if loading was successful - returns whatever module.exports returned
 *   inside the script
 */
function asyncLoadModule( scriptPath, onScriptLoaded ){

  fs.readFile( scriptPath, { encoding: 'utf8' }, ( err, codeAsText )=>{

    if( err ) return onScriptLoaded( err );
    if( isJson( scriptPath ) ) return loadJson( codeAsText, scriptPath, onScriptLoaded );
    return loadScript( codeAsText, scriptPath, onScriptLoaded );

  } );

}

module.exports = asyncLoadModule;

/* internal functions */

function isJson( filePath ){

  return path.extname( filePath ) === '.json';

}

function loadScript( codeAsText, scriptPath, next ){

  const code
    = `"use strict";\n( ( module )=>{ ${ codeAsText } } )( module );`;

  const filename
    = path.basename( scriptPath );

  const options
    = Object.assign( { filename }, scriptExecutionOptions );

  const sandbox
    = { module: { exports: { } } };

  try{

    vm.runInNewContext( code, sandbox, options );

  } catch( scriptCompileErr ){

    return next( scriptCompileErr );

  }
  
  next( null, { module: sandbox.module.exports, scriptPath } );

}

function loadJson( codeAsText, scriptPath, next ){

  let result;
  try {
    
    result = { module: JSON.parse( codeAsText ), scriptPath };

  } catch( error ){

    return next( error );

  }

  next( null, result );

}
