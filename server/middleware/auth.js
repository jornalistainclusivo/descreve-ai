module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Não autorizado: Token ausente' });
    }
    const token = authHeader.split(' ')[1];
    if (token === process.env.API_TOKEN) {
        return next();
    }
    return res.status(403).json({ success: false, error: 'Acesso negado: Token inválido' });
};
