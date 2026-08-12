const jwt = require("jsonwebtoken");
const constants = require("../constants");

// 🚨 SI CONSTANTS O PROCESS.ENV VIENEN VACÍOS, SE QUEDA CON LA CLAVE EN TEXTO PLANO DE RESPALDO:
const JWT_SECRET_KEY = constants.JWT_SECRET_KEY || process.env.JWT_SECRET_KEY || "MiClaveSuperSecretaDeRappi2026GeneradaDesdeNode";

function createAccessToken(user) {
   const expToken = new Date();
   expToken.setHours(expToken.getHours() + 240); 
   
   const payload = {
    token_type: "access",
    user_id: user._id,
    role: user.role, // 👈 AGREGADO: Incluye el rol del usuario en el token
    iat: Math.floor(Date.now() / 1000),          // En segundos
    exp: Math.floor(expToken.getTime() / 1000)   // En segundos
   };
   
   return jwt.sign(payload, JWT_SECRET_KEY);
}

function createRefreshToken(user) {
    const expToken = new Date();
    expToken.setDate(expToken.getDate() + 30); 
    
    const payload = {
        token_type: "refresh",
        user_id: user._id,
        iat: Math.floor(Date.now() / 1000),          // En segundos
        exp: Math.floor(expToken.getTime() / 1000)   // En segundos
    };
    
    return jwt.sign(payload, JWT_SECRET_KEY);
}

function verifyToken(token) {                    
    return jwt.verify(token, JWT_SECRET_KEY);
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    verifyToken                                              
};