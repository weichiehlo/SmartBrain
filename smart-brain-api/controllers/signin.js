const handleSignin = (req, res, knex, bcrypt) =>{

    const {email, password} = req.body;
    if(!email || !password){
        return res.status(400).json('Incorrect form submission')
    }

    knex.select('hash').from('logins').where('email', '=',email)
    .returning('hash')
    .then(data_password =>{
        if(bcrypt.compareSync(password, data_password[0].hash)){
            knex.select('*').from('users').where('email', '=',email)
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

}

module.exports = ({
    handleSignin:handleSignin
})

