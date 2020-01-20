const Knex = require("knex");
const connection = require("../knexfile");
const { Model } = require("objection");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

const knexConnection = Knex(connection);

Model.knex(knexConnection);

class Project extends Model {
  static get tableName() {
    return "project";
  }

  static get idColumn() {
    return "id";
  }
}

class User extends Model {
  static get tableName() {
    return "user";
  }

  static get idColumn() {
    return "id";
  }

  getProject() {
    // return this.project.map(el => el.name).concat("administrator");
    return ["user"];
  }

  getUser() {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      ministry: this.ministry,
      management: this.management,
      username: this.username,
      email: this.email,
      token: this.getJwt()
    };
  }

  getHasuraClaims() {
    return {
      "x-hasura-allowed-roles": this.getProject(),
      "x-hasura-default-role": "user",
      "x-hasura-user-id": `${this.id}`
      // 'x-hasura-org-id': '123',
      // 'x-hasura-custom': 'custom-value'
    };
  }

  getJwt() {
    const signOptions = {
      subject: this.id.toString(),
      expiresIn: "30d", // 30 days validity
      algorithm: "RS256"
    };
    const claim = {
      user: {
        name: this.username,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        ministry: this.ministry,
        management: this.management,
        id: this.id
      },
      iat: Math.floor(Date.now() / 1000),
      "https://hasura.io/jwt/claims": this.getHasuraClaims()
    };
    return jwt.sign(claim, jwtConfig.key, signOptions);
  }

  async $beforeInsert() {
    const salt = bcrypt.genSaltSync();
    this.password = await bcrypt.hash(this.password, salt);
  }

  async $beforeUpdate() {
    await this.$beforeInsert();
  }

  verifyPassword(password, callback) {
    bcrypt.compare(password, this.password, callback);
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "username",
        "email",
        "firstName",
        "lastName",
        "ministry",
        "management"
      ],
      properties: {
        id: { type: "integer" },
        username: { type: "string", minLength: 1, maxLength: 255 },
        email: { type: "string", minLength: 1, maxLength: 255 },
        firstName: { type: "string", minLength: 1, maxLength: 255 },
        lastName: { type: "string", minLength: 1, maxLength: 255 },
        ministry: { type: "string", minLength: 1, maxLength: 255 },
        management: { type: "string", minLength: 1, maxLength: 255 }
      }
    };
  }
}

module.exports = { User, Project };
