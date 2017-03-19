const request = require('request-promise')
const cookieJar = require('request').jar
const cookie = require('request').cookie

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
        return request.post({
            url: `${this.authApiRoot}/api/login`,
            json: {
                // :( @unity i'd love to not send my password in cleartext..even if it is over https
                grant_type: 'password',
                username: username,
                password: password
            }
        }).then((tokens) => {
            const unityCookies = cookieJar()
            unityCookies.setCookie(cookie(`access_token=${tokens['access_token']}`), this.sessionApiRoot)
            unityCookies.setCookie(cookie(`refresh_token=${tokens['refresh_token']}`), this.sessionApiRoot)

            return request.post({
                url: `${this.sessionApiRoot}/login`,
                json: true,
                jar: unityCookies,
                form: {
                    license_hash: licenseHash,
                    hardware_hash: hardwareHash,
                    reuse_session: '',
                    language_code: this.langId.split('-')[0],
                    current_package_id: ''
                },
                headers: {
                    'X-Requested-With': 'UnityAssetStore'
                },
                transform: (content) => {
                    return content.xunitysession
            }})
        })
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