-- V20260304__add_admin_fields.sql
ALTER TABLE projects ADD COLUMN admin_notes TEXT;
ALTER TABLE projects ADD COLUMN suspension_deadline DATETIME;
ALTER TABLE users ADD COLUMN admin_notes TEXT;
