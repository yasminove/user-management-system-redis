const express = require('express'); 
const redis = require('redis');
const bodyParser = require('body-parser');
const path = require('path')
const app = express(); 

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: false }))

app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'ejs')

const PORT = process.env.PORT || 4000; 

const client = redis.createClient();
client.on('connect', () => {
    console.log('Redis server listening');
})


app.get('/', (req, res) => {
    res.render('index', {
        title: 'hello yasmina'
    })
    // res.send('home route works')
})


app.post('/user/search', (req, res) => {
    const { id } = req.body; 
    console.log(id, 'id');
    client.hgetall(id, (err, userInfo) => {
        if(err){
            console.log('Err in getting user', err);
        }
        res.render('userDetails', {
            userInfo: userInfo
        })
    }); 
})

app.post('/user/add', (req, res) => {
    const { id, name, email, phone } = req.body; 
    client.hmset(id, ['name', name, 'email', email, 'phone', phone], (err, user) => {
        if(err){
            console.log('Err in adding user',err);
        }

        console.log(user, 'user');
        res.redirect('/')
    })
})

app.get('/user/add', (req, res) => {
    res.render('addUser')
})



app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})