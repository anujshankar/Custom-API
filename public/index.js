let allTodos = []
let activeTodos = []
let completedTodos = []

const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
}

function escapeHtml (string) {
  return String(string).replace(/[&<>"'`=\/]/g, function (s) {
    return entityMap[s]
  })
}

function render(data) {
  let result = ''
  for (let i = 0; i < data.length; i++) {
    const id = data[i].id
    const description = data[i].description
    const status = data[i].status

    let textbox = `<input type="textbox" id="text-${id}"
                    onblur="updateElement(this.id,this.value)"
                    value="${description}"
                    ${status === true ? 'style="text-decoration:line-through;color:#d9d9d9"' : ''}
                    readonly="true"
                    ondblclick="modifyTextBoxView(this.id,false)"
                    onkeyup="updateWhenEnterPressed(event,this.id,this.value)"
                    />`

    let deleteButton = `<button id="button-${id}"
                          onClick="deleteElement(this.id)" class="deleteButton">
                        </button>`

    let checkbox = `<input onclick="updateStatus(this.id)
                      " class="toggle" id="check-${id}" type="checkbox" ${status === true ? 'checked' : ''}>`

    result += `<li id="list-${id}">
                  <div id="div-${id}" class="list-div">
                      ${checkbox}
                      ${textbox}
                      ${deleteButton}
                  </div> 
              </li>`
  }
  const itemsLeftCount = getItemsLeftCount(allTodos)
  enableDivTabWrapper()
  updateCompletedButton()
  $('#result').html(result)
  updateSpanItemsLeft(itemsLeftCount)
}

function updateWhenEnterPressed(event,id,value) {
  if (event.keyCode === 13) {
    updateElement(id, value)
  }

}

function updateSpanItemsLeft(itemsLeftCount) {
  const spanItemsLeft = document.getElementById('items-left')
  if (itemsLeftCount === 1) {
    spanItemsLeft.innerHTML = `${itemsLeftCount} item left`
  } else {
    spanItemsLeft.innerHTML = `${itemsLeftCount} items left`
  }
}

function modifyTextBoxView(textboxId, check) {
  const textElement = document.getElementById(textboxId)
  textElement.readOnly = check
  textElement.style.borderStyle = (check) ? 'none' : 'solid'
  textElement.style.borderWidth = (check) ? '0px' : '1px'
  textElement.style.borderColor = 'black'
  textElement.style.width = (check) ? '400px' : '500px'
  if (check) textElement.parentElement.setAttribute('class', 'list-div')
  else textElement.parentElement.setAttribute('class', 'no-hover')
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

function enableDivTabWrapper() {
  const divTabWrapper = document.getElementById('tab-wrapper')
  if (allTodos.length) {
    divTabWrapper.style.display = 'flex'
  } else {
    divTabWrapper.style.display = 'none'
  }
}

function strikeThrough(id) {
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

function updateCompletedButton() {
  const clearButton = document.getElementById('clear-completed-button')
  if (completedTodos.length > 0) {
    clearButton.style.display = 'block'
  } else {
    clearButton.style.display = 'none'
  }
}

function setSelectedFilter(currentFilter) {
  const allButton = document.getElementById('all-button')
  const completedButton = document.getElementById('completed-button')
  const activeButton = document.getElementById('active-button')
  switch (currentFilter) {
    case 'all':
      allButton.setAttribute('class', 'selected')
      completedButton.setAttribute('class', '')
      activeButton.setAttribute('class', '')
      break
    case 'completed':
      allButton.setAttribute('class', '')
      completedButton.setAttribute('class', 'selected')
      activeButton.setAttribute('class', '')
      break
    case 'active':
      allButton.setAttribute('class', '')
      completedButton.setAttribute('class', '')
      activeButton.setAttribute('class', 'selected')
      break
  }
}
