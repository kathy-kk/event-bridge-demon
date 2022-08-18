'use strict';
const AWS = require('aws-sdk')

exports.handler = (event, context, callback) => {

    console.log('event stream hits lambda!')

    for (const record of event.Records) {
        if(record.dynamodb && record.dynamodb.NewImage) {
            const result = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage)
            console.log('record in dynamodb stream:', result)
        }
    }
}