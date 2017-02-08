$('#delete-button').click(function () {
  let data = $('#linenumber').val()
  $.ajax({
    url: `/destroy/${data}`,
    type: 'DELETE',
    success: function (response) {
      $.get("/read", function (data) {
        let result = ''
        console.log(data)
        for (let iter = 0; iter < data.length; iter++) {
          result += `<li>${data[iter].description}</li>` // Prone to XSS
        }
        $("#result").html((result))
      })
    }
  })
})
