import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    try {
        const { token } = req.headers;

        if (!token) {
            return res.json({
                success: false,
                message: 'Unauthorized. Please login.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id; // keep user ID for inquiry tracking later
        next();

    } catch (error) {
        return res.json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

export default authUser;
