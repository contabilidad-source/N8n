# Enhanced Office Exercise Routine Generator

A comprehensive Google Apps Script solution for creating and managing office exercise routines directly in Google Sheets.

## Features

### 🎯 Multiple Routine Types

1. **Core Routine** - Focus on core strength and spinal health
2. **Full Body Routine** - Complete workout for all major muscle groups
3. **Stretching Routine** - Flexibility and mobility work to combat sitting
4. **Quick Break Routine** - Fast 5-minute movement breaks every hour

### ✨ Key Capabilities

- **Custom Menu System** - Easy access via "Exercise Routines" menu
- **Professional Formatting** - Color-coded intensity levels, alternating rows, borders
- **Progress Tracker** - Log completed workouts with notes and energy levels
- **Customizable Schedules** - Adjust start times, intervals, and session counts
- **PDF Export** - Print-ready export of your routines
- **Built-in Help** - Comprehensive in-app documentation

## Installation

### Method 1: Google Sheets Web Interface

1. Open Google Sheets and create a new spreadsheet
2. Click **Extensions** → **Apps Script**
3. Delete any existing code
4. Copy the entire contents of `enhanced-office-routine.gs`
5. Paste into the Apps Script editor
6. Click **Save** (💾 icon)
7. Name your project (e.g., "Office Exercise Routines")
8. Close the Apps Script tab
9. **Reload your spreadsheet** - The "Exercise Routines" menu will appear

### Method 2: Standalone Script

