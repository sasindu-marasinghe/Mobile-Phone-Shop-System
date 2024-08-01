const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    name: { 
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    telephone: {
        type: Number,
        required: true
    },
    phoneType: {
        type: String,
        required: true
    },
    serviceType: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    }
    // image: {
    //     type: Object,
    //     required: true
    // }
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
