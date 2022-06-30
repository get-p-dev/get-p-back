const { Router } = require('express');
const app = Router();

app.use('/users', require('./routes/users'));
app.use('/company', require('./routes/company'));
app.use('/people', require('./routes/people'));
app.use('/projects', require('./routes/projects'));

module.exports = app;