-- Up
CREATE TABLE Sessions (
    id INTEGER PRIMARY KEY,
    uuid TEXT NOT NULL,
    hostId TEXT NOT NULL,
    guestId TEXT
);

CREATE INDEX Sessions_idx_hostId ON Sessions (hostId);
CREATE INDEX Sessions_idx_guestId ON Sessions (guestId);

-- Down
DROP INDEX Sessions_idx_guestId;
DROP INDEX Sessions_idx_hostId;
DROP TABLE Sessions;
