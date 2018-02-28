require("./config/config");

const express = require("express");
const _ = require("lodash");
const bodyParser = require("body-parser");
const {ObjectID} = require("mongodb");

const {mongoose} = require("./db/mongoose");
const {Quote} = require("./models/Quote");

var app = express();

app.use(bodyParser.json());

app.post("/quotes/", (req, res) => {
  var quote = {
    title: req.body.title,
    description: req.body.description,
    type: req.body.type
  }

  var newQuote = new Quote(quote);
  newQuote.save().then((quote) => {
    if(quote){
      return res.send({
        newQuote: quote,
        statusCode: 200
      });
    }
  })
  .catch((e) => {
    res.status(400).send({
      message: e,
      statusCode: 400
    });
  });
});

app.get("/quotes/", (req, res) => {
  Quote.find().then((quotes) => {
    if(quotes.length === 0){
      return res.send({
        quotesState: "No Added Quote(s)",
        statusCode: 200
      });
    }
    res.send({
      quotes,
      statusCode: 200
    });
  })
  .catch((e) => {
    res.status(400).send({
      message: e,
      statusCode: 400
    });
  });
});

app.get("/quotes/:id", (req, res) => {
  var quoteID = req.params.id;

  if(ObjectID.isValid(quoteID)){
    return Quote.findById(quoteID).then((quote) => {
      if(quote){
        return res.send({
          quote,
          statusCode: 200
        });
      }

      res.status(404).send({
        message: "No Quote\'s ID Matches The Provided ID.",
        statusCode: 404
      });
    })
    .catch((e) => {
      res.status(400).send({
        message: e,
        statusCode: 400
      })
    });
  }

  res.status(400).send({
    message: "Invalid Quote ID Provided.",
    statusCode: 400
  });
});

app.delete("/quotes/:id", (req, res) => {
  var quoteID = req.params.id;

  if(ObjectID.isValid(quoteID)){
    return Quote.findByIdAndRemove(quoteID).then((quote) => {
      if(quote){
        return res.send({
          deletedQuote: quote,
          statusCode: 200
        });
      }

      res.status(404).send({
        message: "No Quote\'s ID Matches The Provided ID",
        statusCode: 404
      });
    })
    .catch((e) => {
      res.status(400).send({
        message: e,
        statusCode: 400
      });
    })
  }

  res.status(400).send({
    message: "Invalid Quote ID Provided",
    statusCode: 400
  });
});

app.patch("/quotes/:id", (req, res) => {
  var quoteID = req.params.id;

  if(ObjectID.isValid(quoteID)){
    var body = _.pick(req.body, ["title", "description", "type", "read"]);

    if(_.isBoolean(body.read) && body.read){
      body.readAt = new Date().getTime();
    }
    else{
      body.read = false;
      body.readAt = null;
    }

    return Quote.findByIdAndUpdate(quoteID, {
      $set: {
        title: body.title,
        descritption: body.description,
        type: body.type,
        read: body.read,
        readAt: body.readAt
      }
    }, {new: true}).then((quote) => {
      if(quote){
        return res.send({
          updatedQuote: quote,
          statusCode: 200
        });
      }

      res.status(404).send({
        message: "No Quote\'s ID Matches The Provided ID",
        statusCode: 404
      });
    })
    .catch((e) => {
      res.status(400).send({
        message: e,
        statusCode: 400
      });
    });
  }

  res.status(400).send({
    message: "Invalid Quote ID Provided",
    statusCode: 400
  });

});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = {app}
