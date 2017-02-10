// escape data for avoiding XSS attacks.
/*eslint-disable*/

function read() {
  $.get("/read", function (data) {
    let result = ''
    for (let iter = 0; iter < data.length; iter++) {
      const id = data[iter].id
      const description = data[iter].description
      const status = data[iter].status

      let textbox = `<input
       id="text-${id}"
       onblur="updateElement(this.id,this.value)"
       value="${description}"
      ${status === true ? "style=\"text-decoration:line-through\"" : ""}
      readonly="true"
      ondblclick="this.readOnly='';"
      />`
      let deleteButton = `<button id="button-${id}" onClick="deleteElement(this.id)" class="deleteButton">x</button>`
      result += `<li id="list-${id}">
                  <div id="div-${id}">
                  <input onclick="updateStatus(this.id)
                  " id = "check-${id}" type="checkbox" ${status === true ? "checked" : ''}> 
                  ${textbox}
                  ${deleteButton}
                  </div>
                  </li>`
    }
    $("#result").html((result))
  })
}

function strikeThrough(id) {
  const queryId = id.split('-')[1]
  const textboxId = 'text-' + queryId 
  const checkId =  'check-' + queryId
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
  const queryId = id.split('-')[1]
  const status = strikeThrough(id)
  $.ajax({
    data: `status=${status}`,
    url: `/update/${queryId}`,
    type: 'PUT',
  })
}

function updateElement(id, value) {
  const queryId = id.split('-')[1]
  const textboxId = 'text-' + queryId
  const textElement = document.getElementById(textboxId)
  textElement.readOnly = true;
  $.ajax({
    data: `value=${value}`,
    url: `/update/${queryId}`,
    type: 'PUT'
  })
}

function deleteElement(id) {
  const queryId = id.split('-')[1]
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
    const id = data.id
    let taskData = `<li id="list-${id}">
                  <div id="div-${id}">
                  <input onclick="updateStatus(this.id,true)
                  " id="check-${id}" type="checkbox"}> 
                  <input id="text-${id}" onblur="updateElement(this.id,this.value)" value="${task}"/>
                  <button id="button-${id}" onClick="deleteElement(this.id)" class = "deleteButton">x</button> 
                  </div>
                  </li>`
    $("#result").append(taskData);
  })
})

$(document).ready(function () {
  read()
})
