import mongo, {Schema} from 'mongoose'
const user = new Schema({
name: String,
interests: [String]
})
user.pre('save',function(next) {
next()   
})
user.pre('validate',function(next){
next()
})
user.methods.findSimilar = function(cb) {
this.model('User').find({interests:{$in:this.interests}}).exec(cb)    
}

describe('Mongo',() => {
    it.skip('should exist',() => {

    })    
})


