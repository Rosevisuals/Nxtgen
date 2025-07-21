const mockStaff = [
    {
        staff_id: 1,
        user_id: 1,
        specialization: "DOCTOR",
        biodata: "Height 180;Weight 85;Heart rate 72;",
        head_department: false,
        license_number: "DOCTOR-001",
        role_id: 2,
        department_id: 1,
        created_at: "2023-01-01T00:00:00Z"
    }
];

const sql = {
    VarChar: () => { },
    Int: () => { },
    Date: () => { },
    DateTime: () => { },
};

const poolConnect = Promise.resolve();

let nextStaffId = 2;

const pool = {
    request: function () {
        let params = {};

        return {
            input: function (key, _type, value) {
                if (arguments.length === 2) value = _type;
                params[key] = value;
                return this;
            },
            query: async function (sql) {
                sql = sql.trim();

                if (/delete from staff where staff_id/i.test(sql)) {
                    const id = parseStaffIdFromParamsOrSql(params, sql);

                    return { recordset: mockStaff.filter(u => u.staff_id !== id) };
                }

                if (/insert into staff/i.test(sql) && /scope_identity/i.test(sql)) {
                    const staff = {
                        staff_id: nextStaffId++,
                        user_id: params.user_id,
                        specialization: params.specialization,
                        biodata: params.biodata,
                        head_department: params.head_department,
                        license_number: params.license_number,
                        role_id: params.gender,
                        department_id: params.role_id,
                        created_at: params.created_at instanceof Date ? params.created_at.toISOString() : params.created_at
                    };
                    mockStaff.push(staff);
                    return { recordset: [{ staff_id: staff.staff_id }] };
                }

                if (/^select \* from staff$/i.test(sql)) {
                    return { recordset: mockStaff };
                }

                if (/select \* from staff where staff_id/i.test(sql)) {
                    const id = parseStaffIdFromParamsOrSql(params, sql);
                    const staff = mockStaff.find(u => u.staff_id === id);
                    return { recordset: staff ? [staff] : [] };
                }

                if (/select \* from staff where user_id/i.test(sql)) {
                    const user_id = params.user_id;
                    const staff = mockUsers.find(u => u.user_id === user_id);
                    return { recordset: staff ? [staff] : [] };
                }

                if (/update staff set/i.test(sql) && /select \* from staff where staff_id/i.test(sql)) {
                    const id = parseStaffIdFromParamsOrSql(params, sql);
                    let staff = mockUsers.find(u => u.staff_id === id);
                    if (staff) {
                        Object.assign(staff, params);
                        return { recordset: [staff] };
                    } else {
                        return { recordset: [] };
                    }
                }

                return { recordset: mockStaff };
            }
        };
    },
    query: async (sql) => {
        return { recordset: mockStaff };
    }
};

function parseStaffIdFromParamsOrSql(params, sql) {
    if (params && params.staff_id) return parseInt(params.staff_id, 10);

    const match = sql && sql.match(/staff_id\s*=\s*(?:@staff_id|(\d+))/i);
    if (match && match[1]) return parseInt(match[1], 10);

    return null;
}

module.exports = { pool, sql, poolConnect }; 