[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/connect-our-kids/mobile-app) ![Node CI](https://github.com/connect-our-kids/mobile-app/workflows/Node%20CI/badge.svg)

![logo of Connect Our Kids](./assets/logo.png)

# Connect Our Kids - Mobile App

-   [Introduction](#introduction)
    -   [Mission](#mission)
    -   [Key Features](#key-features)
    -   [Team Resources](#team-resources)
-   [Getting Started](#getting-started)
    -   [Recommended Tools](#recommended-tools)
    -   [Key Topics](#key-topics)
        -   [Organization](#organization)
    -   [Configuration](#configuration)
-   [Contributing](#contributing)
    -   [Issue/Bug Request](#issuebug-request)
    -   [Feature Requests](#feature-requests)
    -   [Pull Requests](#pull-requests)
    -   [Attribution](#attribution)
-   [Contributors](#contributors)
    -   [Lambda Labs 21](#lambda-labs-21)
    -   [Lambda Labs 19](#lambda-labs-19)
    -   [Lambda Labs 17](#lambda-labs-17)
    -   [Lambda Labs 13](#lambda-labs-13)

## Introduction

### Mission

> Our mission is to empower social workers with free modern technology to find permanent loving homes for foster kids.

Social workers who are not familiar with Connect Our Kids will learn about us through their personal connections, social media, emails, and training programs.
Social workers can learn more at [connectourkids.org](https://connectourkids.org), where they will be able to follow "download mobile app" to their device's app store to install this app.

Once they have downloaded the app, social workers will have basic access to the app's features.
Users will be prompted to log in or sign up to obtain full access.
Once authenticated, users will have full access to the app's features (including People Search).

In the future, we want authenticated users to have access to the full features of Family Connections and Best Practices while using the mobile app.

### Key Features

-   App navigation...
    -with tabs
    -with stacks

-   User authentication with Auth0

-   Event tracking

-   _People Search_

-   _Family Connections_
    -Upload documents by...
    -picking files
    -picking images
    -taking photos

-   _Best Practices_

### Team Resources

-   [Product Canvas](https://www.notion.so/Connect-Our-Kids-React-Native-App-build-on-99a8978b9a5e46359641b365c91acf73)

-   [UX Design Files](https://balsamiq.cloud/snv27r3/p7n83ab/rEEED)

-   [Application Flow (version 2)](https://www.figma.com/file/SLjHC3TQIBspRBNgRM9xMr/Untitled?node-id=0%3A1)

-   [Trello Board](https://trello.com/b/OHG8AQnD/labs21-connect-our-kids)

-   [Changelog (stale)](./CHANGELOG.md)

## Getting Started

### Prerequisites

-   [Node](https://nodejs.org) 12 or later
-   Git client of your choice

### Build and Run

-   Clone [repository](https://github.com/connect-our-kids/mobile-app) (master branch) to your local machine
-   `npm ci`
-   `npm run build`
-   `npm run start`
-   Follow expo instructions on command line to start a simulator (ios, android, web)

### Recommended Tools

#### Coding

-   [Visual Studio Code](https://code.visualstudio.com/) with extensions:

    -   [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for code linting
    -   [Prettier](https://marketplace.visualstudio.com/items?itemName=SimonSiefke.prettier-vscode) for code styling
    -   [Markdown Lint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint) for Markdown styling

-   [NPM](https://www.npmjs.com/)

    NPM is the industry-standard package manager for JavaScript packages. The npm install includes a tool called `npx` which runs binaries of installed npm packages. Cli tools like `expo` should be run using `npx expo`. This allows you not to install npm packages globally, which is discouraged. It also ensures that the team is using the same versions of tools. For this project, you should _prefer_ `npx expo` commands to install packages. However, `npm` gives you more control over dependencies when you need it.

-   [Expo CLI](https://docs.expo.io/versions/latest/workflow/expo-cli/)

    Expo CLI is the official tool for running Expo apps (`npx expo start`) and following the Expo workflow (`npx expo <command>`). You should only install production dependencies with `npx expo install`, because Expo limits the versions of packages to ensure compatibility. Use `npx expo upgrade` to upgrade the Expo SDK. To upgrade other dependencies, you may need to _carefully_ use `npm`.

#### Running On Your Mobile Device

-   Expo CLI: `npx expo start`

-   [Expo Client](https://expo.io/tools#client)

#### Running On An Emulator

-   Expo CLI: `npx expo start`

-   [Android Studio](https://developer.android.com/studio) and [Android Studio Emulator](https://docs.expo.io/versions/latest/workflow/android-studio-emulator)

-   [Xcode](https://developer.apple.com/xcode) and [iOS Simulator](https://docs.expo.io/versions/v33.0.0/workflow/ios-simulator)

### Key Topics

Before getting starting on this project, it will be enormously helpful for you to have _at least_ a basic understanding of the following topics.

#### Build Systems

-   [Expo](https://docs.expo.io/versions/latest/introduction)

    Expo (`expo`, `@expo/*`, `expo-cli`) is a layer on top of React Native. Expo...

    -lets you to develop entirely in JavaScript/TypeScript (unless you need to do something very special),
    -lets you to avoid most platform-specific configuration,
    -lets you run the app on your mobile device (instead or in addition to an emulator),
    -provides additional built-in functionality to that of React Native.

#### Component-Based Interfaces

-   [React](https://reactjs.org/) and [React Native](https://reactnative.dev/)

    React (`react`) is a JavaScript library for building component-based interfaces.
    React Native (`react-native`) is the official implementation of React for "native" interfaces.
    [React DOM](https://reactjs.org/docs/react-dom.html) (`react-dom`), which you may be more familiar with, is the official implementation of React for "web" interfaces.

-   [React Navigation](https://reactnavigation.org/)

    React Navigation (`react-navigation`) controls the user's _navigation_ through the app.
    **We _strongly_ recommend that you read through [the documentation](https://reactnavigation.org/docs/getting-started) before you begin contributing to this project.**

    This project uses version [4.x](https://reactnavigation.org/docs/4.x/getting-started/), which is not the latest version.
    If you have significant time and patience, you might consider upgrading the project to version [5.x](https://reactnavigation.org/docs/5.x/getting-started/) or later.

#### State Management

-   [Redux](https://redux.js.org/) and [React Redux](https://react-redux.js.org/)

    Have fun!

#### Testing

-   [Jest](https://jestjs.io/) and [Jest Expo](https://www.npmjs.com/package/jest-expo)

    When using Expo, you must use Jest Expo (`jest-expo`).
    Do not directly install `jest`.

-   [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)

#### APIs

-   [Apollo](https://www.apollographql.com/) is a GraphQL server and client which is used as the API for Family Connections related tools.

<!-- - [Axios](https://www.npmjs.com/package/axios)

    Axios lets you send HTTP requests. -->

-   [Auth0](https://auth0.com/)

    Auth0 lets you authenticate users.

-   [People Search API (dev only)](https://dev.search.connectourkids.org/)

    > People Search is a tool for discovering contact and relationship information from a population of over 3 billion people.
    > This tool is made available by Connect Our Kids to help social workers discover extended family members for foster kids.

### Organization

As projects grow and become more complex, the need for good organization and planning also grows.
Bad and inconsistent organization make it harder to understand _what_ code does and _where_ it does it.

#### Components

In this project, we have attempted to organize components as follows...

-   Components (`<component>`) that are imported by other components/screens should reside in their own directory.
    Components should be named in _`PascalCase`_.

-   Each component directory should have an `index` that default exports the component.
    This is necessary so you can import components with `import <component> from '<path>/<component>'` instead of `import <component> from '<path>/<component>/<component>'`.

-   Subcomponents that are only used by a "primary" component should reside in the "primary" component's directory.
    They should not be exported by `index`.

-   Component styles are located adjacent to their component `<component>.styles`.

-   Component tests are located adjacent to their component `<component>.test`.

-   Closely-related components may be organized into "families".
    Families are directories named in _`kebab-case`_.

In summary, see the diagram below.

```directory
components/

    <component>/

        index
        <component>
        <component>.styles
        <component>.test
        <sub-component>
        <sub-component>.styles
        <sub-component>.test
        ...

    <family>/

        <component-a>/
        <component-b>/
        <component-c>/
        ...
```

As a first rule-of-thumb, if a component is becoming very large or difficult to read, then you should probably break it into smaller components.
This will help you read and understand your components better.
As a second rule-of-thumb, if you are reusing some pattern within one or more components, then you should probably factor out that pattern into its own component.
This will reduce the amount of code you need to write and is easier to maintain if you want to make changes across the app.
Don't make more work for yourself.

At the time of writing, you may find some component directories that include only a `todo` file.
These are components that _would make sense to exist_, but which the most recent team did not have time to factor out.
If you have the time and patience, please consider building and factoring out these components.

#### Styles & Themes

At the time of writing, there are many styles written inline throughout the app.
These are difficult to maintain and update.
If you have the time and patience, please consider:

1. Factoring out inline styles into the `<component>.style` files.
1. Factoring out shared and common styles into a "theme" for the app.

Please document your system for organizing styles.

#### State Management

At the time of writing, the implementation of the store is overly complex and difficult to follow.
Again... If you have the time and patience, please consider refactoring the store.

Please document your system for organizing the store.

### Configuration

-   [Babel](https://babeljs.io/docs/en/configuration)

    Babel transpiles (translates) newer JavaScript syntax so older or incompatible environments will understand it.

    **_configuration:_** [babel.config.js](./babel.config.js)

-   [ESLint](https://eslint.org/docs/user-guide/configuring)

    ESLint lints (checks) JavaScript/TypeScript code against a style guide and warns you about inconsistent style and possible coding errors.

    **_configuration:_** [.eslintrc.js](./.eslintrc.js)

-   [Jest](https://jestjs.io/docs/en/configuration.html)

    Jest tests your code... but only if configured properly.

    **_configuration:_** [jest.config.js](./jest.config.js)

If you have questions about understanding or updating this project's configuration, please contact [Jason Glassbrook](https://github.com/jason-glassbrook).

## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Issue/Bug Request

**If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**

-   Check first to see if your issue has already been reported.

-   Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.

-   Create a live example of the problem.

-   Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes, where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

-   Ensure any install or build dependencies are removed before the end of the layer when doing a build.

-   Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.

-   Ensure that your code conforms to our existing code conventions and test coverage.

-   Include the relevant issue number, if applicable.

-   You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good `Contributing.md` template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).

## Contributors

### Lambda Labs 21

| Avatar                                                                          | Name                                                       | Role      |
| :------------------------------------------------------------------------------ | :--------------------------------------------------------- | :-------- |
| ![Bishop Lake](https://avatars.githubusercontent.com/u/50998248?s=64)           | [Bishop Lake](https://github.com/Bishop-Lake)              | Team Lead |
| ![Alejandro E Rodriguez](https://avatars.githubusercontent.com/u/55757912?s=64) | [Alejandro E Rodriguez](https://github.com/imxande)        | Developer |
| ![Ariana Shackelford](https://avatars.githubusercontent.com/u/26654712?s=64)    | [Ariana Shackelford](https://github.com/ArianaShackelford) | Developer |
| ![Faye Skeen](https://avatars.githubusercontent.com/u/50350459?s=64)            | [Faye Skeen](https://github.com/fskeen)                    | Developer |
| ![Jason Glassbrook](https://avatars.githubusercontent.com/u/28660371?s=64)      | [Jason Glassbrook](https://github.com/jason-glassbrook)    | Developer |
| ![Nathan Saygers](https://avatars.githubusercontent.com/u/48068572?s=64)        | [Nathan Saygers](https://github.com/nathan-saygers)        | Developer |
| ![Sara De La Cruz](https://avatars.githubusercontent.com/u/54650844?s=64)       | [Sara De La Cruz](https://github.com/Sara-DLC)             | Developer |
| ![Tyge Davis](https://avatars.githubusercontent.com/u/53713175?s=64)            | [Tyge Davis](https://github.com/tygedavis)                 | Developer |

### Lambda Labs 19

| Avatar                                                                                                      | Name                                           | Role        |
| :---------------------------------------------------------------------------------------------------------- | :--------------------------------------------- | :---------- |
| ![Bishop Lake](https://avatars.githubusercontent.com/u/50998248?s=64)                                       | [Bishop Lake](https://github.com/Bishop-Lake)  | Team Lead   |
| <img alt="Brandon Kaplan" src="https://ca.slack-edge.com/T4JUEB3ME-ULVC6TBS5-312523b9b14d-512" width="64"/> | Brandon Kaplan                                 | UX Designer |
| <img alt="Kelsey Adams" src="https://ca.slack-edge.com/T4JUEB3ME-UK4PF87PX-f03508e200f7-512" width="64"/>   | Kelsey Adams                                   | UX Designer |
| ![Angela Flowers](https://avatars.githubusercontent.com/u/16947614?s=64)                                    | [Angela Flowers](https://github.com/ajflowers) | Developer   |
| ![Austin Michaud](https://avatars.githubusercontent.com/u/28680349?s=64)                                    | [Austin Michaud](https://github.com/foobar404) | Developer   |
| ![Bayron Puac](https://avatars.githubusercontent.com/u/53735140?s=64)                                       | [Bayron Puac](https://github.com/bayronpuac)   | Developer   |
| ![Emily Richard](https://avatars.githubusercontent.com/u/46936014?s=64)                                     | [Emily Richard](https://github.com/emilyelri)  | Developer   |
| ![Jordan Athey](https://avatars.githubusercontent.com/u/53097022?s=64)                                      | [Jordan Athey](https://github.com/AjileJ)      | Developer   |
| ![Uzias Rivera](https://avatars.githubusercontent.com/u/40837265?s=64)                                      | [Uzias Rivera](https://github.com/uziasr)      | Developer   |

### Lambda Labs 17

| Avatar                                                                     | Name                                                | Role      |
| :------------------------------------------------------------------------- | :-------------------------------------------------- | :-------- |
| ![Irving Duran](https://avatars.githubusercontent.com/u/32081816?s=64)     | [Irving Duran](https://github.com/fixmylifedesigns) | Team Lead |
| ![Bishop Lake](https://avatars.githubusercontent.com/u/50998248?s=64)      | [Bishop Lake](https://github.com/Bishop-Lake)       | Developer |
| ![Blaine Blonquist](https://avatars.githubusercontent.com/u/49822176?s=64) | [Blaine Blonquist](https://github.com/bquizza5)     | Developer |
| ![Bryan Szendel](https://avatars.githubusercontent.com/u/22917212?s=64)    | [Bryan Szendel](https://github.com/bryanszendel)    | Developer |
| ![Marques Johnson](https://avatars.githubusercontent.com/u/46509067?s=64)  | [Marques Johnson](https://github.com/MarquesJ8023)  | Developer |
| ![Scott Beeker](https://avatars.githubusercontent.com/u/49079747?s=64)     | [Scott Beeker](https://github.com/dangolbeeker)     | Developer |
| ![Tania Keller](https://avatars.githubusercontent.com/u/51134714?s=64)     | [Tania Keller](https://github.com/taniamichelle)    | Developer |

### Lambda Labs 13

| Avatar                                                                     | Name                                             | Role      |
| :------------------------------------------------------------------------- | :----------------------------------------------- | :-------- |
| ![Asa Shalom](https://avatars.githubusercontent.com/u/36455310?s=64)       | [Asa Shalom](https://github.com/AsaOfDiamonds)   | Developer |
| ![Michael Gunter](https://avatars.githubusercontent.com/u/47502855?s=64)   | [Michael Gunter](https://github.com/maxgunter99) | Developer |
| ![Pedro Montesinos](https://avatars.githubusercontent.com/u/20940599?s=64) | [Pedro Montesinos](https://github.com/pedrolmr)  | Developer |
| ![Ryan Walker](https://avatars.githubusercontent.com/u/26858745?s=64)      | [Ryan Walker](https://github.com/rytwalker)      | Developer |
| ![Sean Pheneger](https://avatars.githubusercontent.com/u/41925787?s=64)    | [Sean Pheneger](https://github.com/wcolts2000)   | Developer |
| ![Tyler Spaulding](https://avatars.githubusercontent.com/u/45692071?s=64)  | [Tyler Spaulding](https://github.com/NightlyD3V) | Developer |
