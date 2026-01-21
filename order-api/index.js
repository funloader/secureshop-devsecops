const express = require('express');
const app = express();

// INTENTIONAL VULNERABILITY: Hardcoded AWS Keys for Gitleaks to find
const AWS_ACCESS_KEY = "AKIAIMNOTAREALKEY123"; 

app.get('/order', (req, res) => {
    res.json({ 
        order_id: 101, 
        status: "Shipped", 
        key_hint: AWS_ACCESS_KEY,
        info: "This API is running as root and contains hardcoded secrets."
    });
});

app.listen(5002, "0.0.0.0", () => {
    console.log('Order API running on port 5002');
});
