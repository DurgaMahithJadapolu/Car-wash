const router = require('express').Router();
const ctrl = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/login', ctrl.login);
router.post('/signup', ctrl.signup);
router.post('/demo', ctrl.demoLogin);
router.post('/logout', auth, ctrl.logout);

module.exports = router;
