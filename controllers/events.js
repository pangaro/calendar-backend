const { response } = require('express');
const Event = require('../models/EventModel');

const getEvent = async( req, res = response ) => {

    const event = await Event.find()
                            .populate('user', 'name email');

    return res.json({
        ok: true,
        event,
    })
}

const createEvent = async( req, res = response ) => {
    
    const event = new Event( req.body );

    try {

        event.user = req.uid;

        const eventBD = await event.save();
        // console.log(eventBD)
        res.status(201).json({
            ok: true,
            event: eventBD,
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el Administrador'
        });
    }
}


const updateEvent = async( req, res = response ) => {
    
    const eventId = req.params.id;
    const uid = req.uid;

    try {

        const event = await Event.findById( eventId );
        
        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe evento con ese id'
            });
        } 
        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No puede editar eventos de otros usruarios'
            });
        }

        const newEvent = {
            ...req.body,
            user: uid 
        }

        const updateEvent = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } );

        res.status(201).json({
            ok: true,
            event: updateEvent
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el Administrador'
        });
    }
}


const deleteEvent = async( req, res = response ) => {
    
    const eventId = req.params.id;
    const uid = req.uid;

    try {

        const event = await Event.findById( eventId );
        
        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe evento con ese id'
            });
        } 
        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No puede eliminar eventos de otros usruarios'
            });
        }

        await Event.findByIdAndDelete( eventId );

        res.status(200).json({
            ok: true,
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el Administrador'
        });
    }
}


module.exports = {
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
}