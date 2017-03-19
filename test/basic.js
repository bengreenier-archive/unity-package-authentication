const assert = require('assert')
const UnityAuthenticationClient = require('../').UnityAuthenticationClient

describe('UnityAuthenticationClient', () => {
    it('should construct', () => {
        new UnityAuthenticationClient('')
        new UnityAuthenticationClient('', '')
        new UnityAuthenticationClient('', '', '')
    })

    it('should reformat apiRoots if needed', () => {
        const clientOne = new UnityAuthenticationClient('', 'pie/')
        const clientTwo = new UnityAuthenticationClient('', '', 'pie/')

        assert.equal(clientOne.authApiRoot, 'pie')
        assert.equal(clientTwo.sessionApiRoot, 'pie')
    })

    it('should authenticate', (done) => {
        const client = new UnityAuthenticationClient()

        // yeah for now i'm checking this in to make testing ez
        // it's a dumby account just for this, if you really want to use it
        // go wild (but actually, plz don't) :P
        client.authenticate('bengreenier+unitypackageauthentication@outlook.com','secure1tyIshard', '', '')
            .then((session) => {
                assert.ok(typeof session != 'undefined')
                done()
            })
    })

    it('should gracefully fail to authenticate', (done) => {
        const client = new UnityAuthenticationClient()

        // no valid creds
        client.authenticate('','', '', '')
            .catch((err) => {
                assert.ok(typeof err != 'undefined')
                done()
            })
    })
})