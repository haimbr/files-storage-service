const path = require('path');
const express = require('express');
const cors = require('cors');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
require('./db/mongoose');
const FilesRouter = require('./routers/filesRouter');
const UserRouter = require('./routers/usersRouter');
const { auth } = require('./middleware/auth');


const port = process.env.PORT;


const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');

const app = express();

app.set('view engine', 'hbs')
app.set('views', viewsPath)




app.use(express.static(publicDirectoryPath))
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(UserRouter);
app.use(FilesRouter);


app.get("/", auth, (req, res) => {
    res.render('index');
});

app.listen(port, () => console.log("Server connected, port:", port));