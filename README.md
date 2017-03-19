# unity-package-authentication

> Note: uses es6 classes, see [this](http://node.green/#ES2015-functions-class) for node version compatabilities

[![Build Status](https://travis-ci.org/bengreenier/unity-package-authentication.svg?branch=master)](https://travis-ci.org/bengreenier/unity-package-authentication)

Authentication client for the unity package service

## How

Do I...

### Install

Simple! Just `npm install unity-package-authentication`

### Use

See the following (or the [tests](./test/basic.js):

```
const client = new UnityAuthenticationClient()

client.authenticate('username','password', 'license', 'hardware')
    .then((sessionId) => {
        // sessionId is a valid unity session
    })
```

You'll probably also want to check out:

+ [unity-package-download](https://github.com/bengreenier/unity-package-download)

## License

MIT