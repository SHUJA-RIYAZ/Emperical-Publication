-- Author portal: user accounts, password resets, synced wishlists,
-- account-linked submissions, and stored manuscript files.
-- depends: 0002_site_settings

-- Registrations must never default to an admin role.
ALTER TABLE users
    ALTER COLUMN role SET DEFAULT 'user';

ALTER TABLE users
    ADD COLUMN phone       VARCHAR(64)  NOT NULL DEFAULT '' AFTER full_name,
    ADD COLUMN affiliation VARCHAR(255) NOT NULL DEFAULT '' AFTER phone,
    ADD COLUMN country     VARCHAR(120) NOT NULL DEFAULT '' AFTER affiliation;

CREATE TABLE password_reset_tokens (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    user_id    INT         NOT NULL,
    token_hash CHAR(64)    NOT NULL UNIQUE,
    expires_at TIMESTAMP   NOT NULL,
    used_at    TIMESTAMP   NULL,
    created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_reset_tokens_user (user_id),
    CONSTRAINT fk_reset_tokens_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE wishlist_items (
    user_id    INT       NOT NULL,
    book_id    INT       NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, book_id),
    INDEX idx_wishlist_book (book_id),
    CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_wishlist_book FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Link submissions to an account (NULL = guest submission) and keep the
-- stored path of the uploaded manuscript alongside its original filename.
ALTER TABLE publishing_requests
    ADD COLUMN user_id              INT          NULL AFTER reference_id,
    ADD COLUMN manuscript_file_path VARCHAR(500) NULL AFTER manuscript_file_name,
    ADD COLUMN manuscript_file_size INT          NULL AFTER manuscript_file_path,
    ADD COLUMN reviewer_notes       TEXT         NULL AFTER status,
    ADD INDEX idx_publishing_requests_user (user_id),
    ADD CONSTRAINT fk_publishing_requests_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL;
