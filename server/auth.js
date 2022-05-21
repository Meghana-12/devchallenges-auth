require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.username}:${process.env.password}@cluster0.sfsaq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

// lets you use the json body passed in the req 
app.use(express.json())

// test data

// let users = [
//     {
//         username: "test",
//         password: "$2b$10$5kBcJ8FBj/AOmxA.Ms8lq.Nrt5rvVsGvAXLO6ZOLbr5f3C5xe7/K2",
//     },
//     {
//         username: "test-2",
//         password: "$2b$10$xFtBIIxePAXC4z33ZNGqGeTjC/lbh8MeJGWjtrb7xnRvRnKh6pz.O",
//     }
//  ]
// //  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE2NTI5OTEzMzcsImV4cCI6MTY1Mjk5MTM0N30.JNc51NBZt13FcdmBwPTxzDHtebsdNkqbJPmq4QlnWug
// let refreshTokens = [
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE2NTI5OTEzMzd9.1NgqFWFKAYapbZzRYkmsr2dxpXiWRmLz8QGTjbRExGE"
// ]

app.post('/auth/token', (req, res) => {
    const refreshToken = req.body.token
    if (refreshToken === null) return res.sendStatus(401)
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = genAccessToken({ username: user.username })
        res.json({ accessToken: accessToken })
    })
})

app.post('/auth/signup',  async (req, res) => {
    try {
        // const salt = await bcrypt.genSalt()
        // salt helps you get different hashes for same password (multiple users may have same password) - default 10
        const hashedpwd = await bcrypt.hash(req.body.password, 10)
        // bcrypt stores the salt in the passwor itself so no need to save it 
        console.log(hashedpwd)
        const user = { password : hashedpwd, username : req.body.username}
        users.push(user)
        res.status(201).send(`New user ${req.body.username} added`)
    } catch {
        res.status(500).send()
    }
})
app.delete('/auth/logout', async (req, res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token)
    res.status(204).send('Logged out')
})
app.post('/auth/signin', async (req, res) => {
    const user = users.find(user => user.username === req.body.username)
    if (user === null ) {
            return res.status(400).send("User can't be found! Please sign up!")
    }
    try {        
        // make sure the hashed passwords match
        if(await bcrypt.compare(req.body.password, user.password)) {
                const username = req.body.username
                const user = { username: username }
                const accessToken = genAccessToken(user)
                const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN)
                refreshTokens.push(refreshToken)
                res.json({ accessToken : accessToken, refreshToken : refreshToken})
            } else {
                res.send("Password is incorrect!")
            }
        }
    catch{
        res.status(500).send()
    }
})

function genAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '20s' })
}


app.listen(3000)