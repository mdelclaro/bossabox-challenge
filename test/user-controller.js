const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");
require("dotenv-safe").config();

const { mongodb_url_test } = require("../src/utils/config");
const User = require("../src/models/users");
const UserController = require("../src/controllers/users");

describe("User controller", () => {
  let _stub;

  before(done => {
    mongoose
      .connect(mongodb_url_test, { useNewUrlParser: true })
      .then(() => {
        const user = new User({
          username: "test user",
          email: "test@email.com",
          senha: "test"
        });
        return user.save();
      })
      .then(() => done())
      .catch(err => {
        console.log("Erro mongodb: " + err);
      });
  });

  describe("POST", () => {
    it("should create user and return status code 201", done => {
      const req = {
        body: {
          username: "test user",
          email: "test2@email.com",
          senha: "test"
        }
      };

      const res = {
        statusCode: null,
        _id: null,
        username: null,
        email: null,
        status: function status(code) {
          this.statusCode = code;
          return this;
        },
        json: function json(data) {
          this._id = data._id;
          this.username = data.username;
          this.email = data.email;
        }
      };

      UserController.createUser(req, res, () => {}).then(response => {
        expect(res).to.be.an("object");
        expect(res).to.have.property("statusCode", 201);
        expect(res).to.have.property("username", "test user");
        done();
      });
    });
  });

  after(done => {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => done());
  });
});
