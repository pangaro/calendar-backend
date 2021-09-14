const moment = require('moment');

//{ req, location, path } = si pongo rest 
const isDate = ( value, { req, location, path } ) => {

    if ( !value ) {
        return false;
    }

    const fecha = moment( value );

    if ( fecha.isValid() ) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    isDate,
}