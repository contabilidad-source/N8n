/**
 * Enhanced Office Exercise Routine Generator
 * Google Apps Script for creating customizable exercise schedules in Sheets
 *
 * Features:
 * - Multiple routine types (Core, Full Body, Stretching, Quick Breaks)
 * - Each exercise in separate row for easy tracking
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
    ALT_ROW: '#f8f9fa',
    TIME_BLOCK_BORDER: '#cccccc'
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
        exercises: [
          {
            name: "Seated Pelvic Tilts",
            sets: "10 tilts",
            explanation: "Activate deep core and establish neutral pelvic position.",
            intensity: "Low"
          },
          {
            name: "Braced Belly Breathing",
            sets: "5 breaths",
            explanation: "Engage transverse abdominis while maintaining breathing.",
            intensity: "Low"
          },
          {
            name: "Scapular Setting",
            sets: "5 × 5s holds",
            explanation: "Set shoulder blades to support upper back posture.",
            intensity: "Low"
          }
        ]
      },
      {
        time: "10:00",
        exercises: [
          {
            name: "Chair Leg Raises",
            sets: "3 × 10",
            explanation: "Strengthen lower abs while maintaining neutral spine.",
            intensity: "Medium"
          },
          {
            name: "Standing Desk Plank Press",
            sets: "2 × 30s",
            explanation: "Build core endurance in anti-extension position.",
            intensity: "Medium"
          },
          {
            name: "Wall Angels",
            sets: "10 reps",
            explanation: "Strengthen upper back while opening chest.",
            intensity: "Low"
          }
        ]
      },
      {
        time: "11:00",
        exercises: [
          {
            name: "Doorway Chest Stretch",
            sets: "2 × 30s each",
            explanation: "Open pectoral muscles shortened by desk posture.",
            intensity: "Low"
          },
          {
            name: "Thoracic Extension over Chair",
            sets: "8 reps",
            explanation: "Restore upper spine extension to counter slouching.",
            intensity: "Low"
          }
        ]
      },
      {
        time: "13:00",
        exercises: [
          {
            name: "Standing Knee-to-Elbow Crunches",
            sets: "15 each side",
            explanation: "Train obliques for rotational core control.",
            intensity: "Medium"
          },
          {
            name: "Bird-Dog at Desk",
            sets: "8 each side",
            explanation: "Build anti-rotation strength and glute stability.",
            intensity: "Medium"
          },
          {
            name: "Hip Flexor Stretch",
            sets: "2 × 30s each",
            explanation: "Release tight hip flexors from prolonged sitting.",
            intensity: "Low"
          }
        ]
      },
      {
        time: "15:00",
        exercises: [
          {
            name: "Scapular Setting",
            sets: "5 × 5s holds",
            explanation: "Re-activate upper back after afternoon fatigue.",
            intensity: "Low"
          },
          {
            name: "Doorway Stretch",
            sets: "30s",
            explanation: "Second chest opening to maintain posture.",
            intensity: "Low"
          },
          {
            name: "Seated Twist",
            sets: "5 each side",
            explanation: "Restore thoracic rotation for spinal health.",
            intensity: "Low"
          }
        ]
      },
      {
        time: "16:00",
        exercises: [
          {
            name: "Chair Leg Raises",
            sets: "3 × 12",
            explanation: "End-of-day core endurance work.",
            intensity: "Medium"
          },
          {
            name: "Standing Desk Plank Press",
            sets: "45s",
            explanation: "Final anti-extension hold to finish strong.",
            intensity: "Medium"
          },
          {
            name: "Braced Breathing",
            sets: "5 breaths",
            explanation: "Calm nervous system and reset breathing pattern.",
            intensity: "Low"
          }
        ]
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
        exercises: [
          {
            name: "Desk Push-ups",
            sets: "3 × 10",
            explanation: "Wake up chest, shoulders, and triceps.",
            intensity: "Medium"
          },
          {
            name: "Chair Squats",
            sets: "3 × 15",
            explanation: "Activate legs and glutes for the day.",
            intensity: "Medium"
          },
          {
            name: "Arm Circles",
            sets: "10 each direction",
            explanation: "Mobilize shoulders and upper back.",
            intensity: "Low"
          }
        ]
      },
      {
        time: "10:30",
        exercises: [
          {
            name: "Wall Sits",
            sets: "3 × 30s",
            explanation: "Build leg endurance and mental toughness.",
            intensity: "High"
          },
          {
            name: "Tricep Dips on Chair",
            sets: "3 × 12",
            explanation: "Strengthen back of arms.",
            intensity: "Medium"
          },
          {
            name: "Calf Raises",
            sets: "3 × 20",
            explanation: "Strengthen lower legs and improve circulation.",
            intensity: "Low"
          }
        ]
      },
      {
        time: "12:00",
        exercises: [
          {
            name: "Standing Lunges",
            sets: "3 × 10 each",
            explanation: "Unilateral leg work for balance and strength.",
            intensity: "Medium"
          },
          {
            name: "Desk Rows",
            sets: "3 × 15",
            explanation: "Pull movement to counter pushing and slouching.",
            intensity: "Medium"
          },
          {
            name: "Shoulder Shrugs",
            sets: "3 × 15",
            explanation: "Strengthen upper traps and release tension.",
            intensity: "Low"
          }
        ]
      },
      {
        time: "14:00",
        exercises: [
          {
            name: "Seated Leg Extensions",
            sets: "3 × 12 each",
            explanation: "Isolate and strengthen quadriceps.",
            intensity: "Low"
          },
          {
            name: "Wall Push-ups",
            sets: "3 × 12",
            explanation: "Lighter push variation for post-lunch energy.",
            intensity: "Low"
          },
          {
            name: "Neck Rolls",
            sets: "5 each direction",
            explanation: "Release neck tension accumulated during morning.",
            intensity: "Low"
          }
        ]
      },
      {
        time: "15:30",
        exercises: [
          {
            name: "Chair Squats",
            sets: "3 × 20",
            explanation: "Second leg session for endurance.",
            intensity: "High"
          },
          {
            name: "Desk Plank",
            sets: "2 × 45s",
            explanation: "Core stability to finish the afternoon strong.",
            intensity: "High"
          },
          {
            name: "Wrist Circles",
            sets: "10 each direction",
            explanation: "Prevent repetitive strain from typing.",
            intensity: "Low"
          }
        ]
      },
      {
        time: "17:00",
        exercises: [
          {
            name: "Standing Quad Stretch",
            sets: "2 × 30s each",
            explanation: "Release quadriceps after leg work.",
            intensity: "Low"
          },
          {
            name: "Chest Doorway Stretch",
            sets: "2 × 30s",
            explanation: "Open chest to restore posture.",
            intensity: "Low"
          },
          {
            name: "Deep Breathing",
            sets: "5 breaths",
            explanation: "Cool down and transition out of work mode.",
            intensity: "Low"
          }
        ]
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
        exercises: [
          {
            name: "Neck Stretches - Forward",
            sets: "30s",
            explanation: "Release tension in back of neck.",
            intensity: "Low"
          },
          {
            name: "Neck Stretches - Sides",
            sets: "30s each",
            explanation: "Stretch lateral neck muscles.",
            intensity: "Low"
          },
          {
            name: "Shoulder Rolls",
            sets: "10 forward, 10 back",
            explanation: "Mobilize shoulder girdle.",
            intensity: "Low"
          }
        ]
      },
      {
        time: "10:30",
        exercises: [
          {
            name: "Seated Spinal Twist",
            sets: "30s each side",
            explanation: "Restore thoracic rotation.",
            intensity: "Low"
          },
          {
            name: "Side Bends",
            sets: "10 each",
            explanation: "Stretch lateral chain and improve side mobility.",
            intensity: "Low"
          },
          {
            name: "Standing Cat-Cow",
            sets: "10 reps",
            explanation: "Mobilize entire spine through flexion/extension.",
            intensity: "Low"
          }
        ]
      },
      {
        time: "12:00",
        exercises: [
          {
            name: "Hip Flexor Stretch",
            sets: "45s each side",
            explanation: "Release psoas shortened by sitting.",
            intensity: "Low"
          },
          {
            name: "Hamstring Stretch",
            sets: "45s each",
            explanation: "Lengthen backs of legs.",
            intensity: "Low"
          },
          {
            name: "Calf Stretch",
            sets: "30s each",
            explanation: "Release lower leg tension.",
            intensity: "Low"
          }
        ]
      },
      {
        time: "14:00",
        exercises: [
          {
            name: "Doorway Chest Stretch",
            sets: "45s",
            explanation: "Open pectorals shortened by desk posture.",
            intensity: "Low"
          },
          {
            name: "Tricep Stretch",
            sets: "30s each",
            explanation: "Stretch back of arms.",
            intensity: "Low"
          },
          {
            name: "Wrist Flexor Stretch",
            sets: "30s each",
            explanation: "Prevent carpal tunnel syndrome.",
            intensity: "Low"
          }
        ]
      },
      {
        time: "15:30",
        exercises: [
          {
            name: "Figure-4 Glute Stretch",
            sets: "45s each",
            explanation: "Deep hip external rotator release.",
            intensity: "Low"
          },
          {
            name: "IT Band Stretch",
            sets: "30s each",
            explanation: "Release lateral thigh tension.",
            intensity: "Low"
          },
          {
            name: "Ankle Circles",
            sets: "10 each direction",
            explanation: "Maintain ankle mobility.",
            intensity: "Low"
          }
        ]
      },
      {
        time: "17:00",
        exercises: [
          {
            name: "Full Body Reach",
            sets: "5 reps",
            explanation: "Decompress spine with overhead reach.",
            intensity: "Low"
          },
          {
            name: "Gentle Backbend",
            sets: "30s hold",
            explanation: "Counter forward flexion from entire day.",
            intensity: "Low"
          },
          {
            name: "Forward Fold",
            sets: "60s hold",
            explanation: "Full posterior chain release to end day.",
            intensity: "Low"
          }
        ]
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
        time: "Minute 1",
        exercises: [
          {
            name: "Stand and Walk in Place",
            sets: "60 seconds",
            explanation: "Get blood flowing and break static posture.",
            intensity: "Low"
          }
        ]
      },
      {
        time: "Minute 2",
        exercises: [
          {
            name: "Desk Push-ups",
            sets: "10-15 reps",
            explanation: "Quick upper body activation.",
            intensity: "Medium"
          },
          {
            name: "Wall Push-ups (alternative)",
            sets: "10-15 reps",
            explanation: "Easier variation if desk push-ups too difficult.",
            intensity: "Low"
          }
        ]
      },
      {
        time: "Minute 3",
        exercises: [
          {
            name: "Chair Squats",
            sets: "15 reps",
            explanation: "Activate legs and glutes.",
            intensity: "Medium"
          }
        ]
      },
      {
        time: "Minute 4",
        exercises: [
          {
            name: "Standing Torso Twists",
            sets: "20 total (10 each)",
            explanation: "Restore spinal rotation.",
            intensity: "Low"
          },
          {
            name: "Shoulder Rolls",
            sets: "10 each direction",
            explanation: "Release shoulder tension.",
            intensity: "Low"
          }
        ]
      },
      {
        time: "Minute 5",
        exercises: [
          {
            name: "Arm Circles",
            sets: "10 each direction",
            explanation: "Mobilize shoulders.",
            intensity: "Low"
          },
          {
            name: "Deep Breathing",
            sets: "5 breaths",
            explanation: "Reset nervous system.",
            intensity: "Low"
          },
          {
            name: "Neck Stretches",
            sets: "30s",
            explanation: "Release neck tension to complete break.",
            intensity: "Low"
          }
        ]
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

    // Build data array with individual exercises per row
    const data = [
      ["Time", "Exercise", "Sets × Reps / Duration", "Explanation", "Intensity"]
    ];

    // Track time block boundaries for formatting
    const timeBlockStarts = [];

    routineData.blocks.forEach((block, blockIndex) => {
      block.exercises.forEach((exercise, exerciseIndex) => {
        // Only show time for first exercise of each time block
        const timeValue = exerciseIndex === 0 ? block.time : "";

        // Mark where each time block starts (for border formatting)
        if (exerciseIndex === 0) {
          timeBlockStarts.push(data.length);
        }

        data.push([
          timeValue,
          exercise.name,
          exercise.sets,
          exercise.explanation,
          exercise.intensity
        ]);
      });
    });

    // Write data
    const dataRange = sheet.getRange(1, 1, data.length, data[0].length);
    dataRange.setValues(data);

    // Apply formatting
    formatRoutineSheet(sheet, data.length, routineData, timeBlockStarts);

    // Add description at top
    sheet.insertRowBefore(1);
    sheet.getRange(1, 1, 1, data[0].length).merge()
      .setValue(`📌 ${routineData.description}`)
      .setBackground('#fff3cd')
      .setFontWeight('bold')
      .setFontSize(11)
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
 * @param {number} rows - Number of data rows (including header)
 * @param {Object} routineData - Routine data for context
 * @param {Array} timeBlockStarts - Row indices where time blocks start
 */