1. Go to [script.google.com](https://script.google.com)
2. Create a new project
3. Paste the code
4. Save and deploy as needed

## Usage

### Quick Start

1. Open your spreadsheet
2. Look for the **"🏃 Exercise Routines"** menu in the top menu bar
3. Select a routine type:
   - 📋 Core Routine
   - 💪 Full Body Routine
   - 🧘 Stretching Routine
   - ⚡ Quick Break Routine
4. A new sheet will be created with your formatted schedule

### Progress Tracking

1. Click **Exercise Routines** → **Create Progress Tracker**
2. Log your completed exercises:
   - Date and time
   - Routine type
   - Exercises completed
   - Notes
   - Energy level (1-10)

### Customization

1. Click **Exercise Routines** → **Customize Schedule**
2. Configure:
   - Start time (default: 9:00 AM)
   - Interval between sessions (default: 60 min)
   - Number of sessions (default: 6)
   - Routine type preference
3. Click **Apply**
4. Generate your routine from the menu

### Export to PDF

1. Navigate to the routine sheet you want to export
2. Click **Exercise Routines** → **Export to PDF**
3. Click the download link in the popup
4. Print or save the PDF

## Routine Details

### Core Routine (6 sessions)
- **Focus**: Core strength, spinal health, posture
- **Duration**: 9:00 AM - 4:00 PM (hourly blocks)
- **Intensity**: Low to Medium
- **Best for**: Desk workers with back pain or posture issues

### Full Body Routine (6 sessions)
- **Focus**: Complete body workout
- **Duration**: 9:00 AM - 5:00 PM (varied intervals)
- **Intensity**: Medium to High
- **Best for**: Maintaining overall fitness during workday

### Stretching Routine (6 sessions)
- **Focus**: Flexibility and mobility
- **Duration**: 9:00 AM - 5:00 PM
- **Intensity**: Low
- **Best for**: Combating sitting-related stiffness

### Quick Break Routine (6 steps per break)
- **Focus**: Fast movement breaks
- **Duration**: 5 minutes per session
- **Intensity**: Low to Medium
- **Best for**: Busy schedules, beginners, hourly resets

## Format Features

### Color Coding

- **Header**: Blue background (#4285f4) with white text
- **Time Column**: Light blue background (#e8f0fe) for easy scanning
- **Alternating Rows**: Light gray (#f8f9fa) for readability
- **Intensity Levels**:
  - 🟢 Low: Green background (#d4edda)
  - 🟡 Medium: Yellow background (#fff3cd)
  - 🔴 High: Red background (#f8d7da)

### Sheet Layout

```
┌─────────────────────────────────────────────────────────┐
│ 📌 [Routine Description]                                │
├──────┬─────────────┬──────────────┬──────────┬─────────┤
│ Time │ Exercises   │ Sets × Reps  │ Explain  │Intensity│
├──────┼─────────────┼──────────────┼──────────┼─────────┤
│ 9:00 │ Exercise... │ 3 × 10       │ Details  │ Medium  │
└──────┴─────────────┴──────────────┴──────────┴─────────┘
```

## Customization Options

### Modifying Exercise Content

To add or change exercises, edit the `routineData.blocks` array in each generator function:

```javascript
{
  time: "10:00",
  exercises: "Your exercises here",
  sets: "3 × 10 / 30s",
  explanation: "Why to do this exercise",
  intensity: "Medium"  // Low, Medium, or High
}
```

### Adjusting Colors

Modify the `CONFIG.COLORS` object:

```javascript
const CONFIG = {
  COLORS: {
    HEADER: '#4285f4',        // Header background
    HEADER_TEXT: '#ffffff',   // Header text
    TIME_COL: '#e8f0fe',      // Time column
    ALT_ROW: '#f8f9fa'        // Alternating rows
  }
}
```

### Adding New Routines

1. Create a new generator function following the pattern:

```javascript
function generateMyCustomRoutine() {
  const routineData = {
    name: "My Custom Routine",
    description: "Description here",
    blocks: [
      // Your exercise blocks
    ]
  };
  generateRoutineSheet(routineData);
}
```

2. Add menu item in `onOpen()`:

```javascript
.addItem('🎯 My Custom Routine', 'generateMyCustomRoutine')
```

## Advanced Features

### Automatic Time Calculation

Use the utility function to generate time blocks programmatically:

```javascript
const times = generateTimeBlocks('09:00', 60, 6);
// Returns: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00']
```

### Persistent Settings

Settings are saved using `PropertiesService` and persist across sessions:

```javascript
const settings = getCustomSettings();
// Returns: { startTime, interval, sessions, routineType }
```

## Tips for Best Results

### For Beginners
1. Start with **Quick Break Routine** (easiest to maintain)
2. Set phone/calendar reminders for each time block
3. Focus on form over speed
4. Use the Progress Tracker to build habit

### For Experienced Users
1. Mix routines throughout the week:
   - Monday/Wednesday/Friday: Full Body
   - Tuesday/Thursday: Core + Stretching
2. Customize intensity by modifying set/rep counts
3. Create hybrid routines combining exercises from different templates

### For Maximum Effectiveness
1. Stand up for every break (even if you skip exercises)
2. Keep water nearby to hydrate during breaks
3. Log energy levels to identify optimal exercise times
4. Share spreadsheet with team for group accountability

## Troubleshooting

### Menu Not Appearing
- **Solution**: Reload the spreadsheet (Ctrl+R or Cmd+R)
- **If still missing**: Check Apps Script permissions (Extensions → Apps Script → Run `onOpen` manually)

### "Permission Required" Error
- **Solution**: Click "Review Permissions" → Select your Google account → Click "Allow"
- **Why**: Google requires authorization for scripts that modify spreadsheets

### Formatting Looks Wrong
- **Solution**: Check column widths are set correctly in `formatRoutineSheet()`
- **Tip**: Manually adjust and re-run the generator

### Custom Settings Not Saving
- **Solution**: Ensure `PropertiesService` has permissions
- **Check**: Run `applyCustomSettings()` manually from Apps Script editor

## Performance Notes

- **Generation time**: ~2-3 seconds per routine
- **Recommended**: Keep total sheets under 20 for optimal performance
- **Memory**: Minimal - uses efficient batch operations
- **Mobile friendly**: Works on Google Sheets mobile app

## Comparison: Original vs Enhanced

| Feature | Original Script | Enhanced Version |
|---------|----------------|------------------|
| Routines | 1 (Core only) | 4 (Core, Full Body, Stretching, Quick) |
| UI | None | Custom menu system |
| Formatting | Basic | Professional with color coding |
| Customization | Hardcoded | Interactive dialog |
| Tracking | None | Built-in progress tracker |
| Export | None | PDF export |
| Help | None | In-app documentation |
| Error Handling | None | Comprehensive try-catch |
| Safety | Clears entire sheet | Clears only target range |
| Code Structure | Single function | Modular with utilities |

## Technical Improvements

### Code Quality
- ✅ Modular architecture with single-responsibility functions
- ✅ Comprehensive error handling with user feedback
- ✅ Configuration object for easy customization
- ✅ Reusable utility functions
- ✅ JSDoc comments throughout

### Performance
- ✅ Batch operations (single `setValues()` call)
- ✅ Efficient range selection
- ✅ No unnecessary loops

### Safety
- ✅ Targeted clearing (only affected ranges)
- ✅ Confirmation dialogs for destructive actions
- ✅ Data validation on tracker inputs
- ✅ Graceful error handling

### User Experience
- ✅ Visual feedback (alerts, color coding)
- ✅ Descriptive messages
- ✅ Intuitive menu structure
- ✅ Built-in help system

## Future Enhancement Ideas

- [ ] Email reminders for scheduled exercises
- [ ] Integration with Google Calendar
- [ ] Exercise video link library
- [ ] Team leaderboard/challenges
- [ ] Custom exercise builder UI
- [ ] Weekly routine planner
- [ ] Integration with fitness trackers
- [ ] Mobile app companion

## License & Attribution

This script is provided as-is for personal and commercial use. Feel free to modify and distribute.

**Original concept**: Basic office core routine generator
**Enhanced by**: AI-assisted development
**Version**: 2.0
**Last updated**: 2025

## Support

For issues or questions:
1. Check the built-in Help (Exercise Routines → Help)
2. Review this README
3. Inspect the code comments
4. Test with the Apps Script debugger

## Contributing

To contribute improvements:
1. Test your changes thoroughly
2. Follow existing code style
3. Add JSDoc comments
4. Update this README
5. Document breaking changes

---

**Happy exercising! Stay healthy at your desk! 💪**
