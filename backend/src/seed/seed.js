import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Task } from '../models/Task.js';

const seedDatabase = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      process.env.MONGO_URI ||
      'mongodb://127.0.0.1:27017/taskflow';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    // Clean up existing data for clean demo
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log('[Seed] Cleared existing Users and Tasks');

    // Create Demo User Maya Chen
    const maya = await User.create({
      name: 'Maya Chen',
      email: 'maya.chen@example.com',
      password: 'password123',
      avatar: '',
      plan: 'Free plan',
      preferences: {
        theme: 'light',
        defaultView: 'list',
        weekStartsOn: 'monday',
        emailReminders: true,
      },
    });
    console.log(`[Seed] Created User: ${maya.name} (${maya.email})`);

    // Reference dates based on current day
    const now = new Date();
    const getDateWithOffset = (offsetDays, hours = 17, minutes = 0) => {
      const d = new Date(now);
      d.setDate(d.getDate() + offsetDays);
      d.setHours(hours, minutes, 0, 0);
      return d;
    };

    // Realistic tasks matching reference design screenshots
    const sampleTasks = [
      {
        title: 'Fix mobile nav overflow bug',
        description: 'Menu clips behind the navigation bar on small devices',
        status: 'in_progress',
        priority: 'high',
        category: 'Dev',
        dueDate: getDateWithOffset(-3, 14, 0), // 3 days overdue
        completed: false,
        order: 1,
        userId: maya._id,
      },
      {
        title: 'Finalize Q3 launch checklist',
        description: 'Confirm owners for each deliverable and review timeline',
        status: 'in_progress',
        priority: 'high',
        category: 'Work',
        dueDate: getDateWithOffset(-1, 16, 0), // 1 day overdue
        completed: false,
        order: 2,
        userId: maya._id,
      },
      {
        title: 'Reply to Priya about API contract',
        description: 'She needs the OpenAPI specifications for the user service',
        status: 'todo',
        priority: 'high',
        category: 'Work',
        dueDate: getDateWithOffset(0, 15, 0), // Today
        completed: false,
        order: 3,
        userId: maya._id,
      },
      {
        title: 'Review pull request #142',
        description: 'Auth middleware improvements and token refresh handling',
        status: 'in_progress',
        priority: 'medium',
        category: 'Dev',
        dueDate: getDateWithOffset(0, 18, 0), // Today
        completed: false,
        order: 4,
        userId: maya._id,
      },
      {
        title: 'Write onboarding email draft',
        description: 'Welcome sequence for new workspace signups',
        status: 'todo',
        priority: 'medium',
        category: 'Work',
        dueDate: getDateWithOffset(0, 17, 30), // Today
        completed: false,
        order: 5,
        userId: maya._id,
      },
      {
        title: 'Prep slides for team sync',
        description: 'Three slides max: highlights, blockers, next steps',
        status: 'todo',
        priority: 'medium',
        category: 'Work',
        dueDate: getDateWithOffset(1, 10, 0), // Tomorrow
        completed: false,
        order: 6,
        userId: maya._id,
      },
      {
        title: 'Renew gym membership',
        description: 'Annual plan renewal before weekend pricing changes',
        status: 'todo',
        priority: 'low',
        category: 'Personal',
        dueDate: getDateWithOffset(2, 19, 0), // +2 days
        completed: false,
        order: 7,
        userId: maya._id,
      },
      {
        title: 'Draft design-review agenda',
        description: 'Cover typography changes and new color token system',
        status: 'todo',
        priority: 'medium',
        category: 'Design',
        dueDate: getDateWithOffset(3, 11, 0), // +3 days
        completed: false,
        order: 8,
        userId: maya._id,
      },
      {
        title: 'Sketch empty-state illustrations',
        description: 'Rough concepts for zero-inbox and empty dashboard',
        status: 'todo',
        priority: 'low',
        category: 'Design',
        dueDate: getDateWithOffset(4, 14, 0), // +4 days
        completed: false,
        order: 9,
        userId: maya._id,
      },
      {
        title: 'Pay quarterly expenses',
        description: 'Process invoices and reconcile software subscriptions',
        status: 'todo',
        priority: 'high',
        category: 'Personal',
        dueDate: getDateWithOffset(6, 16, 0), // +6 days
        completed: false,
        order: 10,
        userId: maya._id,
      },
      {
        title: 'Book dentist appointment',
        description: 'Dr. Alvarez, any weekday afternoon',
        status: 'done',
        priority: 'low',
        category: 'Personal',
        dueDate: getDateWithOffset(0, 11, 0), // Today
        completed: true,
        order: 11,
        userId: maya._id,
      },
      {
        title: 'Update dependency lockfile',
        description: 'Bump minor versions, run end-to-end regression tests',
        status: 'done',
        priority: 'low',
        category: 'Dev',
        dueDate: getDateWithOffset(5, 12, 0), // +5 days
        completed: true,
        order: 12,
        userId: maya._id,
      },
    ];

    await Task.insertMany(sampleTasks);
    console.log(`[Seed] Seeded ${sampleTasks.length} realistic tasks successfully!`);

    await mongoose.disconnect();
    console.log('[Seed] Database seeding complete and connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedDatabase();
