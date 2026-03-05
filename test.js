const http = require('http');

const data = JSON.stringify({
    name: "Huzaif",
    email: "invalid-email", // causes validation error
    password: "pass",
    phone: "8983735361",
    gender: "Female",
    emergencyContacts: []
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, res => {
    let responseData = '';
    res.on('data', d => {
        responseData += d;
    });
    res.on('end', () => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`BODY: ${responseData}`);
    });
});

req.on('error', error => {
    console.error(error);
});

req.write(data);
req.end();
