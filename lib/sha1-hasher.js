const crypto = require('crypto')

module.exports = class Sha1Hasher
{
    constructor() {

    }

    hash(data, format) {
        format = format || 'hex'
        
        const hasher = crypto.createHash('sha1')
        hasher.update(data)
        
        return hasher.digest(format)
    }
}