-- Site-wide editable settings (contact info, stats, socials, offices, process…)
-- depends: 0001_initial_schema

CREATE TABLE site_settings (
    setting_key VARCHAR(64) NOT NULL PRIMARY KEY,
    value       JSON        NOT NULL,
    updated_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
