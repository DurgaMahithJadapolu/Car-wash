const router = require('express').Router();
const ctrl = require('../controllers/usersController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/profile', ctrl.getProfile);
router.put('/profile', ctrl.updateProfile);
router.put('/password', ctrl.changePassword);
router.delete('/account', ctrl.deleteAccount);

module.exports = router;
