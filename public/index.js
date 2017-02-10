// escape data for avoiding XSS attacks.
/*eslint-disable*/

function read() {
  $.get("/read", function (data) {
    let result = ''
    for (let iter = 0; iter < data.length; iter++) {
      let textbox = `<input
       id="${data[iter].id}-text"
       onblur="updateElement(this.id,this.value)"
       value = "${data[iter].description}"
      ${data[iter].status === true ? "style=\"text-decoration:line-through\"" : ""}
      readonly="true"
      ondblclick="this.readOnly='';"
      />`

      result += `<li>
                  <div>
                  <input onclick="updateStatus(this.id)
                  " id = "${data[iter].id}-check" type="checkbox" ${data[iter].status === true ? "checked" : ''}> 
                  ${textbox}
                  <button id="${data[iter].id}-button" onClick="deleteElement(this.id)" class = "deleteButton">x</button> 
                  </div>
                  </li>`
    }
    $("#result").html((result))
  })
}
function strikeThrough(id){
  const queryId = id.split('-')[0]
  const textboxId = queryId + '-text'
  const checkId = queryId + '-check'
  const textElement = document.getElementById(textboxId)
  const checkElement = document.getElementById(checkId)
  if (checkElement.checked) {
    textElement.style.textDecoration = "line-through";
    status = true
  } else {
    textElement.style.textDecoration = "none";
    status = false
  }
  return status
}

function updateStatus(id) {
  const queryId = id.split('-')[0]
  const status = strikeThrough(id)
  $.ajax({
    data: `status=${status}`,
    url: `/update/${queryId}`,
    type: 'PUT',
  })
}

function updateElement(id, value) {
  const queryId = id.split('-')[0]
  const textboxId = queryId + '-text'
  const textElement = document.getElementById(textboxId)
  textElement.readOnly = true;
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
