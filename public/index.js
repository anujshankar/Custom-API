// escape data for avoiding XSS attacks.

let allTodos = []
let activeTodos = []
let completedTodos = []

function read () {
  $.get('/read', function (data) {
    allTodos = data
    console.log(allTodos)
    render(allTodos)
    setSelectedFilter('all')
  })
}

function render (data) {
  let result = ''
  for (let i = 0; i < data.length; i++) {
    const id = data[i].id
    const description = data[i].description
    const status = data[i].status

    let textbox = `<input
       type="textbox"
       id="text-${id}"
       onblur="updateElement(this.id,this.value)"
       value="${description}"
      ${status === true ? 'style="text-decoration:line-through;color:#d9d9d9"' : ''}
      readonly="true"
      ondblclick="modifyTextBoxView(this.id,false);"
      />`
    let deleteButton = `<button id="button-${id}" onClick="deleteElement(this.id)" class="deleteButton"></button>`
    result += `<li id="list-${id}">
                  <div id="div-${id}" class="list-div">
                  <input onclick="updateStatus(this.id)
                  " class="toggle" id="check-${id}" type="checkbox" ${status === true ? 'checked' : ''}> 
                  ${textbox}
                  ${deleteButton}
                  </div> 
                  </li>`
  }
  enableDivTabWrapper()
  updateCompletedButton()
  const itemsLeftCount = getItemsLeftCount(allTodos)
  const ulTag = document.getElementById('result')
  ulTag.innerHTML = result
  const spanItemsLeft = document.getElementById('items-left')
  spanItemsLeft.innerHTML = `${itemsLeftCount} items left`
}

function modifyTextBoxView (textboxId, check) {
  const textElement = document.getElementById(textboxId)
  textElement.readOnly = check
  textElement.style.borderStyle = (check) ? 'none' : 'solid'
  textElement.style.borderWidth = (check) ? '0px' : '1px'
  textElement.style.borderColor = 'black'
  textElement.style.width = (check) ? '400px' : '500px'
  if (check) textElement.parentElement.setAttribute('class', 'list-div')
  else textElement.parentElement.setAttribute('class', 'no-hover')
}

function getItemsLeftCount (todos) {
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

function enableDivTabWrapper () {
  const divTabWrapper = document.getElementById('tab-wrapper')
  if (allTodos.length) {
    divTabWrapper.style.display = 'flex'
  } else {
    divTabWrapper.style.display = 'none'
  }
}

function strikeThrough (id) {
  const queryId = id.split('-')[1]
  const textboxId = 'text-' + queryId
  const checkId = 'check-' + queryId
  const textElement = document.getElementById(textboxId)
  const checkElement = document.getElementById(checkId)
  let status
  if (checkElement.checked) {
    textElement.style.textDecoration = 'line-through'
    textElement.style.color = '#d9d9d9'
    status = true
  } else {
    textElement.style.textDecoration = 'none'
    textElement.style.color = 'black'
    status = false
  }
  return status
}

function updateStatus (id) {
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
      updateCompletedButton()
    }
  })
}

function updateCompletedButton () {
  const clearButton = document.getElementById('clear-completed-button')
  if (completedTodos.length > 0) {
    clearButton.style.display = 'block'
  } else {
    clearButton.style.display = 'none'
  }
}

function setSelectedFilter (currentFilter) {
  const allButton = document.getElementById('all-button')
  const completedButton = document.getElementById('completed-button')
  const activeButton = document.getElementById('active-button')
  switch (currentFilter) {
    case 'all' :
      allButton.setAttribute('class', 'selected')
      completedButton.setAttribute('class', '')
      activeButton.setAttribute('class', '')
      break
    case 'completed' :
      allButton.setAttribute('class', '')
      completedButton.setAttribute('class', 'selected')
      activeButton.setAttribute('class', '')
      break
    case 'active' :
      allButton.setAttribute('class', '')
      completedButton.setAttribute('class', '')
      activeButton.setAttribute('class', 'selected')
      break
  }
}

function updateElement (id, value) {
  const queryId = id.split('-')[1]
  const textboxId = 'text-' + queryId
  const textElement = document.getElementById(textboxId)
  modifyTextBoxView(textboxId, true)
  textElement.readOnly = true
  $.ajax({
    data: `value=${value}`,
    url: `/update/${queryId}`,
    type: 'PUT'
  })
}

function deleteElement (id) {
  const queryId = id.split('-')[1]
  $.ajax({
    url: `/destroy/${queryId}`,
    type: 'DELETE',
    success: function (response) {
      read()
    }
  })
}

$('#writeForm').submit(function (e) {
  e.preventDefault()
  let task = $('#post-data').val()
  let submitButton = document.getElementById('post-data')
  submitButton.value = ''
  $.post(`/write/${task}`, function (data) {
    allTodos.push(
      {
        id: data.id,
        description: task,
        status: false
      })
    render(allTodos)

    enableDivTabWrapper()
    const spanItemsLeft = document.getElementById('items-left')
    spanItemsLeft.innerHTML = getItemsLeftCount(allTodos) + ' items left'
  })
})

$('#toggle-all').click(function () {
  let status = document.getElementById('toggle-all').checked
  $.ajax({
    data: `status=${status}`,
    url: `/update/`,
    type: 'PUT',
    success: function () {
      allTodos.forEach((element) => {
        element.status = status
      })
      render(allTodos)
    }
  })
})

$('#clear-completed-button').click(function () {
  $.ajax({
    url: `/destroy/`,
    type: 'DELETE',
    success: function (response) {
      read()
    }
  })
})

$('#all-button').click(function () {
  render(allTodos)
  setSelectedFilter('all')
})

$('#active-button').click(function () {
  render(activeTodos)
  setSelectedFilter('active')
})

$('#completed-button').click(function () {
  render(completedTodos)
  setSelectedFilter('completed')
})

$(document).ready(function () {
  read()
})
