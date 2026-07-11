-- Initial schema for Emperical International Publication (MySQL 8+)
-- depends:

CREATE TABLE users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name     VARCHAR(255) NOT NULL,
    role          VARCHAR(32)  NOT NULL DEFAULT 'admin',
    is_active     BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE authors (
    id                 INT AUTO_INCREMENT PRIMARY KEY,
    slug               VARCHAR(255) NOT NULL UNIQUE,
    name               VARCHAR(255) NOT NULL,
    title              VARCHAR(255) NOT NULL DEFAULT '',
    institution        VARCHAR(255) NOT NULL DEFAULT '',
    department         VARCHAR(255) NOT NULL DEFAULT '',
    country            VARCHAR(120) NOT NULL DEFAULT '',
    bio                TEXT         NOT NULL,
    email              VARCHAR(255) NOT NULL DEFAULT '',
    research_interests JSON         NOT NULL,
    publications       JSON         NOT NULL,
    social             JSON         NOT NULL,
    h_index            INT          NOT NULL DEFAULT 0,
    citations          INT          NOT NULL DEFAULT 0,
    books_published    INT          NOT NULL DEFAULT 0,
    featured           BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_authors_country (country),
    INDEX idx_authors_featured (featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE books (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    slug             VARCHAR(255)  NOT NULL UNIQUE,
    title            VARCHAR(500)  NOT NULL,
    subtitle         VARCHAR(500),
    description      TEXT          NOT NULL,
    category         VARCHAR(120)  NOT NULL,
    language         VARCHAR(60)   NOT NULL DEFAULT 'English',
    publication_year INT           NOT NULL,
    publication_date DATE          NOT NULL,
    isbn             VARCHAR(32)   NOT NULL DEFAULT '',
    pages            INT           NOT NULL DEFAULT 0,
    price            DECIMAL(8, 2) NOT NULL DEFAULT 0,
    formats          JSON          NOT NULL,
    rating           DECIMAL(2, 1) NOT NULL DEFAULT 0,
    reviews_count    INT           NOT NULL DEFAULT 0,
    tags             JSON          NOT NULL,
    featured         BOOLEAN       NOT NULL DEFAULT FALSE,
    bestseller       BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_books_category (category),
    INDEX idx_books_language (language),
    INDEX idx_books_year (publication_year),
    INDEX idx_books_featured (featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE book_authors (
    book_id   INT NOT NULL,
    author_id INT NOT NULL,
    position  INT NOT NULL DEFAULT 0,
    PRIMARY KEY (book_id, author_id),
    INDEX idx_book_authors_author (author_id),
    CONSTRAINT fk_book_authors_book FOREIGN KEY (book_id) REFERENCES books (id) ON DELETE CASCADE,
    CONSTRAINT fk_book_authors_author FOREIGN KEY (author_id) REFERENCES authors (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE journals (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    slug              VARCHAR(255)  NOT NULL UNIQUE,
    title             VARCHAR(500)  NOT NULL,
    issn              VARCHAR(20)   NOT NULL DEFAULT '',
    e_issn            VARCHAR(20)   NOT NULL DEFAULT '',
    field             VARCHAR(120)  NOT NULL DEFAULT '',
    impact_factor     DECIMAL(4, 1) NOT NULL DEFAULT 0,
    cite_score        DECIMAL(4, 1) NOT NULL DEFAULT 0,
    frequency         VARCHAR(32)   NOT NULL DEFAULT 'Quarterly',
    open_access       BOOLEAN       NOT NULL DEFAULT FALSE,
    description       TEXT          NOT NULL,
    editor_in_chief   VARCHAR(255)  NOT NULL DEFAULT '',
    established       INT           NOT NULL DEFAULT 2000,
    acceptance_rate   INT           NOT NULL DEFAULT 0,
    review_time_weeks INT           NOT NULL DEFAULT 0,
    indexing          JSON          NOT NULL,
    created_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE blog_posts (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    slug              VARCHAR(255) NOT NULL UNIQUE,
    title             VARCHAR(500) NOT NULL,
    excerpt           TEXT         NOT NULL,
    content           JSON         NOT NULL,
    category          VARCHAR(120) NOT NULL DEFAULT '',
    tags              JSON         NOT NULL,
    author_name       VARCHAR(255) NOT NULL DEFAULT '',
    author_role       VARCHAR(255) NOT NULL DEFAULT '',
    published_at      DATE         NOT NULL,
    read_time_minutes INT          NOT NULL DEFAULT 5,
    featured          BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_blog_posts_category (category),
    INDEX idx_blog_posts_published (published_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE services (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    slug              VARCHAR(255) NOT NULL UNIQUE,
    title             VARCHAR(255) NOT NULL,
    short_description TEXT         NOT NULL,
    description       TEXT         NOT NULL,
    icon              VARCHAR(64)  NOT NULL DEFAULT 'star',
    features          JSON         NOT NULL,
    category          VARCHAR(64)  NOT NULL DEFAULT 'Editorial',
    popular           BOOLEAN      NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE testimonials (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    role        VARCHAR(255) NOT NULL DEFAULT '',
    institution VARCHAR(255) NOT NULL DEFAULT '',
    quote       TEXT         NOT NULL,
    rating      INT          NOT NULL DEFAULT 5,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_testimonials_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE faqs (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    question   TEXT        NOT NULL,
    answer     TEXT        NOT NULL,
    category   VARCHAR(64) NOT NULL DEFAULT 'General',
    sort_order INT         NOT NULL DEFAULT 0,
    created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE publishing_requests (
    id                   INT AUTO_INCREMENT PRIMARY KEY,
    reference_id         VARCHAR(32)  NOT NULL UNIQUE,
    full_name            VARCHAR(255) NOT NULL,
    email                VARCHAR(255) NOT NULL,
    phone                VARCHAR(64)  NOT NULL DEFAULT '',
    country              VARCHAR(120) NOT NULL DEFAULT '',
    affiliation          VARCHAR(255) NOT NULL DEFAULT '',
    book_title           VARCHAR(500) NOT NULL,
    category             VARCHAR(120) NOT NULL DEFAULT '',
    language             VARCHAR(60)  NOT NULL DEFAULT 'English',
    word_count           VARCHAR(64)  NOT NULL DEFAULT '',
    synopsis             TEXT         NOT NULL,
    manuscript_file_name VARCHAR(500),
    agreed_to_terms      BOOLEAN      NOT NULL DEFAULT FALSE,
    is_original_work     BOOLEAN      NOT NULL DEFAULT FALSE,
    status               VARCHAR(32)  NOT NULL DEFAULT 'pending',
    created_at           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_publishing_requests_status (status),
    CONSTRAINT chk_publishing_requests_status
        CHECK (status IN ('pending', 'in_review', 'accepted', 'rejected'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE contact_messages (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    reference_id VARCHAR(32)  NOT NULL UNIQUE,
    name         VARCHAR(255) NOT NULL,
    email        VARCHAR(255) NOT NULL,
    department   VARCHAR(120) NOT NULL DEFAULT '',
    subject      VARCHAR(500) NOT NULL DEFAULT '',
    message      TEXT         NOT NULL,
    status       VARCHAR(32)  NOT NULL DEFAULT 'new',
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_contact_messages_status
        CHECK (status IN ('new', 'responded', 'archived'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE newsletter_subscribers (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    email      VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
