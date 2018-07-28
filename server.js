var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var PORT = 3000;
var exphbs = require("express-handlebars");
var app = express();
var db = require("./models");

app.use(express.static("public"));

mongoose.connect(
  "mongodb://localhost/album-scraper",
  function(err) {
    if (err) throw err;
  }
);

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/scrape", function(req, res) {
  for (var i = 0; i < 3; i++) {
    request(`https://pitchfork.com/reviews/albums/?page=${i}`, function(
      err,
      res,
      html
    ) {
      var $ = cheerio.load(html);

      $(".review").each(function(i, element) {
        var title = $(element)
          .children("a")
          .text();
        var link = $(element)
          .children("a")
          .attr("href");
        var img = $(element)
          .children("a")
          .children("div")
          .children("div")
          .children("img")
          .attr("src");

        if (title && link) {
          db.Album.create(
            {
              title: title,
              link: "https://pitchfork.com" + link,
              img: img,
              note: ""
            },
            function(err, inserted) {
              if (err) {
                console.log(err);
              } else {
                console.log(inserted);
              }
            }
          );
        }
      });
    });
  }
  res.send("Scrape Done");
});

app.get("/albums", function(req, res) {
  db.Album.find({})
    .then(function(dbAlbum) {
      res.json(dbAlbum);
    })
    .catch(function(err) {
      console.log(err);
    });
});

app.get("/albums/:id", function(req, res) {
  db.Album.findOne({ _id: req.params.id })
    .populate("Note")
    .then(function(dbAlbum) {
      res.json(dbAlbum);
    })
    .catch(function(err) {
      console.log(err);
    });
});

app.post("/albums/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      return db.Album.findOneAndUpdate(
        { _id: req.params.id },
        { Note: dbNote._id },
        { new: true }
      );
    })
    .then(function(dbAlbum) {
      res.json(dbAlbum);
    })
    .catch(function(err) {
      console.log(err);
    });
});

app.listen(PORT, function() {
  console.log("http://localhost:" + PORT);
});
