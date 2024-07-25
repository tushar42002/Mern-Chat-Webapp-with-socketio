const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data.js");
const connectDB = require("./config/db.js");
const userRoutes = require("./routes/userRoutes.js");
const chatRouters = require("./routes/chatRoutes.js");
const messageRoute = require("./routes/messageRoute.js");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware.js");
// const cors = require('cors');
const path = require('path');

dotenv.config();

connectDB();
const app = express();

// app.use(cors());

app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRouters);
app.use('/api/message', messageRoute);

// -------------------------------Deployment -------------------------


const __dirname1 = path.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname1, '/frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname1, 'frontend', 'build', 'index.html'));
    }
    );

} else {
    app.get('/', (req, res) => {
        res.send("API is running ");
    });
}


// -------------------------------Deployment -------------------------


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(5000, console.log(`Server started on PORT ${PORT}`));


const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    },
});

io.on("connection", (socket) => {
    console.log('connected to socket.io');

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    })

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log('user Join room' + room);
    })

    socket.on('typing', (room) => socket.in(room).emit("typing"));
    socket.on('stop typing', (room) => socket.in(room).emit("stop typing"));

    socket.on('new message', (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;

        if (!chat.users) return console.log('chat.users not defined');

        chat.users.forEach(user => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit('message recieved', newMessageRecieved);
        })
    })


    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });

});

