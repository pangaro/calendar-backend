/*
Rutas de Usuarios / Events
host + /api/events
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validatorField } = require('../middlewares/validatorField');
const { getEvent, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { validatorJWT } = require('../middlewares/validatorJWT');
const { isDate } = require('../helpers/isDate');

const router = Router();

router.use( validatorJWT );

//router.use( validatorJWT ); esta un nivel arriba, entonce valida todas las paticiones a todos loa endPoint
// si lo pongo x ej debajo de getEvent, ese endPoint se hace publico (sin validacion del token)

// router.get('/', validatorJWT, getEvent);
router.get(
    '/',

    getEvent
    );
// router.post('/new', validatorJWT, createEvent);
router.post(
    '/new',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('title', 'El titulo debe ser de al menos 2 caracteres').isLength({ min:2 }),
        check('start', 'La fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'La fecha de fin es obligatoria').custom( isDate ),
        validatorField
    ],
    createEvent
    );
// router.put('/id', validatorJWT, createEvent);
router.put(
    '/:id',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('title', 'El titulo debe ser de al menos 2 caracteres').isLength({ min:2 }),
        check('start', 'La fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'La fecha de fin es obligatoria').custom( isDate ),
        validatorField
    ],
    updateEvent
    );
// router.delete('/:id', validatorJWT, deleteEvent);
router.delete('/:id', deleteEvent);


module.exports = router;