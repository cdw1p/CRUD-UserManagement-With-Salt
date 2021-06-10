const crypto = require('crypto')

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
const genRandomString = function(length) {
  return crypto.randomBytes(Math.ceil(length/2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0,length) /** return required number of characters */
}

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
const sha512 = function(password, salt) {
  let hash = crypto.createHmac('sha512', salt) /** Hashing algorithm sha512 */
  hash.update(password)
  return {
    salt: salt,
    passwordHash: hash.digest('hex')
  }
}

/**
 * compare hash password
 * @function
 * @param {string} prevPassword - List of required fields.
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
function compareHashPassword(prevPassword, password, salt) {
  var passwordData = sha512(password, salt)
  return (passwordData.passwordHash === prevPassword)
}

/**
 * generates hash password
 * @function
 * @param {string} userpassword - List of required fields.
 */
function saltHashPassword(userpassword) {
  var salt = genRandomString(32) /** Gives us salt of length 32 */
  var passwordData = sha512(userpassword, salt)
  return passwordData
}

module.exports = {
  saltHashPassword,
  compareHashPassword
}