-- Database Schema Analysis for ERP Database
USE ERP;

-- Check all tables in the database
SELECT 'TABLES IN DATABASE:' as Info;
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE';

-- Check users table structure
SELECT 'USERS TABLE COLUMNS:' as Info;
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'users' 
ORDER BY ORDINAL_POSITION;

-- Check patients table structure
SELECT 'PATIENTS TABLE COLUMNS:' as Info;
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'patients' 
ORDER BY ORDINAL_POSITION;

-- Check for missing required columns in users table
SELECT 'MISSING COLUMNS CHECK:' as Info;
SELECT 'users table missing full_Name column' as Issue 
WHERE NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'full_Name')
UNION ALL
SELECT 'users table missing gender column' as Issue 
WHERE NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'gender')
UNION ALL
SELECT 'users table missing DOB column' as Issue 
WHERE NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'DOB')
UNION ALL
SELECT 'users table missing marital_status column' as Issue 
WHERE NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'marital_status')
UNION ALL
SELECT 'users table missing Address column' as Issue 
WHERE NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'Address')
UNION ALL
SELECT 'patients table missing user_id column' as Issue 
WHERE NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'patients' AND COLUMN_NAME = 'user_id')
UNION ALL
SELECT 'patients table missing blood_group column' as Issue 
WHERE NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'patients' AND COLUMN_NAME = 'blood_group')
UNION ALL
SELECT 'patients table missing BMI column' as Issue 
WHERE NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'patients' AND COLUMN_NAME = 'BMI')
UNION ALL
SELECT 'patients table missing NOTES column' as Issue 
WHERE NOT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'patients' AND COLUMN_NAME = 'NOTES');

-- Check foreign key constraints
SELECT 'FOREIGN KEY CONSTRAINTS:' as Info;
SELECT 
    fk.name AS ForeignKeyName,
    tp.name AS ParentTable,
    cp.name AS ParentColumn,
    tr.name AS ReferencedTable,
    cr.name AS ReferencedColumn
FROM sys.foreign_keys fk
INNER JOIN sys.tables tp ON fk.parent_object_id = tp.object_id
INNER JOIN sys.tables tr ON fk.referenced_object_id = tr.object_id
INNER JOIN sys.foreign_key_columns fkc ON fkc.constraint_object_id = fk.object_id
INNER JOIN sys.columns cp ON fkc.parent_column_id = cp.column_id AND fkc.parent_object_id = cp.object_id
INNER JOIN sys.columns cr ON fkc.referenced_column_id = cr.column_id AND fkc.referenced_object_id = cr.object_id
WHERE tp.name IN ('users', 'patients') OR tr.name IN ('users', 'patients');

-- Check sample data
SELECT 'SAMPLE DATA:' as Info;
SELECT TOP 3 * FROM users;
SELECT TOP 3 * FROM patients;