const staffModel = require('../../models/staffModel');

const STAFF_ID = 1;

describe('createStaff should', () => {
    test('return a new staff record with a database generated staff_id', async () => {
        const staff = {
            user_id: 1,
            specialization: 'Cardiology',
            biodata: 'Height 180;',
            head_department: false,
            license_number: 'LIN-001',
            role_id: 2,
            department_id: 1,
            created_at: new Date().toISOString()
        };

        const result = await staffModel.createStaff(staff);
        expect(result).toHaveProperty('staff_id');
    });
});

describe('deleteStaff should', () => {
    test('remove staff record with provided staff_id if record is found', async () => {
        await staffModel.deleteStaff(STAFF_ID);
        const staff = staffModel.getStaffById(STAFF_ID);
        expect(staff).toBeUnDefined;
    });
});

describe('getAllStaff should', () => {
    test('return an array of staff', async () => {
        const staff = await staffModel.getAllStaff();
        expect(Array.isArray(staff)).toBe(true);
    });
});

describe('getStaffById should', () => {
    test('return a staff record with provided staff_id if record is found', async () => {
        const staff = await staffModel.getStaffById(STAFF_ID);
        expect(staff).toBeDefined();
        expect(staff.staff_id).toBe(STAFF_ID);
    });
});