-- SQL script to alter the orders table status column from smallint to varchar
ALTER TABLE orders ALTER COLUMN status TYPE varchar(20);

