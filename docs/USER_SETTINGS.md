# User Settings System

## Overview

The user settings system provides a comprehensive interface for users to customize their learning experience in the Vibed to Cracked platform.

## Features

### 📱 Settings Page (`/settings`)
- **Tabbed Interface**: Profile, Notifications, Learning, and Privacy tabs
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Changes are saved immediately to the database
- **Accessibility**: Full ARIA compliance with proper labels and titles

### 👤 Profile Settings
- **Name Management**: Update display name
- **Email Display**: Shows email (read-only for security)
- **Mood Selection**: Choose preferred learning mood (Chill, Rush, Grind)
- **Visual Mood Indicators**: Each mood shows with emoji and description

### 🔔 Notification Preferences
- **Email Notifications**: Control general email updates
- **Learning Reminders**: Daily study reminders
- **Achievement Alerts**: Notifications for unlocked achievements
- **Weekly Progress**: Summary reports each week

### 🧠 Learning Preferences
- **Daily Goal**: Set learning time goal (5-180 minutes)
- **Reminder Time**: Choose when to receive study reminders
- **Default Difficulty**: Set preferred challenge difficulty
- **Auto-submit**: Option to auto-submit on timer expiry

### 🔒 Privacy & Security
- **Public Profile**: Control profile visibility
- **Progress Sharing**: Share learning progress with others
- **Analytics**: Allow usage analytics for platform improvement
- **Account Deletion**: Permanent account removal (with confirmation)

## Technical Implementation

### Backend APIs

#### `GET /api/user/settings`
- Fetches user settings from database
- Returns default settings if none exist
- Currently uses User.mood field, will integrate UserSettings table

#### `PUT /api/user/settings`
- Updates user settings in database
- Validates input data
- Updates user name and mood preference

#### `DELETE /api/user/delete`
- Permanently deletes user account
- Removes all associated data (progress, attempts, sessions)
- Uses database transactions for data integrity

### Database Schema

```prisma
model UserSettings {
  id            String   @id @default(cuid())
  userId        String   @unique
  preferredMood String   @default("CHILL")
  
  // Notification preferences
  emailNotifications     Boolean @default(true)
  reminderNotifications  Boolean @default(true)
  achievementNotifications Boolean @default(true)
  weeklyProgressReports  Boolean @default(false)
  
  // Privacy settings
  showPublicProfile Boolean @default(true)
  shareProgress     Boolean @default(false)
  allowAnalytics    Boolean @default(true)
  
  // Learning preferences
  dailyGoalMinutes Int     @default(30)
  reminderTime     String  @default("18:00")
  difficulty       String  @default("MEDIUM")
  autoSubmit       Boolean @default(false)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_settings")
}
```

### Frontend Components

#### Settings Page Structure
```tsx
/settings
├── Sidebar Navigation (Profile, Notifications, Learning, Privacy)
├── Profile Tab
│   ├── Name Input
│   ├── Email Display (read-only)
│   └── Mood Selection Cards
├── Notifications Tab
│   └── Toggle Switches for each notification type
├── Learning Tab
│   ├── Daily Goal Slider
│   ├── Reminder Time Picker
│   ├── Difficulty Selector
│   └── Auto-submit Checkbox
└── Privacy Tab
    ├── Privacy Toggle Switches
    └── Danger Zone (Account Deletion)
```

## Integration Points

### Global Header
- Settings link in user dropdown menu
- Redirects to `/settings` page
- Protected by authentication middleware

### Middleware Protection
- `/settings` route requires authentication
- Automatic redirect to signin if not authenticated
- Proper session token validation

### Mood System Integration
- Settings page updates global mood state
- Changes reflected immediately in UI
- Mood affects quiz behavior, timers, and content

## Usage Examples

### Accessing Settings
1. Click user avatar in global header
2. Select "Settings" from dropdown
3. Navigate through tabs to customize preferences

### Updating Mood Preference
1. Go to Profile tab in settings
2. Click on desired mood card (Chill, Rush, Grind)
3. Click "Save Changes" to apply
4. Mood updates globally across the platform

### Managing Notifications
1. Go to Notifications tab
2. Toggle switches for desired notification types
3. Changes auto-save when toggled

### Account Deletion
1. Go to Privacy tab
2. Scroll to "Danger Zone"
3. Click "Delete Account"
4. Confirm deletion (irreversible action)

## Security Features

- **Input Validation**: All settings inputs are validated
- **SQL Injection Protection**: Prisma ORM with parameterized queries
- **Session Verification**: All API calls require valid session
- **Data Sanitization**: User inputs are trimmed and validated
- **Cascade Deletion**: Proper cleanup of related data on account deletion

## Future Enhancements

- [ ] **Theme Customization**: Custom color schemes beyond mood themes
- [ ] **Language Preferences**: Multi-language support
- [ ] **Timezone Settings**: Automatic timezone detection and manual override
- [ ] **Learning Streaks**: Streak goals and rewards
- [ ] **Social Features**: Friend connections and study groups
- [ ] **Export Data**: Download personal learning data
- [ ] **Two-Factor Authentication**: Enhanced security options

## Migration Notes

The UserSettings table has been added to the schema but the Prisma client needs regeneration. Currently, the system uses the existing User.mood field and will gradually migrate to the full UserSettings implementation.
