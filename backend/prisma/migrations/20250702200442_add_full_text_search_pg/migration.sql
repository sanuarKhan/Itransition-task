
-- Add tsvector column to templates table
ALTER TABLE "templates" ADD COLUMN "search_vector" tsvector;

-- Create a function to update the search_vector for templates
CREATE OR REPLACE FUNCTION update_template_search_vector() RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before insert or update on templates
CREATE TRIGGER update_template_search_vector_trigger
BEFORE INSERT OR UPDATE OF title, description ON "templates"
FOR EACH ROW EXECUTE FUNCTION update_template_search_vector();

-- Update existing template rows
UPDATE "templates" SET search_vector =
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B');

-- Create GIN index on templates search_vector
CREATE INDEX templates_search_vector_idx ON "templates" USING GIN (search_vector);


-- Add tsvector column to questions table
ALTER TABLE "questions" ADD COLUMN "search_vector" tsvector;

-- Create a function to update the search_vector for questions
CREATE OR REPLACE FUNCTION update_question_search_vector() RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before insert or update on questions
CREATE TRIGGER update_question_search_vector_trigger
BEFORE INSERT OR UPDATE OF title, description ON "questions"
FOR EACH ROW EXECUTE FUNCTION update_question_search_vector();

-- Update existing question rows
UPDATE "questions" SET search_vector =
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'B');

-- Create GIN index on questions search_vector
CREATE INDEX questions_search_vector_idx ON "questions" USING GIN (search_vector);
