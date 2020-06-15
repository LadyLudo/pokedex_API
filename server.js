const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
require('dotenv').config()

const app = express();
const PORT =  process.env.PORT || 8000;
const validTypes = ['Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting', 'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice', 'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water']
const POKEDEX = require('./pokedex.json');
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'


app.use(morgan(morganSetting));
app.use(helmet);
app.use(validateBearerToken);
app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
        response = { error}
    } else {
        response = { error }
    }
    res.status(500).json(response)
})

app.get('/types', handleGetTypes);
app.get('/pokemon', handleGetPokemon);

function validateBearerToken(req,res,next) {
    const authToken = req.get('Authorization');
    const apiToken = process.env.API_TOKEN;

    if(!authToken || authToken.split(" ")[1] !== apiToken) {
        return res.status(401).json({error: 'Unauthorized request'})
    }
    
    next();
}

function handleGetTypes(req,res){
    res.json(validTypes);
}

function handleGetPokemon(req,res) {
    let response = POKEDEX.pokemon;

    if(req.query.name){
        response = response.filter(pokemon => {
            return pokemon.name.toLowerCase().includes(req.query.name.toLowerCase());
        })
    }

    if(req.query.type){
        response = response.filter(pokemon => {
            return pokemon.type.includes(req.query.type);
        })
    }

    res.json(response)
}





app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
})
