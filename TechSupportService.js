'use strict';

const Util = require('./Util');

let count = 0

exports.handler = (event, context, callback) => {
    console.log('Customer support request for Tech received.');
    count = count +1
    const ticketNum = Util.ticketNumberGenerator();
    console.log(`Ticket ID generated. ${ticketNum}`);
    console.log(event);
    if(count%3===0) {
        console.error(`count ${count}: rejected!`)
        throw new Error('reject!!')
    }
    callback(null, 'Finished');
};