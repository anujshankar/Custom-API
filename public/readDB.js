function read() {
  $.get("/read", function (data) {
    let result = ''
    console.log(data)
    for (let iter = 0; iter < data.length; iter++) {
      result += `<li>${data[iter].description}<button id=${data[iter].id}>delete</button></li>` // Prone to XSS
    }
    $("#result").html((result))
    $('button').click(function () {
      $.ajax({
        url: `/destroy/${this.id}`,
        type: 'DELETE',
        success: function (response) {
          read()
        }
      })
    })
  })
}

$(document).ready(function () {
  read()
})

