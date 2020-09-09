const express = require('express');
const app = express();

app.use(
  express.json({
    extended: false,
  })
);

app.get('/', (req, res) => {
  res.send('API running');
});

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/facility', require('./routes/api/facility'));
app.use('/api/restaurant-menu', require('./routes/api/restaurantMenu'));
app.use('/api/menu', require('./routes/api/menu'));
app.use('/api/dish', require('./routes/api/dish'));
app.use('/api/currency', require('./routes/api/currency'));
app.use('/api/daily-selling-report', require('./routes/api/dailySellingReport'));
app.use('/api/product',require('./routes/api/product'))
app.use('/api/daily-stock-report',require('./routes/api/dailyStockReport'))

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
