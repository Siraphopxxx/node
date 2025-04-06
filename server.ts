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


app.listen(port, () => {
    console.log('Server is running on port' + port);
});



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

app.get('/customer/sortByName', async (req, res) => {
    try {
        const cus = await prisma.Customer.findMany({
            orderBy: {
                name: 'asc'
            }
        });
        res.json(cus);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


app.get('/customer/whereAnd', async (req, res) => {
    try {
        const cus = await prisma.Customer.findMany({
            where: {
                AND: [
                    {
                        name: {
                            contains: 'h'
                        }
                    },
                    {
                        credit: {
                            gte: 0
                        }
                    }
                ]
            }
        });
        res.json(cus);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});



app.get('/customer/listBetweenCredit', async (req, res) => {
    try {
        const cus = await prisma.Customer.findMany({
            where: {
                credit: {
                    gte: 0,
                    lte: 100000000
                }
            }
        });
        res.json(cus);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/customer/sumCredit', async (req, res) => {
    try {
        const sumCredit = await prisma.Customer.aggregate({
            _sum: {
                credit: true
            }
        });
        res.json({ "sumCredit": sumCredit._sum.credit });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/customer/maxCredit', async (req, res) => {
    try {
        const maxCredit = await prisma.Customer.aggregate({
            _max: {
                credit: true
            }
        });
        res.json({ "maxCredit": maxCredit._max.credit });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


app.get('/customer/minCredit', async (req, res) => {
    try {
        const minCredit = await prisma.Customer.aggregate({
            _min: {
                credit: true
            }
        });
        res.json({ "minCredit": minCredit._min.credit });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


app.get('/customer/avgCredit', async (req, res) => {
    try {
        const avgCredit = await prisma.Customer.aggregate({
            _avg: {
                credit: true
            }
        });
        res.json({ "avgCredit": avgCredit._avg.credit });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.get('/customer/countCustomer', async (req, res) => {
    try {
        const count = await prisma.Customer.count();
        res.json({ "count Customer": count });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


app.post('/order/create', async (req, res) => {
    try {
        // const customerId = req.body.customerId;
        const payload = req.body;
        // const amount = req.body.amount;
        const order = await prisma.Order.create({
            // data: {
            //      customerId: customerId,
            //      amount: amount

            // }
            data: payload
        });
        res.json(order);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }


});


app.get('/customer/listOrder/:customerId', async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const orders = await prisma.Order.findMany({
            where: {
                customerId: customerId
            }
        });
        res.json(orders);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

});

app.get('/customer/listAllOrder', async (req, res) => {
    try {
        const orders = await prisma.Customer.findMany({
            include: {
                order: true
            }
        });
        res.json(orders);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

});


app.get('/customer/listOrderAndProduct/:customerId', async (req, res) => {
    try {
        const customerId = req.params.customerId;
        const cus = await prisma.Customer.findMany({
            where: { id: customerId },
            include: {
                order: {
                    include: {
                        product: true
                    }
                }
            }
        });
        res.json(cus);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});
