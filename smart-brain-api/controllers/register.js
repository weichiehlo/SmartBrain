const handleRegister = (knex, bcrypt) => (req, res) =>{

    const {email, password, name} = req.body;

    if(!email || !name || !password){
        return res.status(400).json('Incorrect form submission')
    }

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
}

module.exports = {
    handleRegister: handleRegister
}