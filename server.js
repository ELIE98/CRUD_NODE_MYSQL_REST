const express = require('express');
const mysql = require('mysql');
var Student = require('./Models/Student')
const app = express();

app.use(express.json());
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'demo'
});

db.connect(function (err) {
    if (err) return console.error('error: ' + err.message);
    console.log('⚡️[database]: connecté au server MySQL.');
});


app.get("/", async (req, res) => {
    db.query("SELECT * FROM student", (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log("error============> " + err);
        }
    });
});

app.get("/details/:id", async (req, res) => {
    await db.query("SELECT * FROM student WHERE ID=?", [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        } else {
            console.log("error============> " + err);
        }
    });
});

app.post("/deleteStudent", async (req, res) => {
    await db.query("DELETE FROM student WHERE ID=?", [req.body.id], (err, rows, fields) => {
        if (!err) {
            res.send({msg: "suppression ok"});
        } else {
            console.log("error============> " + err);
        }
    });
});

app.post("/addStudent", async (req, res) => {
    // const data = new Student(0,req.body.nom,req.body.prenom);
    await db.query('INSERT INTO student(NOM,PRENOM) VALUES(?,?)', [req.body.nom, req.body.prenom], (err, rows, fields) => {
        if (!err) {
            res.send({msg: "ajout ok",data:rows});
        } else {
            console.log("error============> " + err);
        }
    });
})

app.post("/updateStudent", (req, res) => {
    db.query('SELECT * FROM student WHERE ID=?', [req.body.id], (err, rows, fields) => {
        if (!err)
            if (rows.length > 0) {
                db.query('UPDATE student SET NOM=?,PRENOM=? WHERE ID=?', [req.body.nom, req.body.prenom, req.body.id], (err, rows, fields) => {
                    if (!err) {
                        res.send({msg: "Modification ok",data:rows});
                    } else {
                        console.log("error============> " + err);
                    }
                });
            } else {
                res.send({msg: "Etudiant inexistant"});
            }
    })
})

//Post Method
/*app.post('/post', (req, res) => {
    const data = new Model({
        name: req.body.name,
        name: req.body.name,
        age: req.body.age
    })

    try {
        const dataToSave = data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})*/
/*
db.query('INSERT INTO client(NOM,PRENOMS,ADRESSE,TELEPHONE,QUANTITE,CHOIX,DATE_CMD) VALUES(?,?,?,?,?,?,?)',parametre =[req.body.nom, req.body.prenom, req.body.adresse, req.body.telephone,req.body.quantite, req.body.choix,req.body.date],(err) =>{
        if(!err)
        res.send('donnees enregistrees ! nous vous contacterons tres bientot')
        else
        res.send(err.message)  
    })*/

app.listen(3000, (err) => {
    if (err) return console.log(err.message);
    console.log(`⚡️[server]: disponible sur le port ${3000}`);

})