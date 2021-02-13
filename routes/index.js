var express = require('express');
var router = express.Router();
const { MongoClient, ObjectId } = require("mongodb");
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url, { useUnifiedTopology: true });

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});
router.post('/insert', async function(req, res) {
    try {
        const { nom, prenom } = req.body;
        await client.connect();
        const db = client.db("crud");
        const collection = db.collection("personne");
        const result = await collection.insertOne({ nom, prenom });
        //console.log(result);
        res.redirect('/');
    } catch (ex) {
        console.log(" Error :" + ex);

    } finally {
        await client.close();
    }
});
router.post('/update', async function(req, res) {
    try {
        await client.connect();
        const { nom, prenom } = req.body;
        const db = client.db("crud");
        console.log({ nom, prenom });
        const collection = db.collection("personne");
        const filter = {
            _id: ObjectId(req.body.id)
        };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                nom,
                prenom
            },
        };
        const result = await collection.updateOne(filter, updateDoc, options);
        //console.log(result);
        res.redirect('/');
    } catch (ex) {
        console.log(" Error :" + ex);
    } finally {
        await client.close();
    }
});
router.post('/delete', async function(req, res) {
    try {
        const { nom, prenom } = req.body;
        await client.connect();
        const db = client.db("crud");
        const collection = db.collection("personne");
        const filter = {
            _id: ObjectId(req.body.id)
        };
        const result = await collection.deleteOne(filter);
        if (result.deletedCount === 1) {
            console.log("Successfully deleted one document.");
        } else {
            console.log("No documents deleted .");
        }
        res.redirect('/');
    } catch (ex) {
        console.log(" Error :" + ex);

    } finally {
        await client.close();
    }

});
module.exports = router;