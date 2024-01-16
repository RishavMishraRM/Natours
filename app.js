const { create } = require('domain');
const express = require('express');
const fs = require('fs');
const { get } = require('http');
const { createTracing } = require('trace_events');
const app = express();
app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

getAllTours = (req, res)=> {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
};


getTour =  (req, res)=> {
    //console.log(req.params);
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id == id);

    // if (id > tours.length) {
        if (!tour) {
        return res.status(404).json({
            status : 'fail',
            message : 'Invalid ID'
        })
    }

    res.status(200).json({
        status: 'success',
        data: {
           tour
        }
    });
};

createTour = (req, res)=> {
    //console.log(req.body);
    const newID = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({id: newID}, req.body);

    tours.push(newTour);
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    });
};

updateTour =  (req, res)=> {

    if (req.params.id * 1 > tours.length) {
            return res.status(404).json({
                status : 'fail',
                message : 'Invalid ID'
            })
        }

res.status(200).json({
    status : 'success',
    data: {
        tour: '<Updated tour here...>'
    }
})
};

deleteTour = (req, res)=> {
    if (req.params.id * 1 > tours.length) {
            return res.status(204).json({
                status : 'fail',
                message : 'Invalid ID'
            })
        }
res.status(200).json({
    status : 'success',
    data: null
})
};

app.get('/api/v1/tours', getAllTours);
app.get('/api/v1/tours/:id', getTour);
app.post('/api/v1/tours', createTour);
app.patch('/api/v1/tours/:id', updateTour);
app.delete('/api/v1/tours/:id', deleteTour);


const port = 3000;
app.listen(port, () => {
    console.log('App running on port ${port}...');
    });