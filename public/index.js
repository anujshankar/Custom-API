// escape data for avoiding XSS attacks.

let allTodos = []
let activeTodos = []
let completedTodos = []

function read() {
  $.get("/read", function (data) {
    allTodos = data
    console.log(allTodos)
    let result = ''
    for (let i = 0; i < data.length; i++) {
      const id = data[i].id
      const description = data[i].description
      const status = data[i].status

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
    //Div append tab wrapper
    const itemsLeftCount = getItemsLeftCount(allTodos)
    const itemsLeft = `<span id="items-left">${itemsLeftCount} items left</span>`
    const allButton = `<button id="all-button">All</button>`
    const activeButton = `<button id="active-button">Active</button>`
    const completedButton = `<button id="completed-button">Completed</button>`
    const tabWrapper = `${itemsLeft}${allButton}${activeButton}${completedButton}`
    const ulTag = document.getElementById('result')
    ulTag.innerHTML = result
    const divTabWrapper = document.getElementById('tab-wrapper')
    divTabWrapper.innerHTML = tabWrapper
  })
}

function getItemsLeftCount(todos) {
  let itemsLeftCount = 0
  activeTodos = []
  completedTodos = []
  for (let i = 0; i < todos.length; i++) {
    if (!todos[i].status) {
      itemsLeftCount++
      activeTodos.push(todos[i])
    } else {
      completedTodos.push(todos[i])
    }
  }
  return itemsLeftCount
}

function strikeThrough(id) {
  const queryId = id.split('-')[1]
  const textboxId = 'text-' + queryId
  const checkId = 'check-' + queryId
  const textElement = document.getElementById(textboxId)
  const checkElement = document.getElementById(checkId)
  let status
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
    success: () => {
      for (let i = 0; i < allTodos.length; i++) {
        if (allTodos[i].id === Number(queryId)) {
          allTodos[i].status = status
          break
        }
      }
      const spanItemsLeft = document.getElementById('items-left')
      spanItemsLeft.innerHTML = getItemsLeftCount(allTodos) + ' items left'
    }
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
    $("#result").append(taskData)
    allTodos.push(
      {
        id: data.id,
        description: task,
        status: false
      })
    const spanItemsLeft = document.getElementById('items-left')
    spanItemsLeft.innerHTML = getItemsLeftCount(allTodos) + ' items left'
  })
})

$(document).ready(function () {
  read()
})
