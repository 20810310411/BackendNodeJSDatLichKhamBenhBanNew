const mongoose = require('mongoose');

const KhamBenh_Schema = new mongoose.Schema({        
        currentNumber: { type: String },        
        maxNumber: { type: String },        
        date: { type: Date },        
        timeType: { type: String },        
        doctorID: {ref: "Doctor", type: mongoose.SchemaTypes.ObjectId},     
    },
    { 
        timestamps: true,   // createAt, updateAt
    }
);
module.exports = mongoose.model("KhamBenh", KhamBenh_Schema);