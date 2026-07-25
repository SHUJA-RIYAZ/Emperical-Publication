ALTER TABLE publishing_requests
    DROP FOREIGN KEY fk_publishing_requests_user;

ALTER TABLE publishing_requests
    DROP INDEX idx_publishing_requests_user,
    DROP COLUMN reviewer_notes,
    DROP COLUMN manuscript_file_size,
    DROP COLUMN manuscript_file_path,
    DROP COLUMN user_id;

DROP TABLE IF EXISTS wishlist_items;
DROP TABLE IF EXISTS password_reset_tokens;

ALTER TABLE users
    DROP COLUMN country,
    DROP COLUMN affiliation,
    DROP COLUMN phone;

ALTER TABLE users
    ALTER COLUMN role SET DEFAULT 'admin';
