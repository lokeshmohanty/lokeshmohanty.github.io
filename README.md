# lokesh1197.github.io

## Setup

  - Create new hakyll project
  ```
    stack new <project-name> hakyll-template
  ```

## Commands

  - Get a clean build (`blog` is the project executable in cabal config file whose default is the project name)
  ```
    stack exec blog clean
    stack exec blog build
  ```
