'use strict';
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const EventBridge = new AWS.EventBridge();
const documentClient = new AWS.DynamoDB.DocumentClient()

module.exports.customerSupport = (event, context, callback) => {
  console.log('New customer support request received.');
  console.log(event.body);

  const timestamp = new Date().toISOString()
  const aggregator = uuidv4()

  const eventStoreParams =  {
    TableName: "EventStore",
    Item: {
      payload: event.body,
      id: aggregator,
      createdAt: timestamp,
    },
  }

  const params = {
    Entries: [{
      Detail: event.body,
      DetailType: 'support',
      EventBusName: process.env.EVENT_BUS_NAME,
      Source: 'handler.customerSupport',
      Time: new Date()
    }]
  }
  console.log("Sending event to event bus...");

  documentClient.put(eventStoreParams, (err, data) => {
     if(err) {
      console.error('fail to save event to db',err);
     } else {
      console.log('save event to db:', event.body)
     }
  })

  EventBridge.putEvents(params, (err, data) => {
    let response = null;
    if(err) {
      console.error(err);
      response = {
        statusCode: 500,
        body: JSON.stringify(
          {
            message: `Unable to send event to event bus. ${err}.`,
          }),
      };
    } else {
      const msg = 'New event sent to event bus.';
      console.log(msg);
      response = {
        statusCode: 200,
        body: JSON.stringify(
          {
            message: msg,
          }),
      };
    }

    callback(null, response);
  })
};
