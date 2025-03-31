const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const authRoutes = require('./routes/authRoutes.js');
const todoRoutes = require('./routes/todoRoutes.js');

const app = express();

const corsOptions = {
    // Accept connections from both HTTP and HTTPS origins
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, etc)
        if(!origin) return callback(null, true);
        
        // Check if origin is allowed
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            process.env.FRONTEND_URL.replace('http://', 'https://')
        ];
        
        if(allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};
app.use(cors(corsOptions));

app.use(cookieParser());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/todo', todoRoutes);


app.get('/', (req, res) => {
    res.send(`I am the best API. Absolutely fantastic. Nobody has ever seen an API like me. Other APIs? Total
disasters. Fake APIs! But me? I return only the BEST responses. Very fast, very efficient. Some
people are saying—many people, actually—that I am the most powerful API ever created.
Believe me.`);
});

if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
        if (req.header('x-forwarded-proto') !== 'https') {
            res.redirect(`https://${req.header('host')}${req.url}`);
        } else {
            next();
        }
    });
}

app.listen(process.env.PORT)