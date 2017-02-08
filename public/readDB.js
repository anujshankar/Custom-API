function read() {
  $.get("/read", function (data) {
    let result = ''
    console.log(data)
    for (let iter = 0; iter < data.length; iter++) {
      result += `<li>${data[iter].description}<button class='close' id=${data[iter].id}>x</button></li>` // Prone to XSS
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

`<li class="list-group-item" >
            <div class = "row-fluid">
              <input class = "note-check checkbox checkbox-primary" noteId = "${id}" type="checkbox" ${status === true ? "checked" : ''} > 
              <input noteId = "${id}" class = "col-sm-8 note-holder" value = "${description}" /> 
              <span noteId=${id} class = "deleteButton col-sm-1">:x:</span> 
            </div>
</li>`;
