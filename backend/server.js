// server.js

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { Server } = require('socket.io');
const mongoose = require('mongoose');

// THƯ VIỆN BỔ SUNG CHO MVC & UTILITIES
const flash = require('express-flash');
const session = require('express-session');
const moment = require('moment');
const multer = require('multer');
const favicon = require('serve-favicon');

// === [FIX VERCEL] THAY ĐỔI CẤU HÌNH MULTER ===
// Thay vì lưu vào disk (dest: 'uploads/'), ta lưu vào Memory (RAM)
// để tránh lỗi EROFS: read-only file system trên Vercel.
const upload = multer({ storage: multer.memoryStorage() });

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Import logger tùy chỉnh
const logger = require('./src/shared/logger.js');
const ChatMessage = require('./src/models/chatMessage.model.js');
const User = require('./src/models/user.model.js');
const { buildConversationId } = require('./src/api/v1/controllers/chat.controller.js');

require('dotenv').config();

const parseCookies = (cookieHeader = '') => {
    return cookieHeader.split(';').reduce((acc, pair) => {
        const [rawKey, ...rest] = pair.trim().split('=');
        if (!rawKey) return acc;
        acc[decodeURIComponent(rawKey)] = decodeURIComponent(rest.join('=') || '');
        return acc;
    }, {});
};

// Import configs
const database = require('./config/database.js');
const corsConfig = require('./config/cors.js');
const systemConfig = require('./config/system.js');

// Import routes
const apiV1Routes = require('./src/api/v1/routes/index.route.js');
const adminRoutes = require('./src/admin/routes/index.route.js');

// Import middlewares
const { errorHandler, notFound } = require('./src/api/v1/middlewares/errorHandler.middleware.js');

// Connect to database
database.connect();

const app = express();

const socketCorsOrigin = typeof corsConfig.origin === 'function' ? '*' : corsConfig.origin;

const port = process.env.PORT || 3000;

// ======================
// VIEW ENGINE (for Admin MVC & Client)
// ======================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// App locals - available in all views
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;
app.locals.upload = upload;

// ======================
// SECURITY MIDDLEWARE
// ======================
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false // Tắt để TinyMCE hoạt động
}));
app.use(cors(corsConfig));
app.use(compression());

// ======================
// REQUEST PARSING
// ======================
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'huydeptrai'));
app.use(methodOverride('_method'));

// ======================
// SWAGGER DOCUMENTATION
// ======================
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        explorer: true
    })
);


// ======================
// SESSION, FLASH VÀ FAVICON
// ======================
app.use(session({
    secret: process.env.SESSION_SECRET || 'huydeptrai',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 * 24 }
}));

app.use(flash());

// Favicon - Kiểm tra file tồn tại trước khi dùng để tránh lỗi nếu thiếu file
const faviconPath = path.join(__dirname, 'public', 'images', 'favicon.ico');
try {
    app.use(favicon(faviconPath));
} catch (err) {
    console.log('Favicon not found, skipping...');
}


// ======================
// STATIC FILES
// ======================
app.use(express.static(path.join(__dirname, 'public')));

// [LƯU Ý QUAN TRỌNG]: Trên Vercel, thư mục 'uploads' sẽ rỗng vì ta không ghi file vào đó được.
// Bạn nên comment dòng này lại hoặc để đó nhưng hiểu là nó sẽ không phục vụ file upload mới.
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// ======================
// HEALTH CHECK & INFO
// ======================
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to E-Commerce API',
        version: '1.0.0',
        documentation: '/api/v1',
        endpoints: {
            health: '/health',
            api: '/api/v1',
            admin: `/${systemConfig.prefixAdmin}`
        },
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// ======================
// ROUTES
// ======================
app.use('/api/v1', apiV1Routes);

// ADMIN MVC
adminRoutes(app);


// ======================
// ERROR HANDLING
// ======================
app.use(notFound);
app.use(errorHandler);

// ======================
// START SERVER
// ======================
const server = app.listen(port, () => {
    // SỬ DỤNG logger
    logger.info('═══════════════════════════════════════');
    logger.info('🚀 Server Started Successfully!');
    logger.info(`📍 Server: http://localhost:${port}`);
    logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔗 API v1: http://localhost:${port}/api/v1`);
    logger.info(`👨‍💼 Admin Panel: http://localhost:${port}/${systemConfig.prefixAdmin}`);
    logger.info(`💚 Health Check: http://localhost:${port}/health`);
    logger.info('═══════════════════════════════════════');
});

// ======================
// SOCKET.IO (REAL-TIME CHAT)
// ======================
const io = new Server(server, {
    cors: {
        origin: socketCorsOrigin || '*',
        credentials: true,
    },
});

io.use(async (socket, next) => {
    try {
        const tokenFromAuth = socket.handshake.auth?.token;
        const cookies = parseCookies(socket.handshake.headers?.cookie || '');
        const token = tokenFromAuth || cookies.tokenUser;

        if (!token) {
            return next(new Error('Unauthorized'));
        }

        const user = await User.findOne({
            tokenUser: token,
            deleted: false,
            status: 'active',
        })
            .select('_id fullName avatar shopName')
            .lean();

        if (!user) {
            return next(new Error('Unauthorized'));
        }

        socket.data.user = {
            id: user._id.toString(),
            fullName: user.fullName,
            avatar: user.avatar,
            shopName: user.shopName,
        };

        socket.join(socket.data.user.id);
        return next();
    } catch (error) {
        console.error('❌ Socket auth error:', error);
        return next(new Error('Unauthorized'));
    }
});

io.on('connection', (socket) => {
    socket.on('sendMessage', async (payload = {}, ack) => {
        try {
            const { receiverId, content } = payload;

            if (!receiverId || typeof content !== 'string') {
                return ack?.({ ok: false, message: 'receiverId and content are required' });
            }

            if (!mongoose.Types.ObjectId.isValid(receiverId)) {
                return ack?.({ ok: false, message: 'Invalid receiver' });
            }

            const senderId = socket.data.user?.id;
            const trimmedContent = content.trim();

            if (!senderId || !trimmedContent) {
                return ack?.({ ok: false, message: 'Invalid message payload' });
            }

            const receiverExists = await User.exists({ _id: receiverId, deleted: false });
            if (!receiverExists) {
                return ack?.({ ok: false, message: 'Receiver not found' });
            }

            const conversationId = buildConversationId(senderId, receiverId);

            const saved = await ChatMessage.create({
                conversationId,
                sender: senderId,
                receiver: receiverId,
                content: trimmedContent,
                timestamp: new Date(),
            });

            const messagePayload = {
                id: saved._id,
                conversationId,
                sender: saved.sender,
                receiver: saved.receiver,
                content: saved.content,
                timestamp: saved.timestamp,
                isRead: saved.isRead,
            };

            io.to(receiverId).emit('newMessage', messagePayload);
            io.to(senderId).emit('newMessage', messagePayload);

            ack?.({ ok: true, message: messagePayload });
        } catch (error) {
            console.error('❌ sendMessage error:', error);
            ack?.({ ok: false, message: 'Failed to send message' });
        }
    });
});

// GRACEFUL SHUTDOWN
const gracefulShutdown = (signal) => { /* ... */ };
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('uncaughtException', (error) => { /* ... */ });
process.on('unhandledRejection', (error) => { /* ... */ });

module.exports = app;