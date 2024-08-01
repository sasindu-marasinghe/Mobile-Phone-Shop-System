// Import necessary modules
const express = require("express");
const router = express.Router();
const Appointment = require("../../models/appointment/appointment"); // Adjusted import to match the model name




// Create operation (Create a new appointment)
router.route("/add").post((req, res) => {
    // Extract data from request body
    const { name, email, telephone,phoneType,serviceType, date, description} = req.body;

    // Create a new appointment object
    const newAppointment = new Appointment({
        name,
        email,
        telephone,
        phoneType,
        serviceType,
        date,
        description
        //image

    });

    // Save the new appointment to the database
    newAppointment.save().then(()=>{
        res.json("Appointmrnt Added")
    }).catch((err)=>{
        console.log(err);
    })

        .then(() => {
            res.json({ message: "Appointment added successfully" }); // Adjusted response message format
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err.message }); // Adjusted response status and error message
        });
});

// Read operation (Get all appointments)
router.get("/", (req, res) => {
    Appointment.find()
        .then((appointments) => {
            res.json(appointments); // Return the list of appointments
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err.message }); // Adjusted response status and error message
        });
});

// Update operation (Update an existing appointment)
router.put("/update/:id", async (req, res) => {
    const userId = req.params.id;
    const { name, email, telephone,phoneType,serviceType, date, description} = req.body;

    const updateAppointment = {
        name, 
        email, 
        telephone, 
        phoneType,
        serviceType,
        date, 
        description
        //image
    };

    // Update the appointment by ID
    try {
        await Appointment.findByIdAndUpdate(userId, updateAppointment);
        res.status(200).json({ message: "Appointment updated successfully" }); // Adjusted response message format
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message }); // Adjusted response status and error message
    }
});

// Delete operation (Delete an appointment)
router.delete("/delete/:id", async (req, res) => {
    const userId = req.params.id;

    // Delete the appointment by ID
    try {
        await Appointment.findByIdAndDelete(userId);
        res.status(200).json({ message: "Appointment deleted successfully" }); // Adjusted response message format
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message }); // Adjusted response status and error message
    }
});

// Get operation (Get a specific appointment by ID)
router.get("/get/:id", async (req, res) => {
    const userId = req.params.id;

    // Find the appointment by ID
    try {
        const appointment = await Appointment.findById(userId);
        if (!appointment) {
            res.status(404).json({ error: "Appointment not found" }); // Adjusted response status and error message
        } else {
            res.status(200).json({ message: "Appointment fetched successfully", appointment }); // Adjusted response message format
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message }); // Adjusted response status and error message
    }
});

module.exports = router;