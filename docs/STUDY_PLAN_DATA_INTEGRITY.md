# Study Plan Data Integrity System

This document explains the comprehensive data integrity system implemented to prevent study plan inconsistencies.

## 🎯 Problem Solved

The original issue was inconsistent step ID formats and prerequisites that caused:
- Steps not unlocking after completing prerequisites  
- Mixed ID formats (`step-{id}`, `tutorial-{slug}`, raw IDs)
- Orphaned prerequisites pointing to non-existent steps
- User progress tracking inconsistencies

## 🏗️ Solution Architecture

### 1. **Centralized ID Management (`IdService`)**
```typescript
// All step IDs now use consistent format: step-{phaseStepId}
const stepId = IdService.createStepId(phaseStepId);

// Validation ensures format consistency
IdService.isValidStepId(stepId); // Returns true/false

// Legacy ID conversion
await IdService.normalizePrerequisites(prereqs, allPhaseSteps);
```

### 2. **Data Migration System (`DataMigrationService`)**
- Fixes existing inconsistent data
- Validates data integrity
- Provides detailed reporting
- Safe rollback capabilities

### 3. **Database Constraints**
```sql
-- Prevents future data inconsistencies at DB level
ALTER TABLE "phase_steps" 
ADD CONSTRAINT "prerequisites_format_check" 
CHECK (all prerequisites match '^step-[a-z0-9]+$' format);
```

### 4. **Runtime Validation**
- Development mode validation catches issues early
- Production logging for monitoring
- Automatic data cleaning on read

## 📋 Usage Guide

### Running Data Migration

```bash
# Validate current data integrity
npm run data:validate

# Fix data inconsistencies  
npm run data:migrate

# Run both migration and validation
npm run data:fix
```

### API Endpoints (Admin Only)

```bash
# Complete migration
POST /api/admin/migrate-data
{
  "action": "complete"
}

# Just validate
POST /api/admin/migrate-data  
{
  "action": "validate"
}
```

### Manual Database Migration

```bash
# Apply database constraints
npx prisma migrate deploy

# Or run the SQL directly
psql -d your_database < prisma/migrations/add_prerequisite_constraints/migration.sql
```

## 🔍 Data Format Standards

### Step IDs
- **Format**: `step-{phaseStepId}`
- **Example**: `step-cmf082krn0009w5601bbrdkw8`
- **Validation**: `/^step-[a-z0-9]+$/i`

### Prerequisites
- **Storage**: Array of step IDs in PhaseStep.prerequisites
- **Format**: `["step-{id1}", "step-{id2}"]`
- **Validation**: All must reference existing steps

### User Progress
- **completedSteps**: Array of valid step IDs
- **currentStepId**: Valid step ID or "completed"
- **Auto-cleaning**: Invalid IDs removed on read

## 🛡️ Prevention Mechanisms

### 1. **Database Level**
- Format constraints prevent invalid data insertion
- Foreign key-like validation for prerequisites
- Indexes for performance optimization

### 2. **Application Level**
- IdService enforces consistent ID creation
- Runtime validation in development
- Automatic data cleaning

### 3. **Development Workflow**
- Validation scripts in pre-commit hooks
- Clear error messages for developers
- Documentation and examples

## 📊 Monitoring & Maintenance

### Development Monitoring
```typescript
// Enable validation logging
if (process.env.NODE_ENV === 'development') {
  StudyPlanService.validateStepData(step);
}
```

### Production Monitoring
- Invalid step IDs are logged but don't break functionality
- Metrics tracking for data consistency
- Automatic healing of minor inconsistencies

### Regular Maintenance
```bash
# Monthly data validation
npm run data:validate

# After any manual database changes
npm run data:fix
```

## 🚨 Troubleshooting

### Common Issues

1. **"Invalid prerequisite format" Error**
   ```bash
   # Fix: Run data migration
   npm run data:migrate
   ```

2. **Steps not unlocking after completion**
   ```bash
   # Check data integrity
   npm run data:validate
   
   # Fix if issues found
   npm run data:fix
   ```

3. **Orphaned prerequisites**
   ```bash
   # The migration script will identify and fix these
   npm run data:migrate
   ```

### Emergency Recovery
```sql
-- Disable constraints temporarily if needed
ALTER TABLE phase_steps DISABLE TRIGGER validate_prerequisites_trigger;

-- Re-enable after fixing data
ALTER TABLE phase_steps ENABLE TRIGGER validate_prerequisites_trigger;
```

## 🔧 Development Guidelines

### Adding New Content
1. Use `IdService.createStepId()` for step IDs
2. Validate prerequisites reference existing steps
3. Run `npm run data:validate` before committing

### Database Changes
1. Update migration scripts
2. Test with `npm run data:fix`
3. Document any new constraints

### Code Reviews
- Check for consistent ID usage
- Validate prerequisite logic
- Ensure proper error handling

## 📈 Performance Considerations

### Optimizations Implemented
- GIN indexes on array fields
- Batch processing in migrations
- Lazy validation in production

### Best Practices
- Cache study plan data appropriately
- Use IdService for all step ID operations
- Validate data during development only

## 🔄 Future Improvements

### Planned Enhancements
1. **Real-time validation** during content creation
2. **Automated healing** of minor inconsistencies
3. **Performance monitoring** for large datasets
4. **Visual dependency graphs** for prerequisites

### Migration Path
- Current system is backward compatible
- Gradual migration of legacy components
- Deprecation warnings for old patterns

---

## 📞 Support

For issues or questions about the data integrity system:
1. Check this documentation first
2. Run validation scripts to identify issues
3. Review error logs for specific problems
4. Contact the development team with detailed error information

This system ensures robust, consistent study plan data that scales reliably as the platform grows.