var crypto = require('crypto');
/**
  * Model: User
  */
module.exports = function(mongoose) {
  var collection = 'User';
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;

  function validatePresenceOf(value) {
    return value && value.length;
  }

  User = new Schema({
    'email': { type: String, validate: [validatePresenceOf, 'an email is required'], index: { unique: true } },
    'username':{type: String, index:{unique:true}},
    'fullname':{type: String, index: false},
    'totalPrueba':{type: Number, index: false, default:0},
    'totalProduccion':{type: Number, index: false, default:0},
    'partidasJugadas':{type: Number, index: false, default:0},
    'hashed_password': String,
    'salt': String,
    'connected': {type: Boolean, default: false}
  });

  User.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });

  User.virtual('password')
    .set(function(password) {
      this._password = password;
      this.salt = this.makeSalt();
      this.hashed_password = this.encryptPassword(password);
    })
    .get(function() { return this._password; });

  User.method('authenticate', function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  });
  
  User.method('makeSalt', function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  });

  User.method('encryptPassword', function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  });
/**
  User.pre('save', function(next) {
    if (!validatePresenceOf(this.password)) {
      next(new Error('Invalid password'));
    } else {
      next();
    }
  });
*/
  return mongoose.model(collection, User);
};