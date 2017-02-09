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
  const checkId = queryId + '-check'
  const myElement = document.getElementById(textboxId)
  const checkElement = document.getElementById(checkId)
  $.ajax({
    data: `status=${status}`,
    url: `/update/${queryId}`,
    type: 'PUT',
    success: function (response) {
      if (checkElement.checked) {
        myElement.style.textDecoration = "line-through";
      } else {
        myElement.style.textDecoration = "none";
      }
    }
  })
}

function updateElement(id, value) {
  const queryId = id.split('-')[0]
  $.ajax({
    data: `value=${value}`,
    url: `/update/${queryId}`,
    type: 'PUT'
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

$("#writeForm").submit((e) => {
  e.preventDefault();
  let task = $('#post-data').val()
  let submitButton = document.getElementById('post-data');
  submitButton.value = ''
  $.post(`/write/${task}`, function (data) {
    return data
  }).done(function (data) {
    let taskData = `<li>
                  <div>
                  <input onclick="updateStatus(this.id,true)
                  " id = "${data.id}-check" type="checkbox"}> 
                  <input id="${data.id}-text" onblur="updateElement(this.id,this.value)" value = "${task}"/>
                  <button id="${data.id}-button" onClick="deleteElement(this.id)" class = "deleteButton">x</button> 
                  </div>
                  </li>`
    $("#result").append(taskData);
  })
})

$(document).ready(function () {
  read()
})
