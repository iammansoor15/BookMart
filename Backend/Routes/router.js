const express = require("express");
const router = express.Router();
const bookSchema = require("../models/bookSchema");
const User = require("../models/userSchema");



router.get("/allBooks", async (req, res) => {
  try {
    const books = await bookSchema.find().sort({ _id: -1 }); 
    res.status(200).json(books); 
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ msg: "Server Error" }); 
  }
});


router.post("/register", async (req, res) => {
  const { firstname, lastname, email, phone, password, cpassword, role } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ msg: "Email already registered" });
  }

  const newUser = new User({
    firstname,
    lastname,
    email,
    phone,
    password,
    role:role.toLowerCase(), 
  });

  await newUser.save();
  res.cookie("userId", newUser._id.toString(), {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.status(201).json({ msg: "Registered and logged in", redirect: "/" });
});




router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }
    
    res.cookie("userId", user._id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, 
      path: '/'
    });
  
    res.json({ msg: "Logged in", redirect: "/" });
  });
  

  router.post("/logout", (req, res) => {
    res.clearCookie("userId", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    res.json({ message: "Logged out successfully" });
  });



router.get("/", (req, res) => {
  if (req.cookies.userId) {
    res.send(`Welcome, ${req.cookies.userId}`);
  } else {
    res.send("Please login or register");
  }
});



router.get("/profile", async (req, res) => {
    console.log("Cookie:", req.cookies.userId); 
    if (!req.cookies.userId) {
      return res.status(401).json({ msg: "Not authenticated" });
    }
  
    const user = await User.findById(req.cookies.userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    console.log("Profile route accessed");

  
    res.status(200).json(user);
  });
  
  

  router.get("/isLoggedin", async (req, res) => {
  
    if (!req.cookies.userId) {
      return res.status(401).json({ msg: "Not authenticated" });
    }
  
    try {
      const user = await User.findById(req.cookies.userId);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      res.status(200).json({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error("Error in /isLoggedin route:", error);
      res.status(500).json({ msg: "Server Error" });
    }
  });



  router.post("/add-book", async (req, res) => {
    try {
      const { isbn, imageUrl, title, author, genre, location, price } = req.body;
  
      const userId = req.cookies.userId;
      if (!userId) return res.status(401).json({ msg: "Not authenticated" });
  
      const user = await User.findById(userId);
      if (!user || user.role !== "owner") return res.status(403).json({ msg: "Access denied" });
  
      if (!/^\d{13}$/.test(isbn)) {
        return res.status(400).json({ msg: "ISBN must be a 13-digit unique number" });
      }
  
      const existingBookInUser = user.books?.some(book => book.isbn === isbn);
      const existingBookInCollection = await bookSchema.findOne({ isbn });
  
      if (existingBookInUser || existingBookInCollection) {
        return res.status(400).json({ msg: "Book with this ISBN already exists" });
      }
  
      const newBook = {
        userId,
        isbn,
        image: imageUrl,
        title,
        author,
        genre,
        location,
        price,
        owner: user.firstname,
        email: user.email,     
        phone: user.phone
      };
  
      if (!user.books) user.books = [];
      user.books.push(newBook);
      await user.save();
  
      const savedBook = await bookSchema.create(newBook);
  
      res.status(201).json({ msg: "Book added successfully", book: savedBook });
    } catch (error) {
      console.error("Error in /add-book route:", error);
      res.status(500).json({ msg: "Server Error" });
    }
  });






  router.get('/mylistings/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const books = await bookSchema.find({userId }); // Assuming owner stores userId
      res.status(200).json(books);
    } catch (error) {
      console.error("Error fetching listings:", error);
      res.status(500).json({ msg: "Server Error" });
    }
  });
  
  
  
  
module.exports = router;



