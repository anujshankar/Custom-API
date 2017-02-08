
// const getRead = require('./readDB')
$('#post-button').click(function () {
  let data = $('#post-data').val()
  $.post(`/write/${data}`, function (data) {
   $.get("/read", function (data) {
    let result = ''
    console.log(data)
    for (let iter = 0; iter < data.length; iter++) {
      result += `<li>${data[iter].description}</li>` // Prone to XSS
    }
    $("#result").html((result))
    // console.log(result)
  })
  })
})
