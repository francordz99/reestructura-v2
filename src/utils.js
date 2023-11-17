const bcrypt = require('bcrypt');


const createHash = async (password) => {
    return await bcrypt.hash(password, bcrypt.genSaltSync(10))
}

const isValidPassword = async (user, password) => {
    return await bcrypt.compare(password, user.password)
}

module.exports = {
    createHash,
    isValidPassword
}