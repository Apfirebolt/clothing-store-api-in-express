import express from 'express'
const router = express.Router()
import passport from 'passport'

import {
  authUser,
  registerUser,
  getUserProfile,
} from '../controllers/auth-controller.js'

router.route('/register', ).post(registerUser)
router.post('/login', authUser)
router.get('/profile', passport.authenticate('jwt', {session: false}), getUserProfile)

export default router
