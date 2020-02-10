const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'andy1314520',
      database : 'smart-brain'
    }
  });





const app = express();
app.use(express.json());
app.use(cors());



app.get('/', (req, res) =>{
    res.send(database.users)
})




app.post('/signin', (req, res) =>{

    knex.select('hash').from('logins').where('email', '=',req.body.email)
    .returning('hash')
    .then(password =>{
        if(bcrypt.compareSync(req.body.password, password[0].hash)){
            knex.select('*').from('users').where('email', '=',req.body.email)
            .returning('*')
            .then(user =>{
                res.json(user[0])
            })
            .catch(err =>res.status(400).json('unable to fetch user'))
            
        }else{
            res.status(400).json('error logging in')
        }
        }
    ).catch(err =>res.status(400).json('unable to login'))

    // if(bcrypt.compareSync(req.body.password, database.login[database.login.length-1].has)){
    //     // res.json('success')
    //     res.json(database.users[database.login.length-1])
    // }else{
    //     res.status(400).json('error logging in')
    // }

})


app.post('/register', (req, res) =>{

    const {email, password, name} = req.body;
    const hash = bcrypt.hashSync(password, 8);

    knex.transaction(trx =>{
        trx.insert({
            hash:hash,
            email:email
        }).into('logins')
        .returning('email')
        .then(loginEmail =>{
            return trx('users')
            .returning('*')
            .insert({
                name:name, 
                email:loginEmail[0], 
                joined: new Date()
            })
            .then(user =>{
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)

    })
    .catch(err =>res.status(400).json('unable to register'));


    // knex('users')
    // .returning('*')
    // .insert({
    //     name:name, 
    //     email:email, 
    //     joined: new Date()
    // })
    // .then(user =>{
    //     res.json(user[0]);
    // })
    // .catch(err =>res.status(400).json('unable to register'));
    

    // knex('logins').insert({
    //     hash:hash,
    //     email:email
    // }).then(console.log);
}
)

app.get('/profile/:id', (req, res) =>{
    const { id } = req.params;//Can get res.param property

    knex.select('*').from('users').where({id})
        .then(user =>{
            if(user.length){
                res.json(user[0]);
            }else{
                res.status(404).json('Not found')
            }
        
    })
    .catch(err => res.status(400).json('error getting user'));

 
})


app.put('/image', (req, res)=>{
    const { id } = req.body;
    knex('users').where('id','=',id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries =>{
        res.json(entries[0])
    })
    .catch(err => res.status(400).json('unable to get entries'))


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