/*
Rutas de Usuarios / Auth
host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validatorField } = require('../middlewares/validatorField');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validatorJWT } = require('../middlewares/validatorJWT');


const router = Router();


router.post(
    '/',
    [
        check( 'email', 'El email es obligatorio').isEmail(),
        check( 'password', 'El password debe ser de 6 caracteres').isLength({ min:6, max: 6 }),
        validatorField
    ],
    loginUsuario  
);

router.post(
    '/new',
    // middlewares
    [
        check( 'name', 'El nombre es obligatorio').not().isEmpty(),
        check( 'email', 'El email es obligatorio').isEmail(),
        check( 'password', 'El password debe ser de 6 caracteres').isLength({ min:6, max: 6 }),
        validatorField
    ],
    crearUsuario
);

router.get('/renew', validatorJWT, revalidarToken);


module.exports = router;