const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var cookieParser = require('cookie-parser')
const app = express()
const cors = require('cors');

const JWT_SECRET = 'b2637fe72f618333ce1c0326b09c526e37c785be585695f5617a2e95ac96cf8f8a4d39749b257d3bf1c52e356e8b0486c5f3d60fc3aaab0cb573fe9d0787f6b1';
const uri = PROCESS.ENV.URL;
const User = require('./model/user');
const Model = require('./model/model');
const Feedback = require('./model/feedback');
const Model2 = require('./model/model2');
const Poll = require('./model/poll');
const Vote = require('./model/vote');
const auth = require('./middleware/auth');

app.use(cors());
app.use(express.json());
app.use(express.static('public'))
app.use(cookieParser('yes'));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.redirect('/dashboard')
})

app.get('/dashboard', auth, (req, res) => {
    if (req.user.type == 'admin') {
        res.sendFile(__dirname + '/public/dashboard.html')
    }

    else if (req.user.type == 'user') {
        res.sendFile(__dirname + '/public/dashboard2.html')
    }
    else
        res.redirect('/login')
})

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html')
})
app.post('/register', async (req, res) => {
    var name = req.body.name;
    var type = req.body.type;
    var phoneNo = req.body.phoneNo;
    var password = req.body.password;
    try {
        if (!name) throw Error("Enter Name");
        if (!phoneNo) throw Error("Enter phoneNo");
        if (!password) throw Error("Enter Password");
        const checkPhoneNo = await User.findOne({ phoneNo: phoneNo });
        if (checkPhoneNo) throw Error('PhoneNo already exists');


        if (password.length < 8) throw Error('Password should be atleast 8 char long');
        var salt = await bcrypt.genSalt(10);
        var passHash = await bcrypt.hash(password, salt);
        const savedUser = await User.create({ name, phoneNo, password: passHash, type });

        const token = jwt.sign({ id: savedUser._id, type: savedUser.type }, JWT_SECRET, { expiresIn: '1h' });
        if (!token) throw Error('Couldnt sign the token');

        res.cookie('x-auth-token', token, {
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
            signed: true,
            //secure:true,
        })
        //res.status(200).json({ msg: 'Account created Succesfull', error: false });
        res.redirect('/')

    } catch (e) {
        res.status(200).json({ msg: e.message, error: true });
    }

})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/login.html')
})

app.post('/login', async (req, res) => {
    var phoneNo = req.body.phoneNo;
    var password = req.body.password;
    try {
        if (!phoneNo) throw Error("Enter phone No");
        if (!password) throw Error("Enter Password");
        var userInfo = await User.findOne({ phoneNo });
        if (!userInfo) throw Error("Invalid Phone No");

        var success = await bcrypt.compare(password, userInfo.password);
        if (!success) throw Error("Invalid Password");

        const token = jwt.sign({ id: userInfo._id, name: userInfo.name, type: userInfo.type }, JWT_SECRET, { expiresIn: '1h' });
        if (!token) throw Error('Couldnt sign the token');

        res.cookie('x-auth-token', token, {
            maxAge: 1000 * 60 * 60,
            httpOnly: true
            // signed: true,
            //secure:true
        })
        //res.status(200).send({ msg: 'Login successfully', error: false });
        res.redirect('/dashboard')

    } catch (e) {
        res.status(200).send({ msg: e.message, error: true });
    }
})

app.get('/logout', auth, (req, res) => {
    res.clearCookie('x-auth-token');
    res.redirect('/login')
})

app.get("/createsurvey", (req, res) => {
    res.sendFile(__dirname + '/public/survey.html')
})

app.post("/createsurvey", function (req, res) {

    const doc = new Model({
        Survey_name: req.body.Sname,
        Question: req.body.ques,
        Option1: req.body.op1,
        Option2: req.body.op2,
        Option3: req.body.op3,
        Option4: req.body.op4
    })

    // save that document
    doc.save(function () {
        console.log("Data inserted")
    })
})

app.get("/survey", (req, res) => {
    res.sendFile(__dirname + '/public/survey2.html')
})

app.post("/survey", auth, (req, res) => {
    i = 0;
    const doc2 = new Model2({
        array: req.body.checke,
        voter : req.user.id
    })
    doc2.save()

})

app.get("/getsurvey", auth, (req, res) => {
    Model.find(function (err, data) {
        if (err) {
            console.log(err)
        }
        else {
            res.send(data)
        }
    })

})

app.get('/createpoll', auth, (req, res) => {
    res.sendFile(__dirname + '/public/poll.html')
})

app.post('/createpoll', auth, async (req, res) => {
    console.log('Poll created Succesfull')
    var name = req.body.name;
    var c1 = req.body.c1
    var c2 = req.body.c2
    var creator = req.user.id

    try {
        var poll = await Poll.create({ name, c1, c2, creator });
        res.redirect('/')
    } catch (e) {
        res.status(200).json({ msg: e.message, error: true });
    }

})

app.get('/getpolls', auth, async (req, res) => {
    var userId = req.user.id;
    try {
        const polls = await Poll.find();

        res.status(200).json({ msg: 'Polls', polls: JSON.stringify(polls), error: false });

    } catch (e) {
        res.status(200).json({ msg: e.message, error: true });
    }
})

app.get('/poll', auth, (req, res) => {
    res.sendFile(__dirname + '/public/poll2.html')
})

app.post('/poll', auth, async (req, res) => {

    var pid = req.body.pid
    var op = req.body.op
    var voter = req.user.id

    try {
        var vote = await Vote.create({ voter, pid, op });
        res.redirect('/')
    } catch (e) {
        res.status(200).json({ msg: e.message, error: true });
    }

})

app.get("/feedback", auth, (req, res) => {
    res.sendFile(__dirname + '/public/feedback.html')
})

app.post("/feedback", auth, async (req, res) => {
    var feedback = req.body.feedback
    var user = req.user.id

    try {
        await Feedback.create({ user, feedback });
        res.redirect('/')
    } catch (e) {
        res.status(200).json({ msg: e.message, error: true });
    }

})

// app.get('/myinfo', auth, async (req, res) => {
//     var user = req.user;
//     res.status(200).json({ msg: 'Info', user: JSON.stringify(user), error: false });
// })


app.listen(3000, async () => {
    console.log('Server started...');
    try {
        await mongoose.connect(uri, {
            useUnifiedTopology: true,
            useCreateIndex: true,
            useNewUrlParser: true
        });
        console.log('Database Connected...');
    } catch (e) {
        console.log('Database error');
    }
})