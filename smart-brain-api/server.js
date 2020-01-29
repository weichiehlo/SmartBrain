const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const database = {
    users:[
        {
            id:'123',
            name: 'John',
            email: 'john@gmail.com',
            entries: 0,
            joined: new Date()
        },
        {
            id:'124',
            name: 'salley',
            email: 'salley@gmail.com',
            entries: 0,
            joined: new Date()
        }
    ],
    login:[
        {
            id: '987',
            has: '',
            email: 'john@gmail.com'
        }
    ]
}

app.get('/', (req, res) =>{
    res.send(database.users)
})




app.post('/signin', (req, res) =>{

    
    if(bcrypt.compareSync(req.body.password, database.login[database.login.length-1].has)){
        // res.json('success')
        res.json(database.users[database.login.length-1])
    }else{
        res.status(400).json('error logging in')
    }

    // if(req.body.email === database.users[0].email &&
    //     req.body.password === database.users[0].password){
    //         res.json('success')
    // }
    // else{
    //     res.status(400).json('error logging in')
    // }
})


app.post('/register', (req, res) =>{

    const {email, password, name} = req.body;
    const hash = bcrypt.hashSync(password, 8);
    database.users.push(
            {
                id:'125',
                name: name,
                email: email,
                entries: 0,
                joined: new Date()
            })
    database.login.push(
                {
                    id:'125',
                    has: hash,
                    email: email,
                })
    res.json(database.users[database.users.length-1]);
}
)

app.get('/profile/:id', (req, res) =>{
    const { id } = req.params;//Can get res.param property
    let found = false;

    database.users.forEach(user =>{
        if(user.id === id){
            found = true;
            return res.json(user);
        }
    }) 
    if(!found){
        res.status(404).json('no such user')
    }
})


app.put('/image', (req, res)=>{
    const { id } = req.body;
    let found = false;

    database.users.forEach(user =>{
        if(user.id === id){
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    }) 

    if(!found){
        res.status(404).json('no such user')
    }

})

app.listen(3000, () =>{
    console.log('App is Running on Port 3000');
})



/**
 * 
 *  --> res = this is working
 *  signin --> POST = success/fail
 *   /register --> POST = user
 *  /profile/:userid  --> GET = user
 * /image --> PUT --> user
 * 
 */