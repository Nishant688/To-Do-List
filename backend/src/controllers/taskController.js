import { Task } from '../models/Task.js';

// Helper to get start and end of a given date (local)
const getDayBounds = (date = new Date()) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

// @desc    Get all tasks for the logged in user with filtering, search, and sorting
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const {
      status,
      priority,
      category,
      search,
      view, // 'today', 'dueSoon', 'all'
      sort = 'dueDate',
      order = 'asc',
    } = req.query;

    const query = { userId: req.user._id };

    // Status filter
    if (status) {
      if (status === 'active') {
        query.completed = false;
        query.status = { $ne: 'done' };
      } else if (status === 'completed') {
        query.$or = [{ completed: true }, { status: 'done' }];
      } else if (['todo', 'in_progress', 'done'].includes(status)) {
        query.status = status;
      }
    }

    // Priority filter
    if (priority && priority !== 'all' && priority !== 'All priorities') {
      query.priority = priority.toLowerCase();
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = new RegExp(`^${category}$`, 'i');
    }

    // Search query (title and description)
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$and = query.$and || [];
      query.$and.push({
        $or: [{ title: searchRegex }, { description: searchRegex }],
      });
    }

    // View specific filter
    const now = new Date();
    const { start: todayStart, end: todayEnd } = getDayBounds(now);

    if (view === 'today') {
      // Due today OR overdue and incomplete
      query.$or = [
        { dueDate: { $gte: todayStart, $lte: todayEnd } },
        { dueDate: { $lt: todayStart }, completed: false },
      ];
    } else if (view === 'dueSoon') {
      // Due tomorrow and onwards (next 7 days)
      const nextWeekEnd = new Date(todayEnd);
      nextWeekEnd.setDate(nextWeekEnd.getDate() + 7);
      query.dueDate = { $gt: todayEnd, $lte: nextWeekEnd };
    }

    // Sorting
    let sortOptions = {};
    const sortDirection = order === 'desc' ? -1 : 1;

    switch (sort) {
      case 'dueDate':
        sortOptions = { dueDate: sortDirection, createdAt: -1 };
        break;
      case 'priority': {
        // High -> Medium -> Low or vice versa
        sortOptions = { priority: sortDirection, dueDate: 1 };
        break;
      }
      case 'title':
      case 'name':
        sortOptions = { title: sortDirection };
        break;
      case 'createdAt':
      case 'created':
        sortOptions = { createdAt: sortDirection };
        break;
      case 'order':
        sortOptions = { order: 1, createdAt: -1 };
        break;
      default:
        sortOptions = { dueDate: 1, createdAt: -1 };
    }

    const tasks = await Task.find(query).sort(sortOptions);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics / task stats for logged-in user
// @route   GET /api/tasks/stats
// @access  Private
export const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const { start: todayStart, end: todayEnd } = getDayBounds(now);

    const sevenDaysLater = new Date(todayEnd);
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    // Run parallel aggregation / count queries
    const [
      total,
      completed,
      pending,
      overdue,
      dueToday,
      dueSoon,
    ] = await Promise.all([
      // Total tasks
      Task.countDocuments({ userId }),
      // Completed tasks
      Task.countDocuments({
        userId,
        $or: [{ completed: true }, { status: 'done' }],
      }),
      // Pending tasks
      Task.countDocuments({
        userId,
        completed: false,
        status: { $ne: 'done' },
      }),
      // Overdue tasks (due date before today, and not completed)
      Task.countDocuments({
        userId,
        dueDate: { $lt: todayStart, $ne: null },
        completed: false,
        status: { $ne: 'done' },
      }),
      // Tasks due today (due date today, or overdue and incomplete)
      Task.countDocuments({
        userId,
        $or: [
          { dueDate: { $gte: todayStart, $lte: todayEnd } },
          { dueDate: { $lt: todayStart, $ne: null }, completed: false },
        ],
      }),
      // Tasks due soon (next 7 days)
      Task.countDocuments({
        userId,
        dueDate: { $gt: todayEnd, $lte: sevenDaysLater },
        completed: false,
        status: { $ne: 'done' },
      }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        pending,
        overdue,
        dueToday,
        dueSoon,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, category, dueDate, completed, order } =
      req.body;

    if (!title || !title.trim()) {
      res.status(400);
      throw new Error('Task title is required');
    }

    const taskStatus = status || 'todo';
    const isCompleted = completed !== undefined ? completed : taskStatus === 'done';

    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      status: taskStatus,
      priority: priority || 'medium',
      category: category || 'Work',
      dueDate: dueDate ? new Date(dueDate) : null,
      completed: isCompleted,
      order: order !== undefined ? order : 0,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    const { title, description, status, priority, category, dueDate, completed, order } =
      req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status !== undefined) {
      task.status = status;
      task.completed = status === 'done';
    }
    if (priority !== undefined) task.priority = priority;
    if (category !== undefined) task.category = category;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (completed !== undefined) {
      task.completed = completed;
      if (completed && task.status !== 'done') task.status = 'done';
      if (!completed && task.status === 'done') task.status = 'todo';
    }
    if (order !== undefined) task.order = order;

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status (e.g. for drag and drop Kanban)
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status, order } = req.body;

    if (!status || !['todo', 'in_progress', 'done'].includes(status)) {
      res.status(400);
      throw new Error('Invalid status. Must be todo, in_progress, or done');
    }

    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    task.status = status;
    task.completed = status === 'done';
    if (order !== undefined) {
      task.order = order;
    }

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: `Task moved to ${status}`,
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle task completion status
// @route   PATCH /api/tasks/:id/complete
// @access  Private
export const toggleTaskComplete = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    task.completed = !task.completed;
    task.status = task.completed ? 'done' : 'todo';

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: task.completed ? 'Task marked as completed' : 'Task marked as active',
      data: updatedTask,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};
