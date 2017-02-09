/*eslint-disable*/
// escape data for avoiding XSS attacks.

function read() {
  $.get("/read", function (data) {
    let result = ''
    for (let iter = 0; iter < data.length; iter++) {
      result += `<li>
                  <div>
                  <input onclick="updateStatus(this.id,!${data[iter].status})
                  " id = "${data[iter].id}-check" type="checkbox" ${data[iter].status === true ? "checked" : ''}> 
                  <input id="${data[iter].id}-text" onblur="updateElement(this.id,this.value)" value = "${data[iter].description}"/> 
                  <button id="${data[iter].id}-button" onClick="deleteElement(this.id)" class = "deleteButton">x</button> 
                  </div>
                  </li>`
    }
    $("#result").html((result))
  })
}

function updateStatus(id, status) {
  const queryId = id.split('-')[0]
  const textboxId = queryId + '-text'
  const myElement = document.getElementById(textboxId);
  $.ajax({
    data: `status=${status}`,
    url: `/update/${queryId}`,
    type: 'PUT',
    success: function (response) {
      if (status) {
        myElement.style.textDecoration = "line-through";
      } else {
        myElement.style.textDecoration = "none";
      }
      // read()
    }
  })

}

function updateElement(id, value) {
  const queryId = id.split('-')[0]
  $.ajax({
    data: `value=${value}`,
    url: `/update/${queryId}`,
    type: 'PUT',
    success: function (response) {
      read()
    }
  })
}

function deleteElement(id) {
  const queryId = id.split('-')[0]
  $.ajax({
    url: `/destroy/${queryId}`,
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
