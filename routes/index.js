const express = require('express')
const router = express.Router()
const knex = require('../config/database')
const { saltHashPassword, compareHashPassword } = require('../helpers/encryption')

module.exports.initialize = function(app) {
  app.use('/',
    // Home
    router.get('/', async (req, res) => {
      const dataUsers = await knex('users').select('id', 'fullname', 'email')
      res.render('index', {
        page_title: 'Home - CRUD User Management',
        page_data: dataUsers
      })
    }),

    // Validate
    router.get('/validate', async (req, res) => {
      res.render('validate', {
        page_title: 'Validate - CRUD User Management',
        page_success: false,
        page_error: false
      })
    }),
    router.post('/validate', async (req, res) => {
      const { inputEmail, inputPassword } = req.body
      const findData = await knex('users').where({ email: inputEmail })
      if (findData.length > 0) {
        const resValidateHash = await compareHashPassword(findData[0].password, inputPassword, findData[0].salt)
        res.render('validate', {
          page_title: 'Validate - CRUD User Management',
          page_success: resValidateHash,
          page_error: !resValidateHash
        })
      } else {
        return res.redirect('/validate')
      }
    }),

    // Add New Data
    router.get('/add-new', async (req, res) => {
      res.render('add-new', {
        page_title: 'Add New - CRUD User Management'
      })
    }),
    router.post('/add-new', async (req, res) => {
      const { inputName, inputEmail, inputPassword } = req.body
      const findData = await knex('users').where({ email: inputEmail })
      if (findData.length < 1) {
        const resHashPassword = await saltHashPassword(inputPassword)
        await knex('users').insert({ fullname: inputName, email: inputEmail, password: resHashPassword.passwordHash, salt: resHashPassword.salt })
        return res.redirect('/')
      } else {
        return res.redirect('/add-new')
      }
    }),

    // Edit Data
    router.get('/edit/:id', async (req, res) => {
      const dataUsers = await knex('users').select('id', 'fullname', 'email').where({ id: req.params.id })
      res.render('edit', {
        page_title: 'Edit - CRUD User Management',
        page_data: dataUsers[0]
      })
    }),
    router.post('/edit/:id', async (req, res) => {
      const { inputName, inputEmail, inputPassword } = req.body
      const findData = await knex('users').where({ email: inputEmail })
      if (findData.length > 0) {
        const resHashPassword = await saltHashPassword(inputPassword)
        await knex('users').where({ email: inputEmail }).update({ fullname: inputName, email: inputEmail, password: resHashPassword.passwordHash, salt: resHashPassword.salt })
        return res.redirect('/')
      } else {
        return res.redirect('..')
      }
    }),

    // Delete Data
    router.get('/delete/:id', async (req, res) => {
      await knex('users').where({ id: req.params.id }).delete()
      return res.redirect('/')
    })
  )
}