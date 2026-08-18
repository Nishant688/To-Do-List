import { User } from '../models/User.js';
import { Task } from '../models/Task.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile (name, email, avatar)
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const { name, email, avatar } = req.body;

    if (name) user.name = name.trim();
    if (email && email.toLowerCase().trim() !== user.email) {
      // Check if email already taken
      const emailExists = await User.findOne({
        email: email.toLowerCase().trim(),
        _id: { $ne: user._id },
      });
      if (emailExists) {
        res.status(400);
        throw new Error('Email is already registered to another account');
      }
      user.email = email.toLowerCase().trim();
    }
    if (avatar !== undefined) user.avatar = avatar;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
export const updateUserPassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error('Please provide current password and new password');
    }

    if (confirmNewPassword !== undefined && newPassword !== confirmNewPassword) {
      res.status(400);
      throw new Error('New passwords do not match');
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error('New password must be at least 6 characters');
    }

    // Get user with password
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      res.status(400);
      throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user preferences (theme, defaultView, weekStartsOn, emailReminders)
// @route   PUT /api/users/preferences
// @access  Private
export const updateUserPreferences = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const { theme, defaultView, weekStartsOn, emailReminders } = req.body;

    user.preferences = {
      theme: theme || user.preferences.theme || 'light',
      defaultView: defaultView || user.preferences.defaultView || 'list',
      weekStartsOn: weekStartsOn || user.preferences.weekStartsOn || 'monday',
      emailReminders:
        emailReminders !== undefined
          ? Boolean(emailReminders)
          : user.preferences.emailReminders ?? true,
    };

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      data: updatedUser.preferences,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account and all associated tasks
// @route   DELETE /api/users/account
// @access  Private
export const deleteUserAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Delete all tasks belonging to user
    await Task.deleteMany({ userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Account and associated data deleted permanently',
    });
  } catch (error) {
    next(error);
  }
};
