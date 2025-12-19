const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {

res.json({ message: 'Add book endpoint working' });

});

module.exports = router;