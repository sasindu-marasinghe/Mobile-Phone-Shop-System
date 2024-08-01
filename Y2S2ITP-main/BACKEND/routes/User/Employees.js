const router = require('express').Router();
const EmployeeModel = require('../../models/User/Employee');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const cookieParser = require('cookie-parser');
const nodemailer=require('nodemailer')
//const cors = require('cors');
//const express = require('express');
const path = require('path');

//const nodemailer = require('nodemailer');




//app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));

//app.use('/uploads/images', express.static(path.join(__dirname, 'uploads/images')));
router.route('/register').post((req, res) => {
    const { name, email, password, number } = req.body;
    bcrypt.hash(password, 10).then((hash) => {
        EmployeeModel.findOne({ email: email })
            .then((existingUser) => {
                if (existingUser) {
                    // Email already exists, return an error
                    res.status(400).json({ error: 'Email already registered' });
                } else {
                    // Email is unique, create a new user
                    EmployeeModel.create({ name, email, password: hash, number })
                        .then((newEmployee) => res.json(newEmployee))
                        .catch((err) => res.status(500).json({ error: err.message }));
                }
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    });

    // Check if the email already exists
});

router.route('/login').post((req, res) => {
  const { email, password } = req.body;
  EmployeeModel.findOne({ email: email })
      .then((user) => {
          if (user) {
              bcrypt.compare(password, user.password, (err, result) => {
                  if (err) {
                      res.json({ status: 'error', error: err.message });
                  } else {
                      if (result) {
                          const token = jwt.sign({ email: user.email }, 'jwt-secret-key', {
                              expiresIn: '1d',
                          });
                          // Set the token as a cookie
                          res.cookie('token', token, { httpOnly: true, maxAge: 86400000 }); // Max age set to 1 day in milliseconds
                          res.cookie('userEmail', user.email, { maxAge: 86400000 });
                        
                          // Send user ID along with other data
                          res.json({ status: 'success', userId: user._id,role:user.role, isAdmin: user.role === 'admin', isStaff: user.role === 'staff' });
                      } else {
                          res.status(401).json({ status: 'incorrect password' });
                      }
                  }
              });
          } else {
              res.status(404).json({ status: 'no record existed' });
          }
      })
      .catch((err) => {
          res.status(500).json({ status: 'error', error: err.message });
      });
});



router.route('/userdetails').get((req, res) => {
  EmployeeModel.find({ role: 'user' })
    .then((users) => {
      const userCount = users.length; // Get the count of regular users
      res.json({ users, userCount }); // Send both users and userCount in the response
    })
    .catch((err) => res.status(500).json(err));
});

router.route('/getUser/:id').get((req, res) => {
  const id = req.params.id;
  EmployeeModel.findById(id) // Using findById to directly search by _id
    .then((user) => {
      if (user) {
        res.json(user); // Send the user details in the response
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.put('/userupdate/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedUserData = {
      name: req.body.name,
      email: req.body.email,
      number: req.body.number,
    };

    // Check if password is provided and hash it
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      updatedUserData.password = hashedPassword;
    }

    // Check if reentered password is provided and hash it
    if (req.body.reenterPassword) {
      const hashedReenterPassword = await bcrypt.hash(req.body.reenterPassword, 10);
      updatedUserData.reenterPassword = hashedReenterPassword;
    }

    const updatedUser = await EmployeeModel.findByIdAndUpdate(
      id,
      updatedUserData,
      { new: true }
    );

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.route('/deleteUser/:id').delete((req, res) => {
  const id = req.params.id;
  EmployeeModel.findByIdAndDelete(id)
    .then((user) => {
      if (user) {
        res.json(user); // Send the user details in the response
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
}) ;

// Function to generate a numeric OTP
function generateNumericOTP(length) {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}



router.route('/forgot-password').post((req, res) => {
  const { email } = req.body;

  // Find user by email
  EmployeeModel.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ status: 'User not found' });
      }

      // Generate JWT token for password reset
      const token = jwt.sign({ email: user.email }, 'jwt-secret-key', {
        expiresIn: '1h', // Set expiry time for the token (e.g., 1 hour)
      });

      // Store token in cookie
      res.cookie('resetToken', token, { httpOnly: true, maxAge: 3600000 }); // Max age set to 1 hour in milliseconds
      res.cookie('userEmail', user.email, { maxAge: 3600000 });

      // Generate Numeric OTP (if you have a function named generateNumericOTP)
      const otp = generateNumericOTP(6); // You need to define this function

      // Save the OTP in the database
      user.otp = otp;
      user.save();

      // Send OTP via Email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'navindadharmasiri@gmail.com',
          pass: 'xbdd pchv ufvh spcs', // Please replace with your actual password or use environment variables for security
        },
      });

      // Define email content
      const mailOptions = {
        from: 'navindadharmasiri@gmail.com',
        to: user.email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`,
      };

      // Send email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('Error sending email:', error);
          return res.status(500).send({ status: 'Error sending email' });
        } else {
          console.log('Email sent:', info.response);
          return res.status(200).send({ status: 'OTP sent successfully' });
        }
      });
    })
    .catch((error) => {
      console.log('Error:', error);
      return res.status(500).send({ status: 'Internal server error' });
    });
});


// Assuming this is your backend route for OTP verification
router.route('/verify-otp').post(async (req, res) => {
  const { otp, userEmail } = req.body; // Retrieve userEmail from request body

  try {
    // Find user by email
    const user = await EmployeeModel.findOne({ email: userEmail });

    if (!user) {
      return res.send({ status: "Incorrect OTP" });
    }

    // Check if OTP matches
    if (user.otp !== otp) {
      return res.send({ status: "Incorrect OTP" });
    }

    // Clear the OTP from the database after successful verification
    user.otp = null;
    await user.save();

    return res.send({ status: "Success" });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).send({ status: "Error processing request" });
  }
});







router.route('/reset-password').post(async (req, res) => {
  const { Password ,userEmail} = req.body;
  try {
    if (!Password) {
      return res.status(400).send({
        status: 'Error resetting password',
        message: 'Password field is required',
      });
    }

    

    const user = await EmployeeModel.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).send({
        status: 'Error resetting password',
        message: 'User not found',
      });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    user.password = hashedPassword;
    await user.save();

    return res.send({ status: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    return res
      .status(500)
      .send({ status: 'Error resetting password', message: error.message });
  }
 


  
  
});

router.route('/AccountDetails').post((req, res) => {
  const { name, email, number, userEmail, userId } = req.body;

  // Update the user details based on userEmail
  EmployeeModel.findOneAndUpdate({ _id: userId }, { name, email, number, userId }, { new: true })
      .then(updatedUser => {
          if (updatedUser) {
              // Set the cookie before sending the response
              //res.cookie('userid', updatedUser._id, { maxAge: 86400000 });
              res.json({ status: 'success', updatedUser });
          } else {
              res.status(404).json({ status: 'error', message: 'User not found' });
          }
      })
      .catch(error => {
          res.status(500).json({ status: 'error', error: error.message });
      });
});



router.get('/getUsers/:userId', (req, res) => {
  const userId = req.params.userId;
  EmployeeModel.findOne({ _id: userId })
      .then((user) => {
          if (user) {
              res.json(user); // Send the user details in the response
          } else {
              res.status(404).json({ error: 'User not found' });
          }
      })
      .catch((err) => res.status(500).json({ error: err.message }));
});
//app.use(express.static(path.join(__dirname, 'uploads/images')));

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'C:/Users/User/Documents/GitHub/Y2S2ITP/Frontend/public/image');
  },
  filename:  (req, file, cb)=> {
    //const uniqueSuffix = Date.now();
    cb(null,  file.fieldname+"_"+Date.now()+path.extname(file.originalname));
  }
});


const upload = multer({ storage: storage });

router.post('/upload-image', upload.single('file'), async (req, res) => {
  console.log(req.file);

  const userEmail = req.body.email; // Access email from req.body

  // Check if a file was uploaded
  if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
      // Find the user with the provided email
      const user = await EmployeeModel.findOne({ email: userEmail });

      // If user not found, return an error
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Assuming you want to save the filename to MongoDB
      const imageName = req.file.filename;

      // Update the user's image field with the filename
      user.image = imageName; // Fixed the assignment to 'image' field
      await user.save();

      res.status(200).json({ message: 'Image uploaded successfully', user });
  } catch (error) {
      console.error('Error saving image filename to MongoDB:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/user/image/:userEmail', async (req, res) => {
  try {
    const user = await EmployeeModel.findOne({ email: req.params.userEmail });
    console.log('User:', user);
    if (user && user.image) {
      console.log('Image found:', user.image);
      const imagePath = path.join('C:/Users/User/Documents/GitHub/Y2S2ITP/Frontend/public/image', user.image);

      res.sendFile(imagePath);
    } else {
      console.log('Image not found for user:', req.params.userEmail);
      res.status(404).json({ error: 'Image not found for user' });
    }
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




router.route('/passwordchange').post(async (req, res) => {
  try {
    const {userId, currentPassword, newPassword } = req.body;

    
    const user = await EmployeeModel.findOne({ _id: userId });
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    
    const isPasswordValid = await bcrypt.compare(currentPassword, user. password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Incorrect current password.' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10); // Hash the new password
    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({ message: 'Password changed successfully.' });
} catch (error) {
    console.error('Error changing password:', error);
    return res.status(500).json({ message: 'Failed to change password. Please try again.' });
}


})

router.delete('/delete', (req, res) => {
  const { userId } = req.body;

  EmployeeModel.findOneAndDelete({ _id: userId })
      .then(deletedEmployee => {
          if (!deletedEmployee) {
              return res.status(404).json({ message: 'User not found.' });
          }
          res.status(200).json({ message: 'User account deleted successfully.' });
      })
      .catch(error => {
          console.error('Error deleting user account:', error);
          res.status(500).json({ message: 'Failed to delete user account. Please try again.' });
      });
});


router.route('/staffdetails').get((req, res) => {
  EmployeeModel.find({ role: { $in: ['staff', 'admin'] } }) // Use $in operator to match multiple values
    .then((users) => {
      const userCount = users.length; // Get the count of regular users
      res.json({ users, userCount }); // Send both users and userCount in the response
    })
    .catch((err) => res.status(500).json(err));
});

router.route('/getUser/:id').get((req, res) => {
  const id = req.params.id;
  EmployeeModel.findById(id) // Using findById to directly search by _id
    .then((user) => {
      if (user) {
        res.json(user); // Send the user details in the response
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});




router.post('/remove-image', async (req, res) => {
  const { userId } = req.body;

  try {
      // Find the user with the provided userId
      const user = await EmployeeModel.findOne({ _id: userId });

      // If user not found, return an error
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Remove the image filename from the user document
      user.image = null; // Assuming 'image' is the field storing the filename
      await user.save();

      res.status(200).json({ message: 'Image removed successfully', user });
  } catch (error) {
      console.error('Error removing image from MongoDB:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
router.post(`/userimageupdate/:id`, upload.single('file'), async (req, res) => {
  console.log(req.file);

  const id = req.params.id;

  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Find the user by ID
    const user = await EmployeeModel.findById(id);

    // If user not found, return an error
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Assuming you want to save the filename to MongoDB
    const imageName = req.file.filename;

    // Update the user's image field with the filename
    user.image = imageName;
    await user.save();

    res.status(200).json({ message: 'Image uploaded successfully', user });
  } catch (error) {
    console.error('Error saving image filename to MongoDB:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/userremove-image/:id', async (req, res) =>   {
  const id = req.params.id;

  try {
      // Find the user with the provided id
      const user = await EmployeeModel.findById(id);

      // If user not found, return an error
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Remove the image filename from the user document
      user.image = null; // Assuming 'image' is the field storing the filename
      await user.save();

      res.status(200).json({ message: 'Image removed successfully', user });
  } catch (error) {
      console.error('Error removing image from MongoDB:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});

router.route('/staffregister').post((req, res) => {
  const { name, email, password, number, role } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    EmployeeModel.findOne({ email: email })
      .then((existingUser) => {
        if (existingUser) {
          // Email already exists, return an error
          res.status(400).json({ error: 'Email already registered' });
        } else {
          // Email is unique, create a new user
          EmployeeModel.create({ name, email, password: hash, number, role })
            .then((newEmployee) => res.json(newEmployee))
            .catch((err) => res.status(500).json({ error: err.message }));
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
});

router.put('/staffupdate/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const updatedUserData = {
      name: req.body.name,
      email: req.body.email,
      number: req.body.number,
      role: req.body.role
    };

    // Check if password is provided and hash it
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      updatedUserData.password = hashedPassword;
    }

    // Check if reentered password is provided and hash it
    if (req.body.reenterPassword) {
      const hashedReenterPassword = await bcrypt.hash(req.body.reenterPassword, 10);
      updatedUserData.reenterPassword = hashedReenterPassword;
    }

    const updatedUser = await EmployeeModel.findByIdAndUpdate(
      id,
      updatedUserData,
      { new: true }
    );

    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





//const PORT = process.env.PORT || 8181;




module.exports = router;