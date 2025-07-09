import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.route.js'
import userRoutes from './routes/user.routes.js'
import notificationRoutes from './routes/notification.route.js'
import postRoutes from './routes/post.route.js'
import connectionRoutes from './routes/connection.route.js'
import { connectDB } from './lib/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

connectDB()

const allowedOrigins = [
	"http://localhost:5173", // Vite default
	"http://localhost:5174", // Your current dev port
	"https://unlinked.mksinha.info", // Your production frontend
];

app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin) return callback(null, true); // allow mobile/postman
			if (allowedOrigins.includes(origin)) {
				return callback(null, true);
			} else {
				return callback(new Error("Not allowed by CORS"));
			}
		},
		credentials: true,
	})
);



app.use(express.json({limit:'5mb'}))
app.use(cookieParser())

app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/users',userRoutes)
app.use('/api/v1/connections',connectionRoutes)
app.use('/api/v1/notifications',notificationRoutes)
app.use('/api/v1/posts',postRoutes)
app.listen(PORT, () => {
    console.log("server is listening on port",PORT);
    
})