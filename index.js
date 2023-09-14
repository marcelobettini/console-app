const readlineSync = require("readline-sync");
const crypto = require("crypto");
// Initialize an array to store records
const records = [];

// Define menu options
const menuOptions = [
  "Create Record",
  "Read Records",
  "Update Record",
  "Delete Record",
];

function main() {
  //infinite loop to display menu between operations
  while (true) {
    console.clear();
    const choice = readlineSync.keyInSelect(menuOptions);
    switch (choice) {
      case 0:
        createRecord();
        break;
      case 1:
        readRecords();
        break;
      case 2:
        updateRecord();
        break;
      case 3:
        deleteRecord();
        break;
      default:
        console.clear();
        console.log(`
      -------------
      |           |
      | GOOD BYE! | 
      |  SEE YOU  |
      |   LATER   |
      |           |
      -------------
      `);
        return;
    }
  }
}

function createRecord() {
  const title = readlineSync.question("Enter title: ");
  const artist = readlineSync.question("Enter artist: ");
  const year = readlineSync.question("Enter year: ");
  const recordLabel = readlineSync.question("Enter record label: ");

  const id = generateUniqueId();
  records.push({ id, title, artist, year, recordLabel });
  console.log("Record created successfully.\n");

  // Pause to display success message
  readlineSync.keyInPause("\n");
}

function generateUniqueId() {
  return crypto.randomUUID();
}

function readRecords() {
  console.log("===== Records =====\n");
  if (records.length === 0) {
    console.log("No records found.\n");
  } else {
    records.forEach((record) => {
      console.log(`ID: ${record.id}`);
      console.log(`Title: ${record.title}`);
      console.log(`Artist: ${record.artist}`);
      console.log(`Year: ${record.year}`);
      console.log(`Record Label: ${record.recordLabel}`);
      console.log("---\n");
    });
  }

  // Pause to display records
  readlineSync.keyInPause("\n");
}

function updateRecord() {
  console.log("===== Update Record =====\n");
  const idToUpdate = readlineSync.question(
    "Enter the ID of the record to update: "
  );
  const recordToUpdate = records.find((record) => record.id === idToUpdate);

  if (!recordToUpdate) {
    console.log("Record not found.\n");
  } else {
    // Helper function to update a field or keep the previous value
    function updateField(fieldName, currentValue) {
      const newValue = readlineSync.question(
        `Enter new ${fieldName} (${currentValue}): `
      );
      return newValue.trim() ? newValue : currentValue;
    }

    recordToUpdate.title = updateField("title", recordToUpdate.title);
    recordToUpdate.artist = updateField("artist", recordToUpdate.artist);
    recordToUpdate.year = updateField("year", recordToUpdate.year);
    recordToUpdate.recordLabel = updateField(
      "record label",
      recordToUpdate.recordLabel
    );

    console.log("Record updated successfully.\n");
  }

  // Pause to display success message
  readlineSync.keyInPause("\n");
}

function deleteRecord() {
  console.log("===== Delete Record =====\n");
  const idToDelete = readlineSync.question(
    "Enter the ID of the record to delete: "
  );
  const recordIndex = records.findIndex((record) => record.id === idToDelete);

  if (recordIndex !== -1) {
    const recordToDelete = records[recordIndex]; // Capture the record to be deleted

    const confirmation = readlineSync.keyInYN(
      `Do you want to delete the record: ${recordToDelete.title} by ${recordToDelete.artist}? (Y/N) 
      //`
    );
    if (confirmation) {
      // User confirmed, so delete the record
      records.splice(recordIndex, 1);
      console.log("Record deleted successfully.\n");
      console.log(
        `Deleted Record: ${recordToDelete.title} by ${recordToDelete.artist}`
      );
    } else {
      console.log("Deletion canceled. Record not removed.\n");
    }
  } else {
    console.log("Record not found.\n");
  }

  // Pause to display the result
  readlineSync.keyInPause("\n");
}

// Start the application
main();
