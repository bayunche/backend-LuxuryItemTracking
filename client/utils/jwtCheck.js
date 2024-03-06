const jwt = require("jsonwebtoken");
const { ulid } = require('ulid');

const secretKey = 'Hatsune Miku';
const expiresIn = '24h';

const generateToken = (userId) => {
    const payload = {
        userId,
    };

    return jwt.sign(payload, secretKey, { expiresIn });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, secretKey);
    } catch (err) {
        console.error('JWT Verification Failed:', err);
        return null;
    }
};

module.exports = { generateToken, verifyToken };
