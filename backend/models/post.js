const mongoose = require ('mongoose')

//Schema is just a blueprint not a model you will need to create a model
const postSchema = mongoose.Schema({
  title: {type: String, require: true},
  content: {type: String, require: true}
})

//this is how you create a model. first argument is name make sure to have a Cap letter 2nd is the schema
//module.exports exports the model so it can be used outside of this file
module.exports = mongoose.model('Post', postSchema)
