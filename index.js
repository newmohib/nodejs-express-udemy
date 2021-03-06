const express = require('express')
const Joi = require('@hapi/joi');
const morgan = require('morgan');
const helmet = require('helmet');
const config = require('config');

const logger = require('./logger');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true})); // if data send by form urlEncode by key value then it use

app.use(express.static('public'));
app.use(helmet());

//Configuration
console.log('Application Name : ' + config.get('name'));
console.log('Mail Server : ' + config.get('mail.host'));

//environment 
//export NODE_ENV = development
if (app.get('env') === "development") {
    app.use(morgan('tiny'));
    console.log("morgan enabled..");
    
};
app.use(logger);


var courses = [
    { id: 1, name: "course 1" },
    { id: 2, name: "course 2" },
    { id: 3, name: "course 3" },
]

app.get('/', (req, res) => {
    res.send('Hellow World');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    let id = req.params.id;
    const course = courses.find(item => item.id === parseInt(id))
    if (!course) {
        return  res.status(404).send('The Course With given ID id not foundes')
    }
    res.send(course);
});
app.get('/api/posts/:year/:month', (req, res) => {
    let params = req.params;
    res.send(params);
});

app.get('/api/query/:year/:month', (req, res) => {
    let query = req.query;
    res.send(query);
});

app.post('/api/courses', (req, res) => {
    const { error, value } = validateCourse(req.body)

    if (error) {return res.status(400).send(error.details[0].message);  }

    if (error !== undefined) {
        let errorInfo = error.details
        let newError = errorInfo.map(item => { return { [item.context.key]: item.message } })
        return res.status(400).json(newError);
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(item => item.id === parseInt(req.params.id));
    if (!course) { return res.status(404).send("The Course With given Id was Not Found") }
    const { error, value } = validateCourse(req.body)

    if (error) { return res.status(400).send(error.details[0].message); return; }
    course.name = req.body.name;
    return res.send(course);
});


app.delete('/api/courses/:id', (req, res) => {
    const course = courses.find(item => item.id === parseInt(req.params.id));
    if (!course) { return res.status(404).send("The Course With given Id was Not Found") }
    const index = courses.indexOf(course);
    courses.splice(index, 1)
   return res.send(course)
})

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })
    return schema.validate(course, { abortEarly: false });

}

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening On Port ${port}...`);
})