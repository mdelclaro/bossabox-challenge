const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");
require("dotenv-safe").config();

const Ferramenta = require("../src/models/tools");
const FerramentaController = require("../src/controllers/tools");
const { mongodb_url_test } = require("../src/utils/config");

describe("Tools Controller", () => {
  let _stub;

  before(done => {
    mongoose
      .connect(mongodb_url_test, { useNewUrlParser: true })
      .then(() => {
        const ferramenta = new Ferramenta({
          _id: "5cacaa286674d03898d9d0f1",
          tags: [
            "organization",
            "planning",
            "collaboration",
            "writing",
            "calendar"
          ],
          title: "Notionn",
          link: "https://notion.so",
          description:
            "All in one tool to organize teams and ideas. Write, plan, collaborate,..."
        });
        return ferramenta.save();
      })
      .then(() => done())
      .catch(err => {
        console.log("Erro mongodb: " + err);
      });
  });

  describe("GET", () => {
    it("should return status code 404 if no tools were found", done => {
      _stub = sinon.stub(Ferramenta, "find").returns(null);

      FerramentaController.getFerramentas({}, {}, () => {}).then(res => {
        expect(res).to.be.an("error");
        expect(res).to.have.property("statusCode", 404);
        done();
      });
    });

    it("should return array of tools", done => {
      // _stub = sinon.stub(Ferramenta, "find").returns(null);

      const res = {
        ferramentas: [],
        statusCode: null,
        status: function status(code) {
          this.statusCode = code;
          return this;
        },
        json: function json(ferramentas) {
          this.ferramentas = ferramentas;
        }
      };

      FerramentaController.getFerramentas({}, res, () => {}).then(() => {
        expect(res).to.be.an("object");
        expect(res).to.have.property("ferramentas");
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });

    it("should return tools filtered by tag", done => {
      // _stub = sinon.stub(Ferramenta, "find").returns(null);
      const req = {
        query: {
          tag: "planning"
        }
      };

      const res = {
        ferramentas: [],
        statusCode: null,
        status: function status(code) {
          this.statusCode = code;
          return this;
        },
        json: function json(ferramentas) {
          this.ferramentas = ferramentas;
        }
      };

      FerramentaController.getFerramentas(req, res, () => {}).then(() => {
        expect(res).to.be.an("object");
        expect(res)
          .to.have.property("ferramentas")
          .that.includes.an("array");
        expect(res.ferramentas).to.have.lengthOf(1);
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });

    it("should return tool by id", done => {
      const req = {
        params: {
          idFerramenta: "5cacaa286674d03898d9d0f1"
        }
      };

      const res = {
        ferramenta: null,
        statusCode: null,
        status: function status(code) {
          this.statusCode = code;
          return this;
        },
        json: function json(ferramenta) {
          this.ferramenta = ferramenta;
        }
      };

      FerramentaController.getFerramenta(req, res, () => {}).then(() => {
        expect(res).to.be.an("object");
        expect(res)
          .to.have.property("ferramenta")
          .to.have.property("_id");
        expect(res.statusCode).to.be.equal(200);
        done();
      });
    });

    it("should return status code 404 if no tool was found", done => {
      const req = {
        params: {
          idFerramenta: "5caca863a3780f1b20c5f455"
        }
      };

      FerramentaController.getFerramenta(req, {}, () => {}).then(res => {
        expect(res).to.be.an("error");
        expect(res).to.have.property("statusCode", 404);
        done();
      });
    });
  });

  describe("POST", () => {
    it("should create tool on db and return status code 201", done => {
      const req = {
        body: {
          title: "Notion",
          link: "https://notion.so",
          description:
            "All in one tool to organize teams and ideas. Write, plan, collaborate, and get organized.",
          tags: [
            "organization",
            "planning",
            "collaboration",
            "writing",
            "calendar"
          ]
        }
      };

      const res = {
        ferramenta: null,
        statusCode: null,
        status: function status(code) {
          this.statusCode = code;
          return this;
        },
        json: function json(ferramenta) {
          this.ferramenta = ferramenta;
        }
      };

      FerramentaController.createFerramenta(req, res, () => {}).then(() => {
        expect(res).to.have.property("statusCode", 201);
        expect(res)
          .to.have.property("ferramenta")
          .to.have.property("_id");
        done();
      });
    });
  });

  describe("PUT", () => {
    it("should update tool on db and return status code 200", done => {
      const req = {
        body: {
          title: "Notion 2",
          link: "https://notion.com"
        },
        params: {
          idFerramenta: "5cacaa286674d03898d9d0f1"
        }
      };

      const res = {
        ferramenta: null,
        statusCode: null,
        status: function status(code) {
          this.statusCode = code;
          return this;
        },
        json: function json(ferramenta) {
          this.ferramenta = ferramenta;
        }
      };

      FerramentaController.updateFerramenta(req, res, () => {}).then(() => {
        expect(res).to.have.property("statusCode", 200);
        expect(res)
          .to.have.property("ferramenta")
          .to.have.property("_id");
        expect(res.ferramenta.title).to.be.equal("Notion 2");
        done();
      });
    });
  });

  describe("DELETE", () => {
    it("should delete tool and return status code 200", done => {
      const req = {
        params: {
          idFerramenta: "5cacaa286674d03898d9d0f1"
        }
      };

      const res = {
        statusCode: null,
        status: function status(code) {
          this.statusCode = code;
          return this;
        },
        json: function json() {}
      };

      FerramentaController.deleteFerramenta(req, res, () => {}).then(() => {
        expect(res).to.have.property("statusCode", 200);
        done();
      });
    });
  });

  after(done => {
    Ferramenta.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => done());
  });

  afterEach(() => {
    _stub.restore();
  });
});
