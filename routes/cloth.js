import express from 'express'
const router = express.Router()
import passport from 'passport'

import {
  populateClothes,
  getSingleCloth,
  getClothes,
} from '../controllers/cloth-controller.js'

router.route('/populate', ).post(populateClothes)
router.get('/', getClothes)
router.get('/:id', passport.authenticate('jwt', {session: false}), getSingleCloth)

export default router
