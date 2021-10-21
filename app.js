const PORT = process.env.PORT || 3000;
const exp = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mysql = require('mysql');
const request = require('request');
const API_KEY = "FfQzGt0hTc71oLvxftLmt6awdc6WD853XEqXW07s";


const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "quantiply"
});

conn.connect(function (err) {
    if (err) throw err;
});

const app = exp();

app.use(bodyParser.json())
app.use(cors())


app.get('/get-data', (req, resp) => {
    const reqDate = req.query.date ? req.query.date : new Date().toISOString().replace(/T/, ' ').split(' ')[0];
   
    conn.query("SELECT date, media_type, service_version, title, url, explanation FROM astonomy where date = ?", [reqDate], function (err, result, fields) {
        if (err) throw err;
        if (result.length >= 1) {
            resp.json(result[0])
        }
        else {
            request('https://api.nasa.gov/planetary/apod?api_key=' + API_KEY + '&date=' + reqDate, function (error, response, body) {
                if (!error && response.statusCode == 200) {

                    body = JSON.parse(body)

                    conn.query("insert into astonomy (date, media_type, service_version, title, url, explanation) values (?, ?, ?, ?, ?, ?) ", [
                        body.date, body.media_type, body.service_version, body.title, body.url, body.explanation], function (err, result) {
                            if (err) throw err;
                            // console.log("Number of records inserted: " + result.affectedRows);
                        });
                }
                resp.json(body)
            })
        }
    });

})

app.listen(PORT, () => {
    console.log("DEPLOYED [", PORT, "]")
})