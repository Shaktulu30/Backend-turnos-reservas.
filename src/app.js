import express from "express";
import servicesRouter from "./routes/services.router.js";
import bookingsRouter from "./routes/bookings.router.js";
import { engine } from 'express-handlebars';
import viewsRouter from './routes/views.router.js';

const app = express();

app.use(express.json());
app.use(express.static('./public'));

app.engine('handlebars', engine({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
}));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

app.use('/views', viewsRouter);
app.use('/api/services', servicesRouter);
app.use('/api/bookings', bookingsRouter);

export default app;