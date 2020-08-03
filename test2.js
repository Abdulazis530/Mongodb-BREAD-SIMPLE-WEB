
const MongoClient = require('mongodb').MongoClient
const assert = require('assert');

const url = 'mongodb://localhost:27017';
const dbName = 'bread';
let collection 

const insertData = function (db, callback) {

    let query = [
        { string: "antonio", intData: 1, floatType: 1.5, tanggal: "2020-07-23", bool: "true" },
        { string: "joji", intData: 2, floatType: 2.5, tanggal: "2022-08-23", bool: "false" },
        {  string: "Browny", intData: 3, floatType: 3.5, tanggal: "2020-09-23", bool: "true" },
        {  string: "jarjit", intData: 4, floatType: 4.5, tanggal: "2020-10-23", bool: "true" },
        {  string: "ijat", intData: 5, floatType: 5.5, tanggal: "2020-10-23", bool: "true" },
        {  string: "joko", intData: 6, floatType: 6.5, tanggal: "2020-10-23", bool: "true" },
        {  string: "upin", intData: 7, floatType: 8.5, tanggal: "2020-10-23", bool: "true" },
        {  string: "ipin", intData: 8, floatType: 12.5, tanggal: "2020-10-23", bool: "true" },
        {  string: "tono", intData: 9, floatType: 43.5, tanggal: "2020-10-23", bool: "true" },
        {  string: "jaka", intData: 10, floatType: 42.5, tanggal: "2020-10-23", bool: "true" }
    ]
    collection.insert(query, function (err, result) {
        assert.equal(err, null);
        console.log("Inserted  documents into the collection");
        callback(result);
    });

}
// string,intData,floatType,tanggal,bool

const findDocuments = function (db, callback) {
    // Get the documents collection

    // Find some documents
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}




MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    collection=db.collection('webBread');

    insertData(db, function () {
        findDocuments(db, function () {
            client.close();
        })
    });
});