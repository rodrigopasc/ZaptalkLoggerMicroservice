const AWS = require('aws-sdk')
const DynamoDB = new AWS.DynamoDB.DocumentClient()

const insertOnDynamoDB = async params => {
  const createNewObjectOnDynamoDBMethod = 'put'
  return DynamoDB[createNewObjectOnDynamoDBMethod](params).promise()
}

const setupParamsForDynamoDB = params => {
  const uuid = require('uuid')

  return {
    TableName: process.env.dynamoTable,
    Item: {
      id: uuid.v1(),
      customerId: params.customerId,
      invoiceFile: params.invoiceFile,
      createdAt: Date.now()
    }
  }
}

module.exports.handle = async event => {
  const { customerId, invoiceFile } = JSON.parse(event.Records[0].Sns.Message)

  const paramsToInserOnDynamoDB = setupParamsForDynamoDB({ customerId, invoiceFile })
  await insertOnDynamoDB(paramsToInserOnDynamoDB)

  return customerId
}
