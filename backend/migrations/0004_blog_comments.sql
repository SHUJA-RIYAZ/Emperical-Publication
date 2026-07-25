-- Blog comments with admin moderation.
-- depends: 0003_user_accounts

CREATE TABLE comments (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    post_id    INT          NOT NULL,
    user_id    INT          NULL,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255) NOT NULL DEFAULT '',
    body       TEXT         NOT NULL,
    status     VARCHAR(16)  NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_comments_post_status (post_id, status),
    CONSTRAINT chk_comments_status CHECK (status IN ('pending', 'approved', 'spam')),
    CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES blog_posts (id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
