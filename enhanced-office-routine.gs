/**
 * Enhanced Office Exercise Routine Generator
 * Google Apps Script for creating customizable exercise schedules in Sheets
 *
 * Features:
 * - Multiple routine types (Core, Full Body, Stretching, Quick Breaks)
 * - Custom menu for easy access
 * - Configurable time blocks
 * - Professional formatting
 * - Progress tracking
 * - Export to PDF
 */

// ========================================
// CONFIGURATION
// ========================================

const CONFIG = {
  COLORS: {
    HEADER: '#4285f4',
    HEADER_TEXT: '#ffffff',
    TIME_COL: '#e8f0fe',
    ALT_ROW: '#f8f9fa'
  },
  SHEET_NAMES: {
    CORE: 'Core Routine',
    FULL_BODY: 'Full Body',
    STRETCHING: 'Stretching',
    QUICK: 'Quick Breaks',
    TRACKER: 'Progress Tracker'
  },
  DEFAULT_START_TIME: '09:00',
  DEFAULT_INTERVAL: 60 // minutes
};

// ========================================
// MENU SETUP
// ========================================

/**
 * Creates custom menu when spreadsheet opens
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🏃 Exercise Routines')
    .addItem('📋 Core Routine', 'generateCoreRoutine')
    .addItem('💪 Full Body Routine', 'generateFullBodyRoutine')
    .addItem('🧘 Stretching Routine', 'generateStretchingRoutine')
    .addItem('⚡ Quick Break Routine', 'generateQuickBreakRoutine')
    .addSeparator()
    .addItem('📊 Create Progress Tracker', 'createProgressTracker')
    .addItem('⚙️ Customize Schedule', 'showCustomizeDialog')
    .addSeparator()
    .addItem('📄 Export to PDF', 'exportToPDF')
    .addItem('❓ Help', 'showHelp')
    .addToUi();
}

// ========================================
// ROUTINE GENERATORS
// ========================================

/**
 * Generates core-focused office routine
 */
function generateCoreRoutine() {
  const routineData = {
    name: CONFIG.SHEET_NAMES.CORE,
    description: 'Focus on core strength and spinal health throughout the workday',
    blocks: [
      {
        time: "09:00",
        exercises: "Seated Pelvic Tilts, Braced Belly Breathing, Scapular Setting",
        sets: "10 tilts / 5 breaths / 5 × 5s holds",
        explanation: "Activate deep core and set neutral posture for the day.",
        intensity: "Low"
      },
      {
        time: "10:00",
        exercises: "Chair Leg Raises, Standing Desk Plank Press, Wall Angels",
        sets: "3 × 10 / 2 × 30s / 10 reps",
        explanation: "Strengthen abs and upper back while keeping spine neutral.",
        intensity: "Medium"
      },
      {
        time: "11:00",
        exercises: "Doorway Chest Stretch, Thoracic Extension over Chair",
        sets: "2 × 30s each / 8 reps",
        explanation: "Open chest and extend upper spine to undo slouching.",
        intensity: "Low"
      },
      {
        time: "13:00",
        exercises: "Standing Knee-to-Elbow Crunches, Bird-Dog at Desk, Hip Flexor Stretch",
        sets: "15 each / 8 each side / 2 × 30s",
        explanation: "Train obliques and glutes, relieve tight hip flexors from sitting.",
        intensity: "Medium"
      },
      {
        time: "15:00",
        exercises: "Scapular Setting, Doorway Stretch, Seated Twist",
        sets: "5 × 5s holds / 30s / 5 each side",
        explanation: "Re-activate upper back and restore rotation through the spine.",
        intensity: "Low"
      },
      {
        time: "16:00",
        exercises: "Chair Leg Raises, Standing Desk Plank Press, Braced Breathing",
        sets: "3 × 12 / 45s / 5 breaths",
        explanation: "Finish day with core endurance and calm breathing reset.",
        intensity: "Medium"
      }
    ]
  };

  generateRoutineSheet(routineData);
}

/**
 * Generates full body office routine
 */