function formatRoutineSheet(sheet, rows, routineData, timeBlockStarts) {
  const numCols = 5;

  // Header formatting (row 2 after description)
  const headerRange = sheet.getRange(2, 1, 1, numCols);
  headerRange.setBackground(CONFIG.COLORS.HEADER)
    .setFontColor(CONFIG.COLORS.HEADER_TEXT)
    .setFontWeight('bold')
    .setFontSize(10)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  // Freeze header rows (description + header)
  sheet.setFrozenRows(2);

  // Time column formatting (only cells with time values)
  for (let i = 3; i <= rows + 1; i++) {
    const timeCell = sheet.getRange(i, 1);
    if (timeCell.getValue() !== "") {
      timeCell.setBackground(CONFIG.COLORS.TIME_COL)
        .setFontWeight('bold')
        .setHorizontalAlignment('center')
        .setVerticalAlignment('top');
    }
  }

  // Alternating row colors for time blocks
  let currentBlockColor = false;
  for (let i = 0; i < timeBlockStarts.length; i++) {
    const startRow = timeBlockStarts[i] + 2; // +2 because of description row and 0-based index
    const endRow = (i < timeBlockStarts.length - 1) ? timeBlockStarts[i + 1] + 1 : rows + 1;

    if (currentBlockColor) {
      for (let row = startRow; row <= endRow; row++) {
        sheet.getRange(row, 2, 1, numCols - 1).setBackground(CONFIG.COLORS.ALT_ROW);
      }
    }
    currentBlockColor = !currentBlockColor;
  }

  // Intensity column conditional formatting
  const intensityRange = sheet.getRange(3, 5, rows - 1, 1);
  intensityRange.setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

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
  sheet.setColumnWidth(2, 250);  // Exercise
  sheet.setColumnWidth(3, 180);  // Sets/Reps
  sheet.setColumnWidth(4, 350);  // Explanation
  sheet.setColumnWidth(5, 90);   // Intensity

  // Set row heights
  sheet.setRowHeight(2, 35); // Header
  for (let i = 3; i <= rows + 1; i++) {
    sheet.setRowHeight(i, 50); // Data rows
  }

  // Add borders
  const allDataRange = sheet.getRange(2, 1, rows, numCols);
  allDataRange.setBorder(true, true, true, true, true, true, '#000000', SpreadsheetApp.BorderStyle.SOLID);

  // Add thicker borders between time blocks
  timeBlockStarts.forEach((blockStart, index) => {
    if (index > 0) { // Skip first block
      const rowNum = blockStart + 2; // +2 for description row and header
      const blockBorderRange = sheet.getRange(rowNum, 1, 1, numCols);
      blockBorderRange.setBorder(true, null, null, null, null, null, CONFIG.COLORS.TIME_BLOCK_BORDER, SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
    }
  });

  // Text wrapping and alignment
  sheet.getRange(2, 1, rows, numCols).setWrap(true);
  sheet.getRange(3, 2, rows - 1, 1).setHorizontalAlignment('left').setVerticalAlignment('middle'); // Exercise names
  sheet.getRange(3, 3, rows - 1, 1).setHorizontalAlignment('center').setVerticalAlignment('middle'); // Sets/Reps
  sheet.getRange(3, 4, rows - 1, 1).setHorizontalAlignment('left').setVerticalAlignment('middle'); // Explanations
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
    const headers = ['Date', 'Time', 'Routine Type', 'Exercise', 'Completed', 'Notes', 'Energy Level (1-10)'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Add sample data for demonstration
    const today = new Date();
    const sampleData = [
      [today, '09:00', 'Core Routine', 'Seated Pelvic Tilts', '✓', 'Felt good!', 8],
      [today, '09:00', 'Core Routine', 'Braced Belly Breathing', '✓', '', 8],
      [today, '10:00', 'Core Routine', 'Chair Leg Raises', '✓', 'Challenging', 7]
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

    // Format date column
    sheet.getRange(2, 1, 1000, 1).setNumberFormat('yyyy-mm-dd');

    // Add data validation for Energy Level
    const energyRange = sheet.getRange(2, 7, 1000, 1);
    const rule = SpreadsheetApp.newDataValidation()
      .requireNumberBetween(1, 10)
      .setAllowInvalid(false)
      .setHelpText('Enter a number between 1 and 10')
      .build();
    energyRange.setDataValidation(rule);

    // Add checkbox for Completed column
    const completedRange = sheet.getRange(2, 5, 1000, 1);
    const checkboxRule = SpreadsheetApp.newDataValidation()
      .requireCheckbox()
      .build();
    completedRange.setDataValidation(checkboxRule);

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
        <li>Each exercise appears on its own row for easy tracking</li>
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
        <li>Check off exercises as you complete them</li>
      </ul>
    </div>

    <div class="section">
      <h3>Features</h3>
      <ul>
        <li>🎨 Color-coded intensity levels</li>
        <li>📋 Individual row per exercise</li>
        <li>📊 Progress tracking with checkboxes</li>
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
