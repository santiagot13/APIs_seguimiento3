// requires
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// import Schema o models
const ProductoModel = require('./models/productoModel');

// server
const app = express();
const port = process.env.PORT || 9000;

//middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//endpoints
// Get en general
app.get('/api/producto', (req, res) => {

    ProductoModel.find({}, (err, producto) => {
        if (err) return res.status(500).send({ message: `ERROR al realizar peticion ${err}` })
        if (!producto) return res.status(404).send({ message: 'NO existen productos' })

        res.status(200).send({ producto })
    })
});

// Get individual
app.get('/api/producto/:productoId', (req, res) => {
    let productoId = req.params.productoId

    ProductoModel.findById(productoId, (err, producto) => {
        if (err) return res.status(500).send({ message: `ERROR al realizar peticion ${err}` })
        if (!producto) return res.status(404).send({ message: `El producto NO existe` })

        res.status(200).send({ producto: producto })
    })

});

app.post('/api/producto', (req, res) => {

    //probando si llegan los datos
    console.log('POST:/api/producto');
    console.log(req.body);

    // instanciando el modelo
    let producto = new productoModel()

    // propiedades del modelo
    producto.name = req.body.name
    producto.price = req.body.price
    producto.category = req.body.category
    producto.image = req.body.image

    producto.save((err, data) => {
        if (err) return res.status(500).send({ message: `NO se pueden guardar los datos: ${err}` })
        res.status(200).send({ producto: data })
    })
});

app.put('/api/producto/:productoId', (req, res) => {
    let productoId = req.params.productoId
    let body = req.body

    productoModel.findByIdAndUpdate(productoId, body, (err, productoUpdated) => {
        if(err) res.status(500).send({ message: `ERROR al actualizar producto: ${err}` })
        res.status(200).send({ producto: productoUpdated })
    })
});

app.delete('/api/producto/:productoId', (req, res) => {
    let productoId = req.params.productoId

    productoModel.findById(productoId, (err, producto) => {
        if (err) res.status(500).send({ message: `ERROR al borrar producto: ${err}` })

        producto.remove(err => {
            if (err) res.status(500).send({ message: `ERROR al borrar producto: ${err}` })
            res.status(200).send({ message: 'producto ELIMINADO' })
        })
    })
});

// server connect
mongoose.connect('mongodb://localhost:27017/productoyzm', (error, res) => {
    if (error) {
        return console.log(`ERROR al conectar DB: ${error}`)
    }
    console.log('Conexion con BD establecida');

    const server = app.listen(port, () => {
        console.log(`API REST corriendo en: http://localhost:${server.address().port}`)
    });

});


