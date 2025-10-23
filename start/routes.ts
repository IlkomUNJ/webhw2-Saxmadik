/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.on('/').render('pages/home')
router.on('/contact').render('pages/contact')
router.on('/menu').render('pages/menu')
router.on('/login').render('pages/login')
router.on('/admin').render('pages/admin')