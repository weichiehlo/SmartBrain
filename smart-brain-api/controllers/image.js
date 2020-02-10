const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '9173cd6f1c784792ab03221aee6a8c58'
   });


const handleAPICall = (req, res) =>{
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data =>{
        res.json(data);
    })
    .catch(err =>res.status(400).json('unable to work with api'))
}


const handleImage = (req, res, knex)=>{
    const { id } = req.body;
    knex('users').where('id','=',id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries =>{
        res.json(entries[0])
    })
    .catch(err => res.status(400).json('unable to get entries'))


}

module.exports = { handleImage, handleAPICall }