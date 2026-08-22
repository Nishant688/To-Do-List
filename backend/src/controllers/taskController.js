import { Task } from '../models/Task.js';

const getDayBounds = (date = new Date()) => {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(date);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

export const getTasks = async (req, res, next) => {
  try {
    const {
      status,
      priority,
      category,
      search,
      view, 
      sort = 'dueDate',
      order = 'asc',
    } = req.query;

    const query = { userId: req.user._id };

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

    if (priority && priority !== 'all' && priority !== 'All priorities') {
      query.priority = priority.toLowerCase();
    }

    if (category && category !== 'all') {
      query.category = new RegExp(`^${category}$`, 'i');
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$and = query.$and || [];
      query.$and.push({
        $or: [{ title: searchRegex }, { description: searchRegex }],
      });
    }

    const now = new Date();
    const { start: todayStart, end: todayEnd } = getDayBounds(now);

    if (view === 'today') {

      query.$or = [
        { dueDate: { $gte: todayStart, $lte: todayEnd } },
        { dueDate: { $lt: todayStart }, completed: false },
      ];
    } else if (view === 'dueSoon') {

      const nextWeekEnd = new Date(todayEnd);
      nextWeekEnd.setDate(nextWeekEnd.getDate() + 7);
      query.dueDate = { $gt: todayEnd, $lte: nextWeekEnd };
    }

    let sortOptions = {};
    const sortDirection = order === 'desc' ? -1 : 1;

    switch (sort) {
      case 'dueDate':
        sortOptions = { dueDate: sortDirection, createdAt: -1 };
        break;
      case 'priority': {

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

export const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const { start: todayStart, end: todayEnd } = getDayBounds(now);

    const sevenDaysLater = new Date(todayEnd);
    sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);

    const [
      total,
      completed,
      pending,
      overdue,
      dueToday,
      dueSoon,
    ] = await Promise.all([

      Task.countDocuments({ userId }),

      Task.countDocuments({
        userId,
        $or: [{ completed: true }, { status: 'done' }],
      }),

      Task.countDocuments({
        userId,
        completed: false,
        status: { $ne: 'done' },
      }),

      Task.countDocuments({
        userId,
        dueDate: { $lt: todayStart, $ne: null },
        completed: false,
        status: { $ne: 'done' },
      }),

      Task.countDocuments({
        userId,
        $or: [
          { dueDate: { $gte: todayStart, $lte: todayEnd } },
          { dueDate: { $lt: todayStart, $ne: null }, completed: false },
        ],
      }),

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
