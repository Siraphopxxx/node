const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const port = 3000;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/check-db-connection', async (req, res) => {
    try {
        await prisma.$connect();
        res.send({ message: 'Database connection successful' });
    } catch (error) {
        res.status(500).send({ error: 'Caonnot connect to database' });
    }
});

app.post('/customer/create', async (req, res) => {

    try {
        const payload = req.body;
        const customer = await prisma.Customer.create({
            data: payload
        });

        res.json(customer);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

});

app.get('/customer/list', async (req, res) => {
    try {
        const customer = await prisma.Customer.findMany();
        res.json(customer);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/customer/detail/:id', async (req, res) => {
    try {
        const customer = await prisma.Customer.findUnique({
            where: {
                id: req.params.id
            }
        });
        res.json(customer);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.put('/customer/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const payload = req.body;
        const customer = await prisma.Customer.update({
            where: { id: id },
            data: payload
        });
        res.json(customer);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.delete('/customer/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await prisma.Customer.delete({
            where: { id: id }
        });
        res.json({ message: 'Custoomer deleted successfully' });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


app.get('/customer/startWith', async (req, res) => {
    try {
        const keyword = req.body.keyword;
        const cus = await prisma.Customer.findMany({
            where: {
                name: {
                    startsWith: keyword
                }
            }
        });
        res.json(cus);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/customer/endWith', async (req, res) => {
    try {
        const keyword = req.body.keyword;
        const cus = await prisma.Customer.findMany({
            where: {
                name: {
                    endsWith: keyword
                }
            }
        });
        res.json(cus);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/customer/contain', async (req, res) => {
    try {
        const keyword = req.body.keyword;
        const cus = await prisma.Customer.findMany({
            where: {
                name: {
                    contains: keyword
                }
            }
        });
        res.json(cus);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


app.listen(port, () => {
    console.log('Server is running on port' + port);
});



