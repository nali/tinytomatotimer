## Tiny Tomato Timer

An offline-first progressive web app that lets you time your work sessions.

![Screenshot](/images/screenshot.png)

Uses

- a service worker to serve cached resources offline
- desktop notifications for alerting you about the end of a session
- IndexedDB to persist your day's completed sessions
- a manifest file to ensure it is picked up as a progressive web app by browsers that support installation

Built with Typescript + React.

### Run me locally

`npm install` to get your dependencies and then `npm start` to boot up the local dev server.

### Run my smoke tests

Smoke tests can be run with `npm test`

### Make my production build

`npm build` will create assets in the `build/` folder.

### View me

Live demo at http://tinytomatotimer.firebaseapp.com/.
