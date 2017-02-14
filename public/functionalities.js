$(document).ready(function () {
  read()
})

function read() {
  $.get('/read', function (data) {
    allTodos = data
    console.log(allTodos)
    render(allTodos)
    setSelectedFilter('all')
  })
}

$('#writeForm').submit(function (e) {
  e.preventDefault()
  let task = $('#post-data').val()
  let submitButton = document.getElementById('post-data')
  submitButton.value = ''
  $.post(`/write/${task}`, function (data) {
    allTodos.push({ id: data.id, description: task, status: false })
    render(allTodos)
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
      render(allTodos)
    }
  })
}

function updateElement(id, value) {
  const queryId = id.split('-')[1]
  const textboxId = 'text-' + queryId
  const textElement = document.getElementById(textboxId)
  textElement.readOnly = true
  modifyTextBoxView(textboxId, true)
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
      render(allTodos)
    }
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
    success: () => { read() }
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