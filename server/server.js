require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


// test data
// const posts = [
//     {
//         name : 'Meghana',
//         username : 'meghana.cosmos',
//          title : 'post 1'
//     },
//     {
//        name : 'Bhoomi',
//        username : 'bhoomi.cosmos',
//        title : 'post 2'
//    }, { 
//        name : 'test', 
//        username : 'test',
//        title : 'test'
//    },
//    {
//        name :"test-2",
//        username :'test-2',
//        title :"test-2 post"
//    }
// ]

app.get('/posts', authenticateToken, (req, res ) => {
    res.json(posts.filter(post => post.username === req.user.username))
}) 


function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"]
     // Bearer TOKEN
    const TOKEN = authHeader && authHeader.split(" ")[1]
    if (TOKEN) {
        jwt.verify(TOKEN , process.env.ACCESS_TOKEN, (err, user) => {
            if (err) {
                return res.status(403).send("Access denied")
             }
             console.log(user)
             req.user = user 
             next()

        })
    }
   
}


app.listen(4000)