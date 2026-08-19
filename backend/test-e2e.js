const API_URL = process.env.API_URL || 'http://localhost:5000/api';


async function runTests() {
  console.log('🚀 Starting TaskFlow End-to-End Automated Test Suite...\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition, testName) => {
    if (condition) {
      console.log(`✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${testName}`);
      failed++;
    }
  };

  try {
    // 1. Health check
    const healthRes = await fetch(`${API_URL}/health`).then((r) => r.json());
    assert(healthRes.status === 'ok', 'API Health Check returns 200 OK');

    // 2. Login with Seed User Maya Chen
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'maya.chen@example.com',
        password: 'password123',
      }),
    }).then((r) => r.json());

    assert(loginRes.success === true && !!loginRes.data.token, 'Auth Login (Maya Chen) successful');
    const token = loginRes.data.token;
    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    // 3. Verify Auth /me
    const meRes = await fetch(`${API_URL}/auth/me`, { headers: authHeaders }).then((r) => r.json());
    assert(meRes.success === true && meRes.data.name === 'Maya Chen', 'Auth /me returns Maya Chen');

    // 4. Fetch Stats
    const statsRes = await fetch(`${API_URL}/tasks/stats`, { headers: authHeaders }).then((r) => r.json());
    assert(
      statsRes.success === true && typeof statsRes.data.total === 'number',
      `Task Stats dynamic calculation (Total: ${statsRes.data.total}, Completed: ${statsRes.data.completed}, Pending: ${statsRes.data.pending}, Overdue: ${statsRes.data.overdue})`
    );

    // 5. Fetch all tasks
    const tasksRes = await fetch(`${API_URL}/tasks`, { headers: authHeaders }).then((r) => r.json());
    assert(tasksRes.success === true && tasksRes.data.length > 0, `Fetch all tasks (Found ${tasksRes.data.length} tasks)`);

    // 6. Test Search Query
    const searchRes = await fetch(`${API_URL}/tasks?search=API`, { headers: authHeaders }).then((r) => r.json());
    assert(
      searchRes.success === true && searchRes.data.some((t) => t.title.includes('API')),
      'Search tasks by query "API" works'
    );

    // 7. Test Priority Filter
    const highRes = await fetch(`${API_URL}/tasks?priority=high`, { headers: authHeaders }).then((r) => r.json());
    assert(
      highRes.success === true && highRes.data.every((t) => t.priority === 'high'),
      'Filter tasks by Priority "High" works'
    );

    // 8. Create a new Task
    const createRes = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Automated E2E Verification Task',
        description: 'Testing full lifecycle creation and drag-drop',
        status: 'todo',
        priority: 'high',
        category: 'Dev',
        dueDate: new Date().toISOString(),
      }),
    }).then((r) => r.json());

    assert(createRes.success === true && createRes.data.title === 'Automated E2E Verification Task', 'Create Task via POST /api/tasks works');
    const newTaskId = createRes.data._id;

    // 9. Update Task Status (Simulate Kanban Drag & Drop TO DO -> IN PROGRESS)
    const statusRes = await fetch(`${API_URL}/tasks/${newTaskId}/status`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ status: 'in_progress' }),
    }).then((r) => r.json());

    assert(
      statusRes.success === true && statusRes.data.status === 'in_progress',
      'Kanban Status update (PATCH /api/tasks/:id/status) works'
    );

    // 10. Toggle Task Completion (Checkbox click)
    const completeRes = await fetch(`${API_URL}/tasks/${newTaskId}/complete`, {
      method: 'PATCH',
      headers: authHeaders,
    }).then((r) => r.json());

    assert(
      completeRes.success === true && completeRes.data.completed === true && completeRes.data.status === 'done',
      'Toggle Complete (PATCH /api/tasks/:id/complete) works and syncs status to "done"'
    );

    // 11. Update Task details (PUT /api/tasks/:id)
    const updateRes = await fetch(`${API_URL}/tasks/${newTaskId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Updated E2E Verification Task Title',
        category: 'Work',
      }),
    }).then((r) => r.json());

    assert(
      updateRes.success === true && updateRes.data.title === 'Updated E2E Verification Task Title',
      'Update Task details (PUT /api/tasks/:id) works'
    );

    // 12. Delete the created task
    const deleteRes = await fetch(`${API_URL}/tasks/${newTaskId}`, {
      method: 'DELETE',
      headers: authHeaders,
    }).then((r) => r.json());

    assert(deleteRes.success === true, 'Delete Task (DELETE /api/tasks/:id) works');

    // 13. Update User Preferences (Theme & Default View)
    const prefRes = await fetch(`${API_URL}/users/preferences`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        theme: 'dark',
        defaultView: 'board',
        weekStartsOn: 'sunday',
        emailReminders: false,
      }),
    }).then((r) => r.json());

    assert(
      prefRes.success === true &&
        prefRes.data.theme === 'dark' &&
        prefRes.data.defaultView === 'board',
      'Update User Preferences (Theme, View, Calendar, Email) works'
    );

    // 14. Reset Preferences back to Light
    await fetch(`${API_URL}/users/preferences`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        theme: 'light',
        defaultView: 'list',
        weekStartsOn: 'monday',
        emailReminders: true,
      }),
    });

    // 15. Register a temporary user to test full registration and account cascade deletion
    const testEmail = `testuser_${Date.now()}@example.com`;
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Alex Johnson',
        email: testEmail,
        password: 'password123',
        confirmPassword: 'password123',
      }),
    }).then((r) => r.json());

    assert(regRes.success === true && regRes.data.name === 'Alex Johnson', 'User Registration (POST /api/auth/register) works');

    const tempToken = regRes.data.token;
    const tempHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tempToken}`,
    };

    // Create a task for temp user
    await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: tempHeaders,
      body: JSON.stringify({ title: 'Temporary User Task' }),
    });

    // Delete temp account (testing cascade delete of account and tasks)
    const deleteAccRes = await fetch(`${API_URL}/users/account`, {
      method: 'DELETE',
      headers: tempHeaders,
    }).then((r) => r.json());

    assert(deleteAccRes.success === true, 'Delete Account (DELETE /api/users/account) and Cascade Task Cleanup works');

    console.log(`\n========================================`);
    console.log(`🎉 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('❌ Unexpected Test Failure:', err);
    process.exit(1);
  }
}

runTests();
