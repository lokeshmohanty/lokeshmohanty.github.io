# lokesh1197.github.io

## Setup

  - Create new hakyll project
  ```
    stack new <project-name> hakyll-template
  ```
   or
  ```
    stack exec hakyll-init <project-name>
  ```

## Commands

  - Get a clean build (`site` is the project executable in cabal config file whose default is the project name)
  ```
    stack exec site clean
    stack exec site build

    or

    stack exec site rebuild
  ```

  - Preview the site and reload on changes
  ```
    stack exec site watch
  ```
