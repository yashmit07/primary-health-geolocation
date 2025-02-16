ALTER TABLE social_programs
ADD CONSTRAINT uk_social_program_name_address UNIQUE (name, address);