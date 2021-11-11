const { MongoClient, ObjectID } = require('mongodb');
const express = require('express');
const cors = require('cors');
const ObjectId=require('mongodb').ObjectId;
require('dotenv').config()
const port = process.env.PORT || 5000;
const app = express()

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hfrdj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db('potteryHouse');
      const allProducts = database.collection('products');
      const allBlogs = database.collection('blogs');
      const allOrders = database.collection('orders');
      
      //get multiple products data
      app.get('/products', async(req,res)=>{
          const count= req.query.count;
          const query= {};
          let result=[]
          if(parseFloat(count)){
            const cursor = allProducts.find(query).limit(parseFloat(count));
             result= await cursor.toArray();
          }
          else{
            const cursor = allProducts.find(query);
            result= await cursor.toArray();
          }
          res.json(result)
      })

     //getting single product data depends on product id
      app.get('/products/:id', async(req,res)=>{
          const id= req.params.id;
          const query= {_id:ObjectId(id)};
          const result = await allProducts.findOne(query)
          res.json(result)
      })

    //getting blogs data
      app.get('/blogs', async(req,res)=>{
          const count= req.query.count;
          const query= {};
          let result=[]
          if(parseFloat(count)){
            const cursor = allBlogs.find(query).skip(1).limit(parseFloat(count));
             result= await cursor.toArray();
          }
          else{
            const cursor = allBlogs.find(query);
            result= await cursor.toArray();
          }
          res.json(result)
      })

    // order place data post on db
    app.post('/orderProducts', async(req,res)=>{
        const data = req.body;
        const result = await allOrders.insertOne(data);
        res.json(result)
    })

    // get order data based on single email
    app.get('/orderProducts', async(req,res)=>{
        const email= req.query.email;
        const query= {email:email};
        const cursor = allOrders.find(query);
        const result = await cursor.toArray();
        res.json(result)
    })




    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('you get connection')
})

app.listen(port,()=>{
    console.log('Surver running')
})
