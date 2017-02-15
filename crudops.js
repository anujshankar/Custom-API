const Sequelize = require('sequelize')
const dbname = process.env.mode === 'test' ? 'testdb' : 'anujshankar'
const sequelize = new Sequelize('postgres://anujshankar:t7@localhost:5432/' + dbname)

console.log(dbname)

function readFromDB() {
  return sequelize.query(`SELECT id,description,status FROM tasks ORDER BY id;`)
}

function insertInDB(insertString) {
  return sequelize.query(`INSERT INTO TASKS (DESCRIPTION)
   VALUES(?) RETURNING ID;`, { replacements: [insertString] })
}

function updateDB(id, description, status = false) {
  if (!description) {
    return sequelize.query('UPDATE tasks SET STATUS = ? WHERE id = ?;', { replacements: [status, id] })
  } else {
    return sequelize.query('UPDATE tasks SET DESCRIPTION = ?, STATUS = ? WHERE id = ?;', { replacements: [description, status, id] })
  }
}

function updateDBAll(status) {
  return sequelize.query('UPDATE tasks SET STATUS = ?;', { replacements: [status] })
}

function deleteFromDB(id) {
  return sequelize.query('DELETE FROM tasks WHERE ID = ?;', { replacements: [id] })
}

function deleteSelectedFromDB() {
  return sequelize.query('DELETE FROM tasks WHERE status=TRUE;')
}

module.exports = {
  readFromDB,
  insertInDB,
  updateDB,
  updateDBAll,
  deleteFromDB,
  deleteSelectedFromDB
}
