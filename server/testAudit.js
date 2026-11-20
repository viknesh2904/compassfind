const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000';

const request = (method, urlPath, headers = {}, body = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: { ...headers }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        let parsed = data;
        try {
          parsed = JSON.parse(data);
        } catch (e) {}
        resolve({ status: res.statusCode, data: parsed });
      });
    });

    req.on('error', reject);

    if (body) {
      if (Buffer.isBuffer(body)) {
        req.write(body);
      } else if (typeof body === 'string') {
        req.write(body);
      } else {
        req.write(JSON.stringify(body));
      }
    }
    req.end();
  });
};

const runAudit = async () => {
  console.log('=====================================================');
  console.log('   CAMPUSFIND API CLEAN AUDIT & VALIDATION SUITE     ');
  console.log('=====================================================\n');

  let passed = 0;
  let failed = 0;

  const test = (name, condition, details = '') => {
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name} ${details}`);
      failed++;
    }
  };

  try {
    // 1. Root API Health Check
    const rootRes = await request('GET', '/');
    test('1. Root API Health Check (GET /)', rootRes.status === 200 && rootRes.data === 'API is running...');

    // 2. User Authentication (POST /api/users/login)
    const loginRes = await request('POST', '/api/users/login', { 'Content-Type': 'application/json' }, {
      rollNumber: 'student001',
      password: 'STUDENT001'
    });
    test('2. User Login (POST /api/users/login)', loginRes.status === 200 && loginRes.data.token && loginRes.data.rollNumber === 'student001');
    const token = loginRes.data.token;

    // 3. Invalid Credentials Error Handling
    const badLoginRes = await request('POST', '/api/users/login', { 'Content-Type': 'application/json' }, {
      rollNumber: 'student001',
      password: 'WRONGPASSWORD'
    });
    test('3. Invalid Login Rejection (401 Unauthorized)', badLoginRes.status === 401);

    // 4. Case-Insensitive Login Normalization
    const caseLoginRes = await request('POST', '/api/users/login', { 'Content-Type': 'application/json' }, {
      rollNumber: 'STUDENT001',
      password: 'STUDENT001'
    });
    test('4. Case-Insensitive Roll Number Login', caseLoginRes.status === 200 && caseLoginRes.data.token);

    // 5. Get Helped Stats (GET /api/users/stats)
    const statsRes = await request('GET', '/api/users/stats', { Authorization: `Bearer ${token}` });
    test(
      '5. Campus Stats Calculation (GET /api/users/stats)',
      statsRes.status === 200 && typeof statsRes.data.helpedUsers === 'number' && typeof statsRes.data.itemsRecovered === 'number',
      `Stats: helpedUsers=${statsRes.data?.helpedUsers}, itemsRecovered=${statsRes.data?.itemsRecovered}`
    );

    // 6. Missing Token Protection (401)
    const unauthStatsRes = await request('GET', '/api/users/stats');
    test('6. Route Protection Without JWT Token (401 Unauthorized)', unauthStatsRes.status === 401);

    // 7. Get All Items (GET /api/items)
    const allItemsRes = await request('GET', '/api/items', { Authorization: `Bearer ${token}` });
    test(
      '7. Fetch All Items Directory (GET /api/items)',
      allItemsRes.status === 200 && Array.isArray(allItemsRes.data) && allItemsRes.data.length > 0,
      `Total items count: ${allItemsRes.data?.length}`
    );

    // 8. Filter by Category (GET /api/items?category=lost)
    const lostItemsRes = await request('GET', '/api/items?category=lost', { Authorization: `Bearer ${token}` });
    const allLost = lostItemsRes.data.every(i => i.category === 'lost');
    test('8. Filter Items by Category (category=lost)', lostItemsRes.status === 200 && allLost && lostItemsRes.data.length > 0);

    // 9. Filter by Status (GET /api/items?status=open)
    const openItemsRes = await request('GET', '/api/items?status=open', { Authorization: `Bearer ${token}` });
    const allOpen = openItemsRes.data.every(i => i.status === 'open');
    test('9. Filter Items by Status (status=open)', openItemsRes.status === 200 && allOpen && openItemsRes.data.length > 0);

    // 10. Search Items by Keyword (GET /api/items?search=Library)
    const searchRes = await request('GET', '/api/items?search=Library', { Authorization: `Bearer ${token}` });
    test('10. Search Items by Keyword (search=Library)', searchRes.status === 200 && searchRes.data.length > 0);

    // 11. Get Single Item by ID (GET /api/items/:id)
    const sampleItem = allItemsRes.data[0];
    const singleItemRes = await request('GET', `/api/items/${sampleItem._id}`, { Authorization: `Bearer ${token}` });
    test('11. Get Single Item by ID (GET /api/items/:id)', singleItemRes.status === 200 && singleItemRes.data._id === sampleItem._id);

    // 12. Invalid Item ID Cast Error Handling (400)
    const badIdRes = await request('GET', '/api/items/invalid-object-id', { Authorization: `Bearer ${token}` });
    test('12. Invalid ObjectId Cast Error Handling (400)', badIdRes.status === 400);

    // 13. Create New Item with Multipart File Upload (POST /api/items)
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const sampleImgPath = path.join(__dirname, 'test-sample.png');
    // 1x1 transparent PNG buffer
    const pngBuffer = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2d450000000049454e44ae426082', 'hex');

    const multipartBody = Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="itemName"\r\n\r\nAudit Test Belonging\r\n`),
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="description"\r\n\r\nVerified during automated audit check\r\n`),
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="location"\r\n\r\nAudit Testing Lab\r\n`),
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="category"\r\n\r\nlost\r\n`),
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="contactInfo"\r\n\r\n{"email":"student001@campus.edu","phone":"+91 99999 00000"}\r\n`),
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="photo"; filename="audit-test.png"\r\nContent-Type: image/png\r\n\r\n`),
      pngBuffer,
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);

    const createRes = await request('POST', '/api/items', {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`
    }, multipartBody);

    test('13. Create Item with Image Upload (POST /api/items)', createRes.status === 201 && createRes.data._id && createRes.data.photo);
    const createdItemId = createRes.data?._id;

    // 14. Update Item Status by Reporter (PUT /api/items/:id/status)
    if (createdItemId) {
      const updateRes = await request('PUT', `/api/items/${createdItemId}/status`, {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }, { status: 'returned' });
      test('14. Mark Item as Returned by Reporter (PUT /api/items/:id/status)', updateRes.status === 200 && updateRes.data.status === 'returned');
    }

    // 15. Authorization Check: Non-reporter cannot update item status (403)
    if (createdItemId) {
      const student2Login = await request('POST', '/api/users/login', { 'Content-Type': 'application/json' }, {
        rollNumber: 'student002',
        password: 'STUDENT002'
      });
      const student2Token = student2Login.data.token;

      const forbiddenRes = await request('PUT', `/api/items/${createdItemId}/status`, {
        Authorization: `Bearer ${student2Token}`,
        'Content-Type': 'application/json'
      }, { status: 'returned' });
      test('15. Prevent Non-Reporter Status Tampering (403 Forbidden)', forbiddenRes.status === 403);
    }

    // 16. User Registration (POST /api/users/register)
    const testRoll = `audituser${Date.now().toString().slice(-4)}`;
    const registerRes = await request('POST', '/api/users/register', { 'Content-Type': 'application/json' }, {
      rollNumber: testRoll
    });
    test('16. New User Registration (POST /api/users/register)', registerRes.status === 201 && registerRes.data.rollNumber === testRoll && registerRes.data.token);

    // 17. Duplicate User Registration Rejection (400)
    const dupRegisterRes = await request('POST', '/api/users/register', { 'Content-Type': 'application/json' }, {
      rollNumber: testRoll
    });
    test('17. Duplicate User Registration Rejection (400 Bad Request)', dupRegisterRes.status === 400);

    console.log('\n=====================================================');
    console.log(`AUDIT RESULTS: ${passed} PASSED | ${failed} FAILED`);
    console.log('=====================================================\n');

    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Audit execution error:', err);
    process.exit(1);
  }
};

runAudit();
