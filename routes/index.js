var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;






/* GET home page. */

module.exports = (db) => {

    let obj = { $or: [] }

    router.get("/", async (req, res) => {
        const limit = 5
        if (typeof req.query.search !== "undefined" || req.query.pageBrowse) {
            let currentPage = req.query.pageBrowse || 1
            let skip = (currentPage * limit) - limit
            let page = "pageBrowse"

            if (req.query.search === "clicked") obj.$or = []
            if (req.query.checkboxString === "on" && req.query.string.length !== 0) obj.$or.push({ string: new RegExp(req.query.string) })
            if (req.query.checkboxInteger === "on" && req.query.integer.length !== 0) obj.$or.push({ intData: Number(req.query.integer) })
            if (req.query.checkboxFloat === "on" && req.query.float.length !== 0) obj.$or.push({ floatType: Number(req.query.float) })
            if (req.query.checkboxDate === "on" && req.query.startdate.length !== 0 && req.query.enddate !== 0) obj.$or.push({ tanggal: { $gte: req.query.startdate, $lt: req.query.enddate } })
            if (req.query.checkboxBoolean === "on" && req.query.bool !== "Choose...") obj.$or.push({ bool: req.query.bool })

            try {
                if (obj.$or.length == 0) {
                    res.redirect('/')
                }
                let totalRow = await db.collection('webBread').find(obj).count()
                let currentPageData = await db.collection('webBread').find(obj).limit(limit).skip(skip).toArray()
                res.render('index', { rows: currentPageData, totalPage: Math.ceil(totalRow / limit), currentPage, nameOfPage: page })
            } catch (error) {
                console.log(error)
                res.status(500).json({ error: true, message: error })

            }





        } else {
            let currentPage = req.query.page || 1
            let page = "page"


            let skip = (currentPage * limit) - limit
            try {
                const totalRow = await db.collection('webBread').find({}).count()
                const currentPageData = await db.collection('webBread').find({}).limit(limit).skip(skip).toArray()

                res.render('index', { rows: currentPageData, totalPage: Math.ceil(totalRow / limit), currentPage, nameOfPage: page })
            } catch (error) {
                console.log(error)
                res.status(500).json({ error: true, message: error })

            }




            // Promise
            //     .all([countTotalData, getData])
            //     .then((values) => {
            //         const totalRow = values[0];
            //         const currentPageData = values[1];

            //         // console.log(totalRow)
            //         // console.log(currentPageData)
            //         res.render('index', { rows: currentPageData, totalPage: Math.ceil(totalRow / limit), currentPage, nameOfPage: page })
            //     })
            //     .catch((reason) => {
            //         console.log(reason)
            //     });

        }

    })


    router.post("/", (req, res) => {
        console.log(typeof req.body.delete)
        db.collection('webBread')
            .deleteOne({ "_id": ObjectId(req.body.delete) })
            .then(isi => {
                console.log(isi.result)
                res.redirect("/")
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ error: true, message: error })
            })
    })

    router.get("/edit/:id", async (req, res) => {
        try {
            const editId = req.params.id
            console.log(editId)
            const cursor = db.collection('webBread').find({ "_id": ObjectId(editId) })
            await cursor.forEach(doc => {
                const { _id, string, intData, floatType, tanggal, bool } = doc
                res.render('edit', { _id, string, intData, floatType, tanggal, bool })
            })
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: true, message: error })

        }


    })


    router.post("/edit", async (req, res) => {
        try {
            const { _id, string, intData, floatType, tanggal, bool } = req.body
            let newData = { string, intData, floatType, tanggal, bool }
            await db.collection('webBread').updateOne({ "_id": ObjectId(_id.trim()) }, { $set: newData })
            res.redirect("/")

        } catch (err) {
            console.log(err)
            res.status(500).json({ error: true, message: error })

        }

    })

    router.get("/add", (req, res) => {
        res.render('add')

    })

    router.post("/add", async (req, res) => {
        try {
            const result = await db.collection('webBread').insertOne(req.body)
            console.log(
                `${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`,
            );
            res.redirect("/")

        } catch (error) {
            console.log(error)
            res.status(500).json({ error: true, message: error })

        }


    })

    return router
}
