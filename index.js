const express = require('express')
const Joi = require('@hapi/joi');

const app = express();
app.use(express.json());

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
        res.status(404).send('The Course With given ID id not foundes')
    }
    res.send(course);
});
app.get('/api/posts/:year/:month', (req, res) => {
    let params = req.params;
    res.send(params);
});

app.get('/api/query/:year/:month', (req, res) => {
    //http://localhost:3000/api/query/2018/10?name=mohib
    let query = req.query;
    res.send(query);
});


app.post('/api/courses', (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        username:Joi.string().required(),
    })
    const { error, value } = schema.validate(req.body,{ abortEarly: false });

    if (error !== undefined) {
        res.status(400).send('Name is Required and should be minimum 3 characters.');
    }
    console.log("value", value);
    console.log("error", error);
    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening On Port ${port}...`);
})