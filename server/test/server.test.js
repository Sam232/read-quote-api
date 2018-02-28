const request = require("supertest");
const expect = require("expect");
const {ObjectID} = require("mongodb");

const {app} = require("../server");
const {Quote} = require("../models/Quote");

const quotes = [{
  _id: new ObjectID(),
  title: "Joy",
  description: "The noblest pleasure is the joy of understanding.",
  type: "Inspirational"
},{
  _id: new ObjectID(),
  title: "Knowledge",
  description: "He who loves practice without theory is like the sailor who boards ship without a rudder and compass and never knows where he may cast.",
  type: "Inspirational"
}];

beforeEach((done) => {
  Quote.remove({}).then((result) => {
    var newQuote = new Quote(quotes[0]);
    newQuote.save().then((quote) => {
      done();
    })
    .catch((e) => {
      done(e);
    });
  })
  .catch((e) => {
    done(e);
  })
});

describe("POST /quotes/", () => {
  it("should test /quotes/", (done) => {
    request(app)
      .post("/quotes/")
      .send(quotes[0])
      .expect(200)
      .expect((res) => {
        expect(res.body.newQuote.title).toBe("Joy");
      })
      .end(done);
  });

  it("should test /quotes/ and receive statuscode of 400", (done) => {
    request(app)
      .post("/quotes")
      .send({})
      .expect(400)
      .end(done);
  });
});

describe("GET /quotes", () => {
  it("should test /quotes", (done) => {
    request(app)
      .get("/quotes")
      .expect(200)
      .expect((res) => {
        expect(res.body.quotes).toBeA("array");
      })
      .end(done);
  });

  it("should test /quotes/:id", (done) => {
    request(app)
      .get(`/quotes/${quotes[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.quote.title).toBe(quotes[0].title);
      })
      .end(done);
  });

  it("should test /quotes/:id and receive a statuscode of 400", (done) => {
    request(app)
      .get("/quotes/11020")
      .expect(400)
      .end(done);
  });

  it("should test /quotes/:id and receive a statuscode of 404", (done) => {
    request(app)
      .get("/quotes/5a94701ae991031de8e21045")
      .expect(404)
      .end(done);
  });
});

describe("PATCH /quotes/:id", () => {
  it("should test /quotes/:id", (done) => {
    request(app)
      .patch(`/quotes/${quotes[0]._id.toHexString()}`)
      .send({
        read: true
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.updatedQuote.read).toBe(true);
      })
      .end(done);
  });

  it("should test /quotes/:id", (done) => {
    request(app)
      .patch(`/quotes/${quotes[0]._id.toHexString()}`)
      .send({
        title: "Knowledge",
        description: "He who loves practice without theory is like the sailor who boards ship without a rudder and compass and never knows where he may cast.",
        type: "Inspirational"
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.updatedQuote.title).toBe("Knowledge");
      })
      .end(done);
  });

  it("should test /quotes/:id and receive a statuscode of 400", (done) => {
    request(app)
      .patch("/quotes/323o23i4903")
      .send({
        title: "Knowledge",
        description: "He who loves practice without theory is like the sailor who boards ship without a rudder and compass and never knows where he may cast.",
        type: "Inspirational"
      })
      .expect(400)
      .end(done);
  });

  it("should test /quotes/:id and receive a statuscode of 404", (done) => {
    request(app)
      .patch("/quotes/5a94701ae991031de8e21045")
      .send({
        title: "Knowledge",
        description: "He who loves practice without theory is like the sailor who boards ship without a rudder and compass and never knows where he may cast.",
        type: "Inspirational"
      })
      .expect(404)
      .end(done);
  });
});

describe("DELETE /quotes/:id", () => {
  it("should test /quotes/:id", (done) => {
    request(app)
      .delete(`/quotes/${quotes[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.deletedQuote.type).toBe("Inspirational");
      })
      .end(done);
  });

  it("should test /quotes/:id and receive a statuscode of 400", (done) => {
    request(app)
      .delete("/quotes/1204218")
      .expect(400)
      .end(done);
  });

  it("should test /quotes/:id and receive a statuscode of 404", (done) => {
    request(app)
      .delete("/quotes/5a94701ae991031de8e21045")
      .expect(404)
      .end(done);
  });
});
