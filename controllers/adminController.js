import User from '../models/User.js';

export const listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const validateAgency = async (req, res) => {
  const { id } = req.params;
  const { isValidated } = req.body;

  try {
    const user = await User.findById(id).select('-password');

    if (!user || user.role !== 'agency') {
      return res.status(404).json({ message: 'Agency not found' });
    }

    user.isValidated = Boolean(isValidated);
    await user.save();

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
