const Sequelize = require('sequelize')
const sequelize = new Sequelize('postgres://anujshankar:t7@localhost:5432/anujshankar')

function readFromDB () {
  return sequelize.query(`SELECT id,description,status FROM tasks`)
}

function insertInDB (insertString) {
  return sequelize.query(`INSERT INTO TASKS (DESCRIPTION)
   VALUES(?)`, { replacements: [insertString] })
}

function updateDB (id, description, status = false) {
  return sequelize.query('UPDATE tasks SET DESCRIPTION = ?, STATUS = ? WHERE id = ?;', { replacements: [description, status, id] })
}

function deleteFromDB (id) {
  return sequelize.query('DELETE FROM tasks WHERE ID = ?;', { replacements: [id] })
}

module.exports = {
  readFromDB,
  insertInDB,
  updateDB,
  deleteFromDB
}