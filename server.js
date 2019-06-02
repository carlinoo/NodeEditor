const cors = require("cors");
const express = require("express");
var path = require("path");
const exec = require('child_process').exec;
const execSync = require('child_process').execSync;
var fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/files', (req, res) => {
    let result = '';
    var child = exec('ls files/*.js');

    child.stdout.on('data', function (data) {
        result += data;
    });

    child.on('close', function () {
        res.send({ files: result });
    });
});

app.get('/file/:id', (req, res) => {
    fs.readFile("files/" + req.params.id, "utf-8", (err, data) => {
        res.send({ file: data });
    });
});


app.post('/file/:id', (req, res) => {
    let file = req.params.id;
    let data = req.body.data;

    fs.writeFile("files/" + file, data, (err) => {
        if (err) {
            res.send({
                error: true,
                error_message: err
            });
            return;
        }
        
        res.send({
            success: true,
            message: "Saved successfully"
        })
    });
    
});


app.delete('/file/:id', (req, res) => {
    let file = req.params.id;

    fs.unlink("files/" + file, (err) => {
        if (err) {
            res.send({
                error: true,
                error_message: err
            });
            return;
        }

        res.send({
            success: true,
            message: "Removed successfully"
        });
    });

});


app.post('/file/:id/run', (req, res) => {
    let result = '';
    var child = exec('node files/' + req.params.id);

    child.stdout.on('data', function (data) {
        result += data;
    });

    child.on('close', function () {
        res.send({ stdout: result });
    });
});



app.post('/save', (req, res) => {

});

app.listen(5432, () =>
    console.log(`Listening on port 5432`)
);