const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/UserModel');
const { generarJWT } = require('../helpers/jwt');

//req--> es lo q la persona solicita
//res --> es lo que respondemos


// response--> si lo importo tengo el intellisense
 const crearUsuario = async( req, res = response ) => {
    // res.send('Hello World')
    // console.log(req.body)
    const { email, password } = req.body;

    try {

        let user = await User.findOne({ email });
        // console.log(user)

        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El email ya está registrado'
            });
        }

        user = new User( req.body );
    
        // encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        await user.save(); 
        // console.log(user)

        //generar JWT
        const token = await generarJWT( user.id, user.name );

        res.status(201).json({
            ok: true,
            uid: user.id,  
            name: user.name,
            token,
            // name,
            // email,
            // password,
        });       
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el Administrador'
        });
    }
}

const loginUsuario = async( req, res = response ) => {

    const { email, password } = req.body;
// console.log(password)
    try {
        const user = await User.findOne({ email });

        // console.log(password, user.password)
        if ( !user ) {
            return res.status(400).json({
                ok: false,
                //TODO: cambiar por usuario y/o password incorrectos
                msg: 'No existe usuario registrado'
            });
        }

        // cofirmar password 
        const validPassword = bcrypt.compareSync( password, user.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            })
        }

        // generar el JWT
        const token = await generarJWT( user.id, user.name );

        res.status(200).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token,

        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Comuniquese con el Administrador'
        });    
    }

}

const revalidarToken = async( req, res = response ) => {

const { uid, name } = req;

    // generar el JWT    
    const token = await generarJWT( uid, name );
            
    res.status(200).json({
        ok: true,
        token,
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}