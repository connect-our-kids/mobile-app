[![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/connect-our-kids/mobile-app) ![Node CI](https://github.com/connect-our-kids/mobile-app/workflows/Node%20CI/badge.svg)

![logo of Connect Our Kids](./assets/logo.png)

# Connect Our Kids - Mobile App

## Getting Started

### Prerequisites

- [Node](https://nodejs.org) 12 or later

- [Visual Studio Code](https://code.visualstudio.com/) with extensions:

  - [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) for code linting
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=SimonSiefke.prettier-vscode) for code styling
  - [Markdown Lint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint) for Markdown styling

- [NPM](https://www.npmjs.com/)

    NPM is the industry-standard package manager for JavaScript packages. The npm install includes a tool called `npx` which runs binaries of installed npm packages. Cli tools like `expo` should be run using `npx expo`. This allows you not to install npm packages globally, which is discouraged. It also ensures that the team is using the same versions of tools. For this project, you should _prefer_ `npx expo` commands to install packages. However, `npm` gives you more control over dependencies when you need it.

- [Expo CLI](https://docs.expo.io/versions/latest/workflow/expo-cli/)

    Expo CLI is the official tool for running Expo apps (`npx expo start`) and following the Expo workflow (`npx expo <command>`). You should only install production dependencies with `npx expo install`, because Expo limits the versions of packages to ensure compatibility. Use `npx expo upgrade` to upgrade the Expo SDK. To upgrade other dependencies, you may need to _carefully_ use `npm`.

### Build and Run

- Clone [repository](https://github.com/connect-our-kids/mobile-app) (master branch) to your local machine
- `npm ci`
- `npm run build`
- `npm run start`
- Follow expo instructions on command line to start a simulator (ios, android, web)

#### Running On Your Mobile Device

- Expo CLI: `npx expo start`

- [Expo Client](https://expo.io/tools#client)

#### Running On An Emulator

- Expo CLI: `npx expo start`

- [Android Studio](https://developer.android.com/studio) and [Android Studio Emulator](https://docs.expo.io/versions/latest/workflow/android-studio-emulator)

- [Xcode](https://developer.apple.com/xcode) and [iOS Simulator](https://docs.expo.io/versions/v33.0.0/workflow/ios-simulator)

### Publishing to App Store and Google Play

- [Xcode 10.1](https://download.developer.apple.com/Developer_Tools/Xcode_10.1/Xcode_10.1.xip) - as of September 2020, the current version of Expo used in this project requires Xcode 10.1 to successfully publish.
- Access to the Connect Our Kids App Store Connect account and Google Play Console.
- Access to the Connect Our Kids 1Password Shared Vault for credentials.
- For App Store publishing:
  - you will need an Apple ID that is given Admin permission within App Store Connect.
  - In addition, you will need to create an [application-specific password](https://appleid.apple.com/) to input during the publish process.
- For Google Play publishing:
  - you will need to set the keystore credentials to your expo-cli prior to publishing. Use `expo credentials:manager` and input credentials found in 1Password - _Connect Our Kids Android App Keystore_.
  - Download _Google Play Developer Service Account_ JSON file from 1Password and save to your local machine. You will point to this file during the publish process.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

- Include link to the relevant Trello ticket in your description.
- Include relevant screenshots or screencasts to capture the feature or bug fix updates you have worked on.
- You may merge the Pull Request into the master branch once (1) you have approval from one other developer and (2) a successful build pipeline.