function generateFullBodyRoutine() {
  const routineData = {
    name: CONFIG.SHEET_NAMES.FULL_BODY,
    description: 'Complete body workout adapted for office environment',
    blocks: [
      {
        time: "09:00",
        exercises: "Desk Push-ups, Chair Squats, Arm Circles",
        sets: "3 × 10 / 3 × 15 / 10 each direction",
        explanation: "Wake up major muscle groups with compound movements.",
        intensity: "Medium"
      },
      {
        time: "10:30",
        exercises: "Wall Sits, Tricep Dips on Chair, Calf Raises",
        sets: "3 × 30s / 3 × 12 / 3 × 20",
        explanation: "Build leg and arm strength during mid-morning break.",
        intensity: "High"
      },
      {
        time: "12:00",
        exercises: "Standing Lunges, Desk Rows, Shoulder Shrugs",
        sets: "3 × 10 each / 3 × 15 / 3 × 15",
        explanation: "Pre-lunch activation for legs, back, and shoulders.",
        intensity: "Medium"
      },
      {
        time: "14:00",
        exercises: "Seated Leg Extensions, Wall Push-ups, Neck Rolls",
        sets: "3 × 12 each / 3 × 12 / 5 each direction",
        explanation: "Post-lunch energy boost targeting full body.",
        intensity: "Low"
      },
      {
        time: "15:30",
        exercises: "Chair Squats, Desk Plank, Wrist Circles",
        sets: "3 × 20 / 2 × 45s / 10 each direction",
        explanation: "Afternoon strength and stability work.",
        intensity: "High"
      },
      {
        time: "17:00",
        exercises: "Standing Quad Stretch, Chest Doorway Stretch, Deep Breathing",
        sets: "2 × 30s each / 2 × 30s / 5 breaths",
        explanation: "Cool down and prepare body for end of workday.",
        intensity: "Low"
      }
    ]
  };

  generateRoutineSheet(routineData);
}

/**
 * Generates stretching and mobility routine
 */
function generateStretchingRoutine() {
  const routineData = {
    name: CONFIG.SHEET_NAMES.STRETCHING,
    description: 'Flexibility and mobility work to combat sitting',
    blocks: [
      {
        time: "09:00",
        exercises: "Neck Stretches (all directions), Shoulder Rolls",
        sets: "30s each / 10 forward, 10 back",
        explanation: "Release morning tension in neck and shoulders.",
        intensity: "Low"
      },
      {
        time: "10:30",
        exercises: "Seated Spinal Twist, Side Bends, Cat-Cow (standing)",
        sets: "30s each side / 10 each / 10 reps",
        explanation: "Restore spinal mobility and side body length.",
        intensity: "Low"
      },
      {
        time: "12:00",
        exercises: "Hip Flexor Stretch, Hamstring Stretch, Calf Stretch",
        sets: "45s each side / 45s each / 30s each",
        explanation: "Open up lower body after morning sitting.",
        intensity: "Low"
      },
      {
        time: "14:00",
        exercises: "Doorway Chest Stretch, Tricep Stretch, Wrist Flexor Stretch",
        sets: "45s / 30s each / 30s each",
        explanation: "Release upper body tension from typing and mouse work.",
        intensity: "Low"
      },
      {
        time: "15:30",
        exercises: "Figure-4 Glute Stretch, IT Band Stretch, Ankle Circles",
        sets: "45s each / 30s each / 10 each direction",
        explanation: "Deep lower body release for hip and leg health.",
        intensity: "Low"
      },
      {
        time: "17:00",
        exercises: "Full Body Reach, Gentle Backbend, Forward Fold",
        sets: "5 reps / 30s hold / 60s hold",
        explanation: "Full-body integration stretch to end the day.",
        intensity: "Low"
      }
    ]
  };

  generateRoutineSheet(routineData);
}

/**
 * Generates quick 5-minute break routine
 */
function generateQuickBreakRoutine() {
  const routineData = {
    name: CONFIG.SHEET_NAMES.QUICK,
    description: 'Fast 5-minute movement breaks every hour',
    blocks: [
      {
        time: "Every Hour",
        exercises: "Stand and Walk in Place",
        sets: "60 seconds",
        explanation: "Get blood flowing and break static posture.",
        intensity: "Low"
      },
      {
        time: "+1 min",
        exercises: "Desk Push-ups or Wall Push-ups",
        sets: "10-15 reps",
        explanation: "Quick upper body activation.",
        intensity: "Medium"
      },
      {
        time: "+2 min",
        exercises: "Chair Squats",
        sets: "15 reps",
        explanation: "Activate legs and glutes.",
        intensity: "Medium"
      },
      {
        time: "+3 min",
        exercises: "Standing Torso Twists",
        sets: "20 total (10 each side)",
        explanation: "Restore spinal rotation.",
        intensity: "Low"
      },
      {
        time: "+4 min",
        exercises: "Shoulder Rolls + Arm Circles",
        sets: "10 each",
        explanation: "Release shoulder tension.",
        intensity: "Low"
      },
      {
        time: "+5 min",
        exercises: "Deep Breathing + Neck Stretches",
        sets: "5 breaths / 30s",
        explanation: "Reset nervous system and release neck.",
        intensity: "Low"
      }
    ]
  };

  generateRoutineSheet(routineData);
}

