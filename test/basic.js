const assert = require('assert')
const UnityAuthenticationClient = require('../').UnityAuthenticationClient

const constants = require('./constants')

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

    it('should define freeLicenseHash', () => {
        const expected = 'd4f8a001defddbe4b05bfe41e52630a3809e297a'

        assert.equal(UnityAuthenticationClient.freeLicenseHash, expected)
    })

    it('should generateHardwareHash', () => {
        const client = new UnityAuthenticationClient()

        const hashOne = client.generateHardwareHash()
        const hashTwo = client.generateHardwareHash('hi mom')

        assert.ok(hashOne != hashTwo)
    })

    it('should authenticate', (done) => {
        const client = new UnityAuthenticationClient()

        client.authenticate(constants.testUsername, constants.testPassword)
            .then((session) => {
                assert.ok(typeof session != 'undefined')
                done()
            })
    }).timeout(5000)

    it('should authenticate with explicits', (done) => {
        const client = new UnityAuthenticationClient()

        const licenseHash = UnityAuthenticationClient.freeLicenseHash
        const hardwareHash = client.generateHardwareHash('test machine')

        client.authenticate(constants.testUsername, constants.testPassword, licenseHash, hardwareHash)
            .then((session) => {
                assert.ok(typeof session != 'undefined')
                done()
            })
    }).timeout(5000)

    it('should gracefully fail to authenticate', (done) => {
        const client = new UnityAuthenticationClient()

        // no valid creds
        client.authenticate('garbage','creds', '', '')
            .catch((err) => {
                assert.ok(typeof err != 'undefined')
                done()
            })
    }).timeout(5000)
})