class User {
  constructor({ _id, username, email, password }) {
    this._id = _id; // importante manter _id para compatibilidade com Mongo
    this.username = username;
    this.email = email;
    this.password = password;
  }

  isValid() {
    return this.username && this.email && this.password;
  }
}

module.exports = User;
