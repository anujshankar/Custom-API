$(document).ready(function () {
  location.hash = '#/'
  read()
})

function read() {
  $.get('/read', function (data) {
    allTodos = data
    renderWithFilter()
  })
}

$('#writeForm').submit(function (e) {
  e.preventDefault()
  let task = $('#post-data').val()
  task = escapeHtml(task)
  let submitButton = document.getElementById('post-data')
  submitButton.value = ''
  $.post(`/write/${task}`, function (data) {
    allTodos.push({ id: data.id, description: task, status: false })
    renderWithFilter()
  })
})

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
      renderWithFilter()
    }
  })
}

function updateElement(id, value) {
  const queryId = id.split('-')[1]
  const textboxId = 'text-' + queryId
  const textElement = document.getElementById(textboxId)
  textElement.readOnly = true
  modifyTextBoxView(textboxId, true)
  value = escapeHtml(value)
  $.ajax({
    data: `value=${value}`,
    url: `/update/${queryId}`,
    type: 'PUT',
    success: () => {
      for (let i = 0; i < allTodos.length; i++) {
        if (allTodos[i].id === Number(queryId)) {
          allTodos[i].description = value
          break
        }
      }
      renderWithFilter()
    }
  })
}

function deleteElement(id) {
  const queryId = id.split('-')[1]
  $.ajax({
    url: `/destroy/${queryId}`,
    type: 'DELETE',
    success: function (response) {
      let indexToRemove;
      for (let i = 0; i < allTodos.length; i++) {
        if (allTodos[i].id === Number(queryId)) {
          indexToRemove = i
          break
        }
      }
      allTodos.splice(indexToRemove, 1)
      renderWithFilter()
    }
  })
}

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
      renderWithFilter()
    }
  })
})

$('#clear-completed-button').click(function () {
  $.ajax({
    url: `/destroy/`,
    type: 'DELETE',
    success: () => { 
      read()
    }
  })
})

$('#all-button').click(function () {
  location.hash = '#/'
  renderWithFilter()
})

$('#active-button').click(function () {
  location.hash = '#/active'
  renderWithFilter()
})

$('#completed-button').click(function () {
  location.hash = '#/completed'
  renderWithFilter()
})