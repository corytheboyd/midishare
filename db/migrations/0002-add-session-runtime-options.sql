-- Up
ALTER TABLE Sessions ADD COLUMN hostSustainInverted INTEGER(1) DEFAULT 0 NOT NULL;
ALTER TABLE Sessions ADD COLUMN guestSustainInverted INTEGER(1) DEFAULT 0 NOT NULL;

-- Down
ALTER TABLE Sessions DROP COLUMN hostSustainInverted;
ALTER TABLE Sessions DROP COLUMN guestSustainInverted;
