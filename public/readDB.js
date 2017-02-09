/*eslint-disable*/
// escape data for avoiding XSS attacks.

function read() {
  $.get("/read", function (data) {
    let result = ''
    for (let iter = 0; iter < data.length; iter++) {
      result += `<li class="list-group-item" >
                  <div class = "row-fluid">
                  <input onclick="updateStatus(this.id,!${data[iter].status})
                  " class = "note-check checkbox checkbox-primary" id = "${data[iter].id}-check" type="checkbox" ${data[iter].status === true ? "checked" : ''}> 
                  <input id="${data[iter].id}-text" onblur="updateElement(this.id,this.value)" class = "note-holder" value = "${data[iter].description}"/> 
                  <button id="${data[iter].id}-button" onClick="deleteElement(this.id)" class = "deleteButton">x</button> 
                  </div>
                  </li>`
    }
    $("#result").html((result))
  })
}

function updateStatus(id, status) {
  if (status) {
    const newid = '#' + id.split('-')[0] + '-text'
    const myElement = document.querySelector(newid);
    myElement.style.backgroundColor = "#D93600";
  }
  $.ajax({
    data: `status=${status}`,
    url: `/update/${id}`,
    type: 'PUT',
    success: function (response) {
      read()
    }
  })
}

function updateElement(id, value) {
  $.ajax({
    data: `value=${value}`,
    url: `/update/${id}`,
    type: 'PUT',
    success: function (response) {
      read()
    }
  })
}

function deleteElement(id) {
  $.ajax({
    url: `/destroy/${id}`,
    type: 'DELETE',
    success: function (response) {
      read()
    }
  })
}

function writeData() {
  let data = $('#post-data').val()
  $.post(`/write/${data}`, function (data) {
    read()
  })
}

$(document).ready(function () {
  read()
})
