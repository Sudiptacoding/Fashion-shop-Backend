const express = require('express')
require('dotenv').config()
var cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
const port = process.env.PORT || 3000

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.sm8afkk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        const database = client.db("fashion");
        const product = database.collection("product");
        const addcard = database.collection("addcard");

        // add product
        app.post('/item', async (req, res) => {
            const result = await product.insertOne(req.body);
            res.send(result)
        })
        // product data gate
        app.get('/item', async (req, res) => {
            const data = product.find()
            const result = await data.toArray()
            res.send(result)
        })
        // find single data with brand
        app.get('/item/:id', async (req, res) => {
            const data = product.find({ select: req.params.id })
            const result = await data.toArray()
            res.send(result)
        })

        // get single data for mode details page
        app.get('/itemdetails/:id', async (req, res) => {
            const result = await product.findOne({ _id: new ObjectId(req.params.id) })
            res.send(result)
        })
        // upded product
        app.put('/item/:id', async (req, res) => {
            const filter = { _id: new ObjectId(req.params.id) };
            const options = { upsert: true };
            const { name, image, select, type, price, discription, rating } = req.body
            const updateDoc = {
                $set: {
                    name: name,
                    image: image,
                    select: select,
                    type: type,
                    price: price,
                    discription: discription,
                    rating: rating,
                },
            };
            const result = await product.updateOne(filter, updateDoc, options)
            res.send(result)
        })

        // add card section
        app.post('/card', async (req, res) => {
            const result = await addcard.insertOne(req.body);
            res.send(result)
        })

        // get all card add data
        app.get('/card/:id', async (req, res) => {
            const data = addcard.find({ email: req.params.id })
            const result = await data.toArray()
            res.send(result)
        })

        // delet card
        app.delete('/card/:id', async (req, res) => {
            const result = await addcard.deleteOne({ _id: new ObjectId(req.params.id) })
            res.send(result)
        })

        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})