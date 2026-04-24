const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { fullName, email, password, role } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ fullName, email, password, role });
        await user.save();

        const payload = { id: user._id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'agrisecret', { expiresIn: '1d' });

        res.json({ token, user: { id: user._id, fullName: user.fullName, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { id: user._id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'agrisecret', { expiresIn: '1d' });

        res.json({ token, user: { id: user._id, fullName: user.fullName, role: user.role } });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};
