/* jshint expr:true  */
describe( 'The asyncLoadModule function', ()=>{

  const asyncLoadModule
    = require.main.require( 'lib' );

  const assert
    = require( 'assert' );

  const path
    = require( 'path' );

  const rootPath
    = 'some-dir';

  const scriptName
    = 'script-file.js';

  const fullScriptPath
    = path.join( rootPath, scriptName );

  const jsonName
    = 'json-file.json';

  const fullJsonPath
    = path.join( rootPath, jsonName );

  const mockFs
    = require( 'mock-fs' );

  afterEach( mockFs.restore.bind( mockFs ) );

  it( 'should successfully load a valid module', ( done )=>{

    const expected = 'could be anything, a string, a number, an object...';
    const mockFsConfig = { [ rootPath ]: { [ scriptName ]: `module.exports='${ expected }';` } };

    mockFs( mockFsConfig );

    asyncLoadModule( fullScriptPath, ( err, result )=>{

      assert( !err, err );
      expect( result.module ).to.equal( expected );
      expect( result.scriptPath ).to.equal( fullScriptPath );
      done();

    } );

  } );

  it( 'should successfully load a valid json file', ( done )=>{

    const expected
      = { json: 'object'};

    const mockFsConfig
      = { [ rootPath ]: { [ jsonName ]: JSON.stringify( expected ) } };

    mockFs( mockFsConfig );

    asyncLoadModule( fullJsonPath, ( err, result )=>{

      assert( !err, err );
      expect( result.module ).to.eql( expected );
      expect( result.scriptPath ).to.equal( fullJsonPath );
      done();

    } );

  } );


  it( 'should fail when trying to load a script from an invalid path', ( done )=>{

    const invalidPath
      = 'you.are.a.wise/guy.js';

    asyncLoadModule( invalidPath, ( err )=>{

      expect( err ).to.be.ok;
      done();

    } );

  } );

  it( 'should fail when trying to load a script that has syntax errors', ( done )=>{

    const mockFsConfig = { [ rootPath ]: { [ scriptName ]: 'module.exports=missing quotes?;' } };

    mockFs( mockFsConfig );

    asyncLoadModule( fullScriptPath, ( err )=>{

      expect( err ).to.be.ok;
      done();

    } );

  } );

  it( 'should fail when trying to load json that has syntax errors', ( done )=>{

    const mockFsConfig = { [ rootPath ]: { [ jsonName]: '{ imNot: "JSON" }' } };

    mockFs( mockFsConfig );

    asyncLoadModule( fullJsonPath, ( err )=>{

      expect( err ).to.be.ok;
      done();

    } );

  } );


  it( 'should timeout if script runs long', ( done )=>{

    const mockFsConfig = { [ rootPath ]: { [ scriptName ]: 'while( true );' } };

    mockFs( mockFsConfig );

    asyncLoadModule( fullScriptPath, ( err )=>{

      expect( err ).to.be.ok;
      done();

    } );

  } );

} );

