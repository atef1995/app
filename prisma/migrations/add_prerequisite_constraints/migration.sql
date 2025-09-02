-- Add constraint to ensure prerequisites are in correct format
-- This prevents future data inconsistency issues

-- First, let's add a function to validate step ID format
CREATE OR REPLACE FUNCTION validate_step_id_format(step_id TEXT) 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN step_id ~ '^step-[a-z0-9]+$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Add constraint to phase_steps table to ensure prerequisites are properly formatted
ALTER TABLE "phase_steps" 
ADD CONSTRAINT "prerequisites_format_check" 
CHECK (
  array_length(prerequisites, 1) IS NULL OR 
  NOT EXISTS (
    SELECT 1 
    FROM unnest(prerequisites) AS prereq 
    WHERE NOT validate_step_id_format(prereq)
  )
);

-- Add a comment explaining the constraint
COMMENT ON CONSTRAINT "prerequisites_format_check" ON "phase_steps" IS 
'Ensures all prerequisites follow the step-{id} format to maintain data consistency';

-- Create an index for better performance on prerequisite queries
CREATE INDEX IF NOT EXISTS "idx_phase_steps_prerequisites" 
ON "phase_steps" USING gin(prerequisites);

-- Add constraint to user_study_progress to ensure completed_steps are properly formatted
ALTER TABLE "user_study_progress" 
ADD CONSTRAINT "completed_steps_format_check" 
CHECK (
  array_length("completedSteps", 1) IS NULL OR 
  NOT EXISTS (
    SELECT 1 
    FROM unnest("completedSteps") AS step_id 
    WHERE NOT validate_step_id_format(step_id)
  )
);

-- Add constraint to ensure currentStepId is properly formatted (allow "completed" as special case)
ALTER TABLE "user_study_progress" 
ADD CONSTRAINT "current_step_format_check" 
CHECK (
  "currentStepId" = 'completed' OR 
  validate_step_id_format("currentStepId")
);

-- Add comments
COMMENT ON CONSTRAINT "completed_steps_format_check" ON "user_study_progress" IS 
'Ensures all completed step IDs follow the step-{id} format';

COMMENT ON CONSTRAINT "current_step_format_check" ON "user_study_progress" IS 
'Ensures current step ID follows the step-{id} format or is "completed"';

-- Create index for better performance on completed steps queries
CREATE INDEX IF NOT EXISTS "idx_user_study_progress_completed_steps" 
ON "user_study_progress" USING gin("completedSteps");

-- Create index for current step queries
CREATE INDEX IF NOT EXISTS "idx_user_study_progress_current_step" 
ON "user_study_progress" ("currentStepId");

-- Add a function to help with prerequisite validation during inserts/updates
CREATE OR REPLACE FUNCTION validate_prerequisite_references()
RETURNS TRIGGER AS $$
DECLARE
  prereq_step_id TEXT;
  prereq_exists BOOLEAN;
BEGIN
  -- For each prerequisite, check if it references an existing step
  FOREACH prereq_step_id IN ARRAY NEW.prerequisites
  LOOP
    -- Extract the actual step ID from the step-{id} format
    prereq_exists := EXISTS (
      SELECT 1 FROM phase_steps 
      WHERE id = substring(prereq_step_id from 6)
    );
    
    IF NOT prereq_exists THEN
      RAISE WARNING 'Prerequisite % references non-existent step', prereq_step_id;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to validate prerequisite references
DROP TRIGGER IF EXISTS validate_prerequisites_trigger ON phase_steps;
CREATE TRIGGER validate_prerequisites_trigger
  BEFORE INSERT OR UPDATE ON phase_steps
  FOR EACH ROW
  EXECUTE FUNCTION validate_prerequisite_references();

COMMENT ON FUNCTION validate_prerequisite_references() IS 
'Validates that prerequisite step IDs reference existing steps';