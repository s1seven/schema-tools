# generate-en10168-pdf-template

This package provides a minified script to be used in [EN10168-schemas](https://github.com/s1seven/EN10168-schemas) specific verison release.
The script (with the version defined by the incoming certificate) will be downloaded and transformed as a module by [generate-pdf](https://github.com/s1seven/schema-tools/tree/master/packages/generate-pdf#readme).

This library was generated with [Nx](https://nx.dev).

## Building

The build depends on the correct TS interfaces being generated from the EN10168 JSON schema.
This is done automatically before running the build, but you need to ensure that the correct URL (version) is used in `create-interfaces` target.

Run `nx build generate-en10168-pdf-template` to build the library.

## Running unit tests

Run `nx test generate-en10168-pdf-template` to execute the unit tests via [Jest](https://jestjs.io).
