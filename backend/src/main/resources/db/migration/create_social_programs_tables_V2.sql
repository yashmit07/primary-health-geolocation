-- Social programs table
CREATE TABLE social_programs (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    cell_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Program type reference table
CREATE TABLE program_type_refs (
    id BIGSERIAL PRIMARY KEY,
    program_id BIGINT REFERENCES social_programs(id) ON DELETE CASCADE,
    type_id INTEGER REFERENCES program_types(type_id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(program_id, type_id)
);

-- Program types table
CREATE TABLE program_types (
    type_id SERIAL PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_social_programs_cell_id ON social_programs(cell_id);

-- Insert initial program types
INSERT INTO program_types (type_name) VALUES 
    ('Food'),
    ('Housing'),
    ('Childcare'),
    ('Transportation'),
    ('Disability');