// ========================================
// CORE SHEET GENERATION
// ========================================

/**
 * Main function to generate formatted routine sheet
 * @param {Object} routineData - Contains name, description, and exercise blocks
 */
function generateRoutineSheet(routineData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // Get or create sheet
    let sheet = ss.getSheetByName(routineData.name);
    if (!sheet) {
      sheet = ss.insertSheet(routineData.name);
    }

    // Clear existing content
    sheet.clear();

    // Build data array
    const data = [
      ["Time", "Exercises", "Sets × Reps / Duration", "Explanation", "Intensity"]
    ];

    routineData.blocks.forEach(block => {
      data.push([
        block.time,
        block.exercises,
        block.sets,
        block.explanation,
        block.intensity
      ]);
    });

    // Write data
    const dataRange = sheet.getRange(1, 1, data.length, data[0].length);
    dataRange.setValues(data);

    // Apply formatting
    formatRoutineSheet(sheet, data.length, routineData);

    // Add description at top
    sheet.insertRowBefore(1);
    sheet.getRange(1, 1, 1, data[0].length).merge()
      .setValue(`📌 ${routineData.description}`)
      .setBackground('#fff3cd')
      .setFontWeight('bold')
      .setHorizontalAlignment('center')
      .setVerticalAlignment('middle');

    // Set row height for description
    sheet.setRowHeight(1, 40);

    // Activate the sheet
    sheet.activate();

    SpreadsheetApp.getUi().alert(
      '✅ Success',
      `${routineData.name} has been generated!`,
      SpreadsheetApp.getUi().ButtonSet.OK
    );

  } catch (error) {
    SpreadsheetApp.getUi().alert(
      '❌ Error',
      `Failed to generate routine: ${error.message}`,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

/**
 * Applies professional formatting to routine sheet
 * @param {Sheet} sheet - The sheet to format
 * @param {number} rows - Number of data rows
 * @param {Object} routineData - Routine data for context
 */
function formatRoutineSheet(sheet, rows, routineData) {
  const numCols = 5;

  // Header formatting (row 2 after description)
  const headerRange = sheet.getRange(2, 1, 1, numCols);
  headerRange.setBackground(CONFIG.COLORS.HEADER)
    .setFontColor(CONFIG.COLORS.HEADER_TEXT)
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  // Freeze header rows (description + header)
  sheet.setFrozenRows(2);

  // Time column formatting
  const timeRange = sheet.getRange(3, 1, rows - 1, 1);
  timeRange.setBackground(CONFIG.COLORS.TIME_COL)
    .setFontWeight('bold')
    .setHorizontalAlignment('center');

  // Alternating row colors for data
  for (let i = 3; i <= rows + 1; i++) {
    if (i % 2 === 0) {
      sheet.getRange(i, 2, 1, numCols - 1).setBackground(CONFIG.COLORS.ALT_ROW);
    }
  }

  // Intensity column conditional formatting
  const intensityRange = sheet.getRange(3, 5, rows - 1, 1);
  intensityRange.setHorizontalAlignment('center');

  // Apply intensity color coding
  for (let i = 3; i <= rows + 1; i++) {
    const intensity = sheet.getRange(i, 5).getValue();
    let color;
    switch(intensity) {
      case 'Low':
        color = '#d4edda';
        break;
      case 'Medium':
        color = '#fff3cd';
        break;
      case 'High':
        color = '#f8d7da';
        break;
    }
    if (color) {
      sheet.getRange(i, 5).setBackground(color);
    }
  }

  // Set column widths
  sheet.setColumnWidth(1, 80);   // Time
  sheet.setColumnWidth(2, 300);  // Exercises
  sheet.setColumnWidth(3, 180);  // Sets/Reps
  sheet.setColumnWidth(4, 350);  // Explanation
  sheet.setColumnWidth(5, 90);   // Intensity

  // Set row heights
  sheet.setRowHeight(2, 35); // Header
  for (let i = 3; i <= rows + 1; i++) {
    sheet.setRowHeight(i, 70); // Data rows
  }

  // Add borders
  const allDataRange = sheet.getRange(2, 1, rows, numCols);
  allDataRange.setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);

  // Text wrapping
  sheet.getRange(2, 1, rows, numCols).setWrap(true);
}

// ========================================
// PROGRESS TRACKER
// ========================================

/**
 * Creates a progress tracking sheet
 */
function createProgressTracker() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheetName = CONFIG.SHEET_NAMES.TRACKER;

    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    } else {
      const ui = SpreadsheetApp.getUi();
      const response = ui.alert(
        'Sheet Exists',
        'Progress Tracker already exists. Replace it?',
        ui.ButtonSet.YES_NO
      );
      if (response !== ui.Button.YES) {
        return;
      }
      sheet.clear();
    }

    // Header row
    const headers = ['Date', 'Time', 'Routine Type', 'Exercises Completed', 'Notes', 'Energy Level (1-10)'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Add sample data for demonstration
    const sampleData = [
      [new Date(), '09:00', 'Core Routine', 'Pelvic Tilts, Breathing', 'Felt good!', 8],
      [new Date(), '10:00', 'Core Routine', 'Leg Raises, Plank Press', 'Challenging', 7]
    ];
    sheet.getRange(2, 1, sampleData.length, headers.length).setValues(sampleData);

    // Format
    sheet.getRange(1, 1, 1, headers.length)
      .setBackground(CONFIG.COLORS.HEADER)
      .setFontColor(CONFIG.COLORS.HEADER_TEXT)
      .setFontWeight('bold')
      .setHorizontalAlignment('center');

    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, headers.length);

    // Add data validation for Energy Level
    const energyRange = sheet.getRange(2, 6, 1000, 1);
    const rule = SpreadsheetApp.newDataValidation()
      .requireNumberBetween(1, 10)
      .setAllowInvalid(false)
      .setHelpText('Enter a number between 1 and 10')
      .build();
    energyRange.setDataValidation(rule);

    sheet.activate();

    SpreadsheetApp.getUi().alert(
      '✅ Success',
      'Progress Tracker created! Log your workouts here.',
      SpreadsheetApp.getUi().ButtonSet.OK
    );

  } catch (error) {
    SpreadsheetApp.getUi().alert(
      '❌ Error',
      `Failed to create tracker: ${error.message}`,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

// ========================================
// CUSTOMIZATION
// ========================================

/**
 * Shows dialog for customizing schedule times
 */
function showCustomizeDialog() {
  const html = HtmlService.createHtmlOutput(`
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      .form-group { margin-bottom: 15px; }
      label { display: block; font-weight: bold; margin-bottom: 5px; }
      input, select { width: 100%; padding: 8px; box-sizing: border-box; }
      button { background: #4285f4; color: white; border: none; padding: 10px 20px; cursor: pointer; border-radius: 4px; }
      button:hover { background: #3367d6; }
    </style>

    <h2>⚙️ Customize Your Routine</h2>

    <div class="form-group">
      <label>Start Time:</label>
      <input type="time" id="startTime" value="09:00">
    </div>

    <div class="form-group">
      <label>Interval (minutes):</label>
      <input type="number" id="interval" value="60" min="15" max="180">
    </div>

    <div class="form-group">
      <label>Number of Sessions:</label>
      <input type="number" id="sessions" value="6" min="3" max="12">
    </div>

    <div class="form-group">
      <label>Routine Type:</label>
      <select id="routineType">
        <option value="core">Core Routine</option>
        <option value="fullbody">Full Body</option>
        <option value="stretching">Stretching</option>
        <option value="quick">Quick Breaks</option>
      </select>
    </div>

    <button onclick="applyCustomization()">Apply</button>

    <script>
      function applyCustomization() {
        const config = {
          startTime: document.getElementById('startTime').value,
          interval: parseInt(document.getElementById('interval').value),
          sessions: parseInt(document.getElementById('sessions').value),
          routineType: document.getElementById('routineType').value
        };
        google.script.run.withSuccessHandler(() => {
          alert('Settings applied! Generate your routine from the menu.');
          google.script.host.close();
        }).applyCustomSettings(config);
      }
    </script>
  `)
  .setWidth(400)
  .setHeight(400);

  SpreadsheetApp.getUi().showModalDialog(html, 'Customize Schedule');
}

/**
 * Applies custom settings (placeholder for future implementation)
 */
function applyCustomSettings(config) {
  // Store in document properties for future use
  const props = PropertiesService.getDocumentProperties();
  props.setProperty('CUSTOM_START_TIME', config.startTime);
  props.setProperty('CUSTOM_INTERVAL', config.interval.toString());
  props.setProperty('CUSTOM_SESSIONS', config.sessions.toString());
  props.setProperty('CUSTOM_ROUTINE', config.routineType);
}

// ========================================
// EXPORT TO PDF
// ========================================

/**
 * Exports active sheet to PDF
 */
function exportToPDF() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    const ui = SpreadsheetApp.getUi();

    const url = `https://docs.google.com/spreadsheets/d/${ss.getId()}/export?format=pdf&gid=${sheet.getSheetId()}&portrait=false&fitw=true`;

    const html = `
      <p>Your routine is ready to export!</p>
      <p><a href="${url}" target="_blank">Click here to download PDF</a></p>
      <p><em>The PDF will open in a new window.</em></p>
    `;

    const htmlOutput = HtmlService.createHtmlOutput(html)
      .setWidth(400)
      .setHeight(150);

    ui.showModalDialog(htmlOutput, '📄 Export to PDF');

  } catch (error) {
    SpreadsheetApp.getUi().alert(
      '❌ Error',
      `Failed to export: ${error.message}`,
      SpreadsheetApp.getUi().ButtonSet.OK
    );
  }
}

// ========================================
// HELP
// ========================================

/**
 * Shows help dialog
 */
function showHelp() {
  const html = HtmlService.createHtmlOutput(`
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
      h2 { color: #4285f4; }
      .section { margin-bottom: 20px; }
      code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
    </style>

    <h2>🏃 Exercise Routine Generator - Help</h2>

    <div class="section">
      <h3>Available Routines</h3>
      <ul>
        <li><strong>Core Routine:</strong> Focuses on core strength and spinal health</li>
        <li><strong>Full Body:</strong> Complete workout for all major muscle groups</li>
        <li><strong>Stretching:</strong> Flexibility and mobility work</li>
        <li><strong>Quick Breaks:</strong> Fast 5-minute hourly breaks</li>
      </ul>
    </div>

    <div class="section">
      <h3>How to Use</h3>
      <ol>
        <li>Click <code>Exercise Routines</code> menu at top</li>
        <li>Select your desired routine</li>
        <li>A new sheet will be created with your schedule</li>
        <li>Use Progress Tracker to log your workouts</li>
        <li>Customize times using the Settings option</li>
      </ol>
    </div>

    <div class="section">
      <h3>Tips</h3>
      <ul>
        <li>Set phone reminders for each time block</li>
        <li>Start with Quick Breaks if you're new to desk exercises</li>
        <li>Mix routines throughout the week for variety</li>
        <li>Track your energy levels to find optimal times</li>
      </ul>
    </div>

    <div class="section">
      <h3>Features</h3>
      <ul>
        <li>🎨 Color-coded intensity levels</li>
        <li>📊 Progress tracking</li>
        <li>⚙️ Customizable schedules</li>
        <li>📄 PDF export for printing</li>
      </ul>
    </div>
  `)
  .setWidth(500)
  .setHeight(600);

  SpreadsheetApp.getUi().showModalDialog(html, 'Help & Instructions');
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Calculates time blocks based on start time and interval
 * @param {string} startTime - Start time in HH:MM format
 * @param {number} intervalMinutes - Minutes between blocks
 * @param {number} numBlocks - Number of time blocks
 * @returns {Array} Array of time strings
 */
function generateTimeBlocks(startTime, intervalMinutes, numBlocks) {
  const times = [];
  const [hours, minutes] = startTime.split(':').map(Number);
  let currentTime = new Date();
  currentTime.setHours(hours, minutes, 0, 0);

  for (let i = 0; i < numBlocks; i++) {
    const timeStr = Utilities.formatDate(currentTime, Session.getScriptTimeZone(), 'HH:mm');
    times.push(timeStr);
    currentTime = new Date(currentTime.getTime() + intervalMinutes * 60000);
  }

  return times;
}

/**
 * Gets custom settings or returns defaults
 * @returns {Object} Configuration object
 */
function getCustomSettings() {
  const props = PropertiesService.getDocumentProperties();
  return {
    startTime: props.getProperty('CUSTOM_START_TIME') || CONFIG.DEFAULT_START_TIME,
    interval: parseInt(props.getProperty('CUSTOM_INTERVAL')) || CONFIG.DEFAULT_INTERVAL,
    sessions: parseInt(props.getProperty('CUSTOM_SESSIONS')) || 6,
    routineType: props.getProperty('CUSTOM_ROUTINE') || 'core'
  };
}
