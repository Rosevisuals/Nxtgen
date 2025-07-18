console.log("USING MOCK DB.JS");
// __mocks__/db.js - Mock for SQL Server pool, used in Jest tests

// In-memory mock user data
let mockUsers = [
  {
    user_id: 1,
    full_Name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    password_hash: "$2b$10$testhash",
    gender: "Male",
    DOB: "1990-01-01",
    marital_status: "Single",
    Address: "123 Main St",
    status: "Active",
    created_at: "2023-01-01T00:00:00Z"
  }
];
let nextUserId = 2;

// In-memory mock roles data
let mockRoles = [
  { role_id: 1, role_name: 'Admin', description: 'System Administrator' },
  { role_id: 2, role_name: 'Doctor', description: 'Medical practitioner' },
  { role_id: 3, role_name: 'Nurse', description: 'Assists doctors and cares for patients' }
];

// Helper to extract user_id from params or SQL string
function parseUserIdFromParamsOrSql(params, sql) {
  if (params && params.user_id) return parseInt(params.user_id, 10);
  const match = sql && sql.match(/user_id\s*=\s*(?:@user_id|(\d+))/i);
  if (match && match[1]) return parseInt(match[1], 10);
  return null;
}

const pool = {
  request: function () {
    let params = {};
    return {
      // Support both (key, value) and (key, type, value)
      input: function (key, _type, value) {
        if (arguments.length === 2) value = _type;
        params[key] = value;
        return this;
      },
      query: async function (sql) {
        sql = sql.trim();
        // Multi-statement: Insert + Select (return full user)
        if (/insert into users/i.test(sql) && /select scope_identity\(\)/i.test(sql) && /select \* from users where user_id/i.test(sql)) {
          const newUser = {
            user_id: nextUserId++,
            full_Name: params.full_Name,
            email: params.email,
            phone: params.phone,
            password_hash: params.password_hash,
            gender: params.gender,
            DOB: params.DOB,
            marital_status: params.marital_status,
            Address: params.Address,
            status: params.status,
            created_at: params.created_at instanceof Date ? params.created_at.toISOString() : params.created_at
          };
          mockUsers.push(newUser);
          return { recordset: [newUser] };
        }
        // Multi-statement: Update + Select (return updated user)
        if (/update users set/i.test(sql) && /select \* from users where user_id/i.test(sql)) {
          const id = parseUserIdFromParamsOrSql(params, sql);
          let user = mockUsers.find(u => u.user_id === id);
          if (user) {
            Object.assign(user, params);
            return { recordset: [user] };
          } else {
            return { recordset: [] };
          }
        }
        // Select all users
        if (/^select \* from users$/i.test(sql)) {
          return { recordset: mockUsers };
        }
        // Select user by ID
        if (/select \* from users where user_id/i.test(sql)) {
          const id = parseUserIdFromParamsOrSql(params, sql);
          const user = mockUsers.find(u => u.user_id === id);
          return { recordset: user ? [user] : [] };
        }
        // Select user by email
        if (/select \* from users where email/i.test(sql)) {
          const email = params.email;
          const user = mockUsers.find(u => u.email === email);
          return { recordset: user ? [user] : [] };
        }
        // Single-statement insert (return user_id only)
        if (/insert into users/i.test(sql) && /scope_identity/i.test(sql)) {
          const newUser = {
            user_id: nextUserId++,
            full_Name: params.full_Name,
            email: params.email,
            phone: params.phone,
            password_hash: params.password_hash,
            gender: params.gender,
            DOB: params.DOB,
            marital_status: params.marital_status,
            Address: params.Address,
            status: params.status,
            created_at: params.created_at instanceof Date ? params.created_at.toISOString() : params.created_at
          };
          mockUsers.push(newUser);
          return { recordset: [{ user_id: newUser.user_id }] };
        }
        // Delete user
        if (/delete from users where user_id/i.test(sql)) {
          const id = parseUserIdFromParamsOrSql(params, sql);
          mockUsers = mockUsers.filter(u => u.user_id !== id);
          return { recordset: [] };
        }
        // --- ROLES MOCK LOGIC ---
        // Select all roles
        if (/^select \* from roles$/i.test(sql)) {
          return { recordset: mockRoles };
        }
        // Select role by ID
        if (/select \* from roles where role_id/i.test(sql)) {
          const id = params.role_id;
          const role = mockRoles.find(r => r.role_id === id);
          return { recordset: role ? [role] : [] };
        }
        // Fallback: return all users
        return { recordset: mockUsers };
      }
    };
  },
  // For direct pool.query usage
  query: async (sql) => {
    return { recordset: mockUsers };
  }
};

// Dummy sql and poolConnect for compatibility
const sql = {
  VarChar: () => {},
  Int: () => {},
  Date: () => {},
  DateTime: () => {},
};
const poolConnect = Promise.resolve();

module.exports = { pool, sql, poolConnect }; 