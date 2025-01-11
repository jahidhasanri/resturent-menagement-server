const express = require('express')
const cors=require('cors')
const jwt = require('jsonwebtoken');
const app = express()
const cookieParser= require('cookie-parser')
require('dotenv').config();
const corsOptions = {
  origin: [
    'https://assignment-11-soution.web.app',
    'http://localhost:5173'
  ],  
  credentials:true
};
app.use(cors(corsOptions));
app.use(express.json())
app.use(cookieParser())
  const port=process.env.PORT || 5000;



const verifyToken = (req, res , next) =>{
  const token = req.cookies?.token;
if (!token) {
  return res.status(401).send({ message: 'Unauthorized access' });
}
 jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
  if(err){
    return res.status(401).send({ message : 'unauthorized access'});
  }
  req.user= decoded;
  next();
 })
}


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASS}@cluster0.e8jg2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const database = client.db("insertDBJobs");
    const databasecollection = database.collection("bdJobs");
    const databaseP = client.db("insertDBJobs");
    const purchaseCollection = databaseP.collection("purchases");

// auth related api

app.post('/jwt', async (req, res) => {
  const email = req.body;
  const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '365d'
  });
  res.cookie('token', token, {
   
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    
  })
  .send({ success: true });
});



app.post('/logout',(req,res)=>{
  res.clearCookie('token',{
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  })
  .send({success: true})
})





app.post('/jobs', verifyToken, async (req, res) => {
  try {
    const decodedEmail = req.user?.email; 
    const user = req.body; 
    console.log(decodedEmail,user.userEmail);
    if (decodedEmail !== user.userEmail) {
      return res.status(401).send({ message: 'Unauthorized access' });
    }

    const result = await databasecollection.insertOne(user);
    res.send(result);
  } 
  catch (error) {
    console.error('Error inserting job:', error);
    res.status(500).send({ message: 'Internal server error' });
  }
});

   
    
app.get('/jobs', async (req, res) => {
  try {
    const { search, sort } = req.query;

    // Building the query based on search term
    const query = search ? { food: { $regex: search, $options: 'i' } } : {};

    // Building the sort object
    const sortOrder = sort === 'desc' ? -1 : 1; // -1 for descending, 1 for ascending

    // Fetching the data from the collection
    const foods = await databasecollection
      .find(query)
      .toArray();

    // Convert the price to a number and sort
    const sortedFoods = foods.map(food => ({
      ...food,
      price: parseFloat(food.price), // Convert price to a number
    })).sort((a, b) => sortOrder * (a.price - b.price)); // Sort by price

    res.send(sortedFoods);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).send({ message: 'Error fetching jobs' });
  }
});


    app.get("/jobs/:id", async (req, res) => {
      const id = req.params.id;
      const result = await databasecollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    app.get('/myfoods',verifyToken, async (req, res) => {
    const decodedEmail = req.user?.email
      const { email } = req.query; 
          const query = { userEmail: email };
          if(decodedEmail !== email)
            return res.status(401).send({ message: 'Unauthorized access' });
          const cursor = databasecollection.find(query);  
          const result = await cursor.toArray();  
          res.send(result);  
      
  });

  app.put('/jobs/:id',verifyToken, async (req, res) => {
    const decodedEmail = req.user?.email;
    const id = req.params.id;
    const user = req.body;
    console.log(decodedEmail,user.userEmail);
    const filter = { _id: new ObjectId(id) };
    const options = { upsert: false }; // Prevent creating new if not found
    const updateDoc = {
      $set: {
        img: user.img,
        food: user.food,
        categoryName: user.categoryName,
        quantity: user.quantity,
        price: user.price,
        foodOrigin: user.foodOrigin,
        description: user.description,
      },
    };
    try {
      const result = await databasecollection.updateOne(filter, updateDoc, options);
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error updating food item" });
    }
  });


    // for purchase

    app.post('/purchase',verifyToken, async (req, res) => {
      const decodedEmail = req.user?.email; 
      const user = req.body;
      const {buyerEmail,food_Id, quantity } = user;  
      if (decodedEmail !== buyerEmail) {
        return res.status(401).send({ message: 'Unauthorized access: email does not match' });
      }
      const result = await purchaseCollection.insertOne({
          ...user,
          buyingDate: new Date(user.buyingDate), 
      });
  
      const query = { _id: new ObjectId(food_Id) }; 
      const job = await databasecollection.findOne(query); 
      // Update the PurchaseCount with the quantity
      const currentCount = job.PurchaseCount || 0; 
      const foodquantity =parseInt(job.quantity)
      const newCount = currentCount + parseInt(quantity, 10);
      const CurrentFoodQuantity = foodquantity - quantity;
  
      const updateDoc = {
          $set: {
              PurchaseCount: newCount,
              quantity: CurrentFoodQuantity
          },
      };
  
      const updateresult = await databasecollection.updateOne(query, updateDoc);
  
      res.send(result);
  });
  


  app.get('/purchase', verifyToken, async (req, res) => {
    try {
      const decodedEmail = req.user?.email;
      const { email } = req.query;

      if (decodedEmail !== email) {
        return res.status(401).send({ message: 'Unauthorized access' });
      }

      const result = await purchaseCollection.find({ buyerEmail: email }).toArray();

      for (const application of result) {
        const food = await databasecollection.findOne({ _id: new ObjectId(application.food_Id) });
        if (food) {
          application.food_img = food.img;
          application.owner_Email = food.userEmail;
          application.owner_Name = food.userName;
        }
      }

      res.send(result);
    } catch (error) {
      console.error('Error fetching purchases:', error);
      res.status(500).send({ message: 'Error fetching purchases' });
    }
  });


    app.get("/purchase/:id", async (req, res) => {
      const id = req.params.id;
      const result = await purchaseCollection.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    
    // ডিলিট রুট
    app.delete('/purchase/:id', async (req, res) => {
      const id = req.params.id;
    const query = {_id : new ObjectId(id)}
    const result = await purchaseCollection.deleteOne(query)
    res.send(result)
      
    });
    


    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })