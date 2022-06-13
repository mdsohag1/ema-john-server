const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

require('dotenv').config()

app.use(bodyParser.json())
app.use(cors())

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f7jurql.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");

  app.post('/addProduct', (req, res) => {
    const products = req.body;
    productsCollection.insertOne(products)
    .then(result => {
      console.log(result.acknowledged);
      res.send(result.acknowledged)
    })
  })

  app.get('/products', (req, res) => {
    productsCollection.find({})
    .toArray((err, document) => {
      res.send(document)
    })
  })
  app.get('/product/:key', (req, res) => {
    productsCollection.find({key: req.params.key})
    .toArray((err, document) => {
      res.send(document[0])
    })
  })

  app.post('/productByKeys', (req, res) => {
    const productsKeys = req.body;
    productsCollection.find({key: {$in: productsKeys}})
    .toArray((err, document) => {
      res.send(document)
    })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result => {
      res.send(result.acknowledged)
    })
  })

});

app.listen(5000)