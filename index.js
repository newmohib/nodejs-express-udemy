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
        return  res.status(404).send('The Course With given ID id not foundes')
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
    const { error, value } = validateCourse(req.body)

    if (error) {return res.status(400).send(error.details[0].message);  }

    if (error !== undefined) {
        //'Name is Required and should be minimum 3 characters.'
        //.forEach((item,index)=>{return item.message})
        let errorInfo = error.details
        let newError = errorInfo.map(item => { return { [item.context.key]: item.message } })
        // let newError= errorInfo.map(item=>{return item.message})
        //let newError= errorInfo[0].message;
        return res.status(400).json(newError);
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