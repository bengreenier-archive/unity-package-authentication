const request = require('request-promise')
const cookieJar = require('request').jar
const cookie = require('request').cookie

const Sha1Hasher = require('./sha1-hasher')

module.exports = class UnityAuthenticationClient {
    constructor(langId, authApiRoot, sessionApiRoot) {
        this._langId = langId || 'en-US'
        this._sessionApiRoot = sessionApiRoot || 'https://kharma.unity3d.com'
        this._authApiRoot = authApiRoot || 'https://core.cloud.unity3d.com'

        if (this._sessionApiRoot.endsWith('/')) {
            this._sessionApiRoot = this._sessionApiRoot.substr(0, this._sessionApiRoot.length - 1)
        }

        if (this._authApiRoot.endsWith('/')) {
            this._authApiRoot = this._authApiRoot.substr(0, this._authApiRoot.length - 1)
        }
    }

    authenticate(username, password, licenseHash, hardwareHash) {
        licenseHash = licenseHash || UnityAuthenticationClient.freeLicenseHash
        hardwareHash = hardwareHash || this.generateHardwareHash()

        return request.post({
                url: `${this.sessionApiRoot}/login`,
                json: true,
                form: {
                    license_hash: licenseHash,
                    hardware_hash: hardwareHash,
                    language_code: this.langId.split('-')[0],
                    current_package_id: '',
                    user: username,
                    pass: password
                },
                headers: {
                    'X-Requested-With': 'UnityAssetStore'
                },
                transform: (content) => {
                    return content.xunitysession
            }})
    }

    generateHardwareHash(seed) {
        seed = seed || 'unity-package-authentication'

        return new Sha1Hasher().hash(seed, 'hex').toString()
    }

    static get freeLicenseHash() {
        return 'd4f8a001defddbe4b05bfe41e52630a3809e297a'
    }

    get langId() {
        return this._langId
    }

    get sessionApiRoot() {
        return this._sessionApiRoot
    }

    get authApiRoot() {
        return this._authApiRoot
    }
}