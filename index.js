// riippuvuudet
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
// yhteys eri porteista ja domaineista
app.use(cors());
app.use(express.json()); // muuttaa json stringin json objektiksi (pyynnöstä)
app.use(express.urlencoded({ //The express. urlencoded() function is a built-in middleware function in Express. It parses incoming requests with urlencoded payloads and is based on body-parser. Parameter: The options parameter contains various property like extended, inflate, limit, verify etc.
    extended: true
}));
app.listen(port, () => console.log(`Kuuntelee porttia ${port}`));

// MongoDB
const mongoose = require('mongoose');
const {
    response
} = require('express');
const mongoDB = 'mongodb+srv://wiljami:%23Perkele123@fsklusteri.se8og.mongodb.net/reseptit?retryWrites=true&w=majority'
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Mongo error!'))
db.once('open', function() {
    console.log("Database connected!")
})

// Schema
const reseptiSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'required'
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: Array,
        require: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    ingredients: {
        type: String,
        required: true
    }
});

reseptiSchema.index({
    name: 'text',
    description: 'text'
}); // reseptiSchema indexoitu, 

const Resepti = mongoose.model('Reseptit', reseptiSchema)

// REITIT

//
// GET (haku)       
// /reseptit
//
app.get('/reseptit', async function(req, res) {
    //console.log(req.query);
    let {
        limit = 50, category, q
    } = req.query; // muutetaan objekti integeriksi, 50 on default value limitille (Eli kun hakee tyhjää näyttää max 50 tulosta)
    const limitRecords = parseInt(limit); // jos limitille tulee arvo muutetaan se integeriksi (http://localhost:3000/reseptit/?limit=5 näyttää 5 tulosta)
    
    // custom query, reseptitSchema indexoitu.
    let query = {}; // objekti, joka sisältää queryn
    if (category) query.catgegory = category; //jos category, asetetaan category queryyn = kun category joka saadaan
    if (q) {
        query = { 
            $text: {
                $search: q
            } // tämä hakee DB:n (http://localhost:3000/reseptit/?q=maito näyttää reseptit missä on sana maito)
        };
    }
    try {
        const respat = await Resepti.find(query).limit(limitRecords); // query asetettu .find()
        res.json(respat)
    } catch (error) {
        res.status(400).json({
            message: error
        })
    }
});

//
// GET
// /reseptit/jalkiruoat
//
app.get('/reseptit/jalkiruoat', async (req, res) => {
    const reseptit = await Resepti.find({
        category: 'Jälkiruoat'
    })
    res.json(reseptit)
});

//
// GET
// /reseptit/paaruoat
//
app.get('/reseptit/paaruoat', async (req, res) => {
    const reseptit = await Resepti.find({
        category: 'Pääruoat'
    })
    res.json(reseptit)
});

//
// GET
// /reseptit/juomat
//
app.get('/reseptit/juomat', async (req, res) => {
    const reseptit = await Resepti.find({
        category: 'Juomat'
    })
    res.json(reseptit)
});




//
// POST          
// /reseptit                   
//
app.post('/reseptit', async function(req, res) {
    const newResepti = new Resepti({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        thumbnail: req.body.thumbnail,
        ingredients: req.body.ingredients
    });
    try {
        await newResepti.save();
        res.redirect('http://127.0.0.1:5501/')
    } catch (error) {
        res.status(400).json({
            message: error
        })
    }
});

//
// GET
// /reseptit/:id
app.get('/reseptit/:id', async (request, response) => {
    const data = await Resepti.findById(request.params.id)
    if (data) response.json(data)
    else response.status(404).end()
})

//
//  PATCH   
//  /reseptit/:id              
//  
app.patch('/reseptit/:id', async function(req, res) {

    let paramID = req.params.id;
    let name = req.body.name;

    try {
        const updateResepti = await Resepti.updateOne({
            _id: paramID
        }, {
            name: name
        });
        res.json(updateResepti)
    } catch (error) {
        res.status(400).json({
            message: error
        })
    }
});

///
// DELETE        
// reseptit/:id              
//
app.delete('/reseptit/:id', async function(req, res) {

    let paramID = req.params.id;
    let name = req.body.name;

    try {
        const data = await Resepti.deleteOne({
            _id: paramID
        });
        res.json(data)
    } catch (error) {
        res.status(400).json({
            message: error
        })
    }
});