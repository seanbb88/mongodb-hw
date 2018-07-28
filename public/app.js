$.getJSON("/albums", function(data) {
  for (var i = 0; i < data.length; i++) {
    console.log(data);
    $("#album").append(
      "<p data-id='" + data[i]._id + "'>" + data[i].title + "</p><br /><a href='" + data[i].link + "'>click for pitchfork review/><br/><img src='" + data[i].img + "'>"
    );
  }
});

$(document).on("click", "p", function() {
  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/albums/" + thisId
  }).then(function(data) {
    console.log(data);
    var notes = $("#notes");
    notes.append("<h2>" + data.title + "</h2>");
    notes.append("<input id='titleinput' name='title' >");
    notes.append("<textarea id='bodyinput' name='body'></textarea>");
    notes.append(
      "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
    );

    if (data.note) {
      $("#titleinput").val(data.note.title);
      $("#bodyinput").val(data.note.body);
    }
  });
});

$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/albums/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  }).then(function(data) {
    console.log(data);
    $("#notes").empty();
  });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});
