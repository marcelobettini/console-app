const readlineSync = require("readline-sync");
const crypto = require("crypto");
const fs = require("fs");

class Record {
  constructor(title, artist, year, recordLabel) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.artist = artist;
    this.year = year;
    this.recordLabel = recordLabel;
  }
}

class FileManager {
  static appendRecord(data) {
    try {
      fs.writeFileSync("./records.json", JSON.stringify(data), {
        encoding: "utf8",
      });
      console.log("Operation completed!\n");
    } catch (err) {
      console.log(`Unexpected Error: ${err} \n`);
    }
    // Pause to display success message
    readlineSync.keyInPause("\n");
  }
  static readRecords() {
    try {
      const records = fs.readFileSync("./records.json", { encoding: "utf-8" });
      return JSON.parse(records);
    } catch (err) {
      console.log("Unexpected Error:", err);
    }
    // Pause to display success message
    readlineSync.keyInPause("\n");
  }
}

class RecordManager {
  constructor() {
    this.records = [];
  }

  createRecord() {
    const title = readlineSync.question("Enter title: ");
    const artist = readlineSync.question("Enter artist: ");
    const year = readlineSync.question("Enter year: ");
    const recordLabel = readlineSync.question("Enter record label: ");

    const newRecord = new Record(title, artist, year, recordLabel);
    this.records.push(newRecord);
    FileManager.appendRecord(this.records);
  }

  readRecords() {
    const readResult = FileManager.readRecords();
    console.log(readResult);
    this.records = readResult;
    console.log("===== Records =====\n");
    if (this.records.length === 0) {
      console.log("No records found.\n");
    } else {
      this.records.forEach((record) => {
        console.log(`ID: ${record.id}`);
        console.log(`Title: ${record.title}`);
        console.log(`Artist: ${record.artist}`);
        console.log(`Year: ${record.year}`);
        console.log(`Record Label: ${record.recordLabel}`);
        console.log("---\n");
      });
    }
    // Pause to display success message
    readlineSync.keyInPause("\n");
  }

  updateRecord() {
    console.log("===== Update Record =====\n");
    const idToUpdate = readlineSync.question(
      "Enter the ID of the record to update: "
    );
    const recordToUpdate = this.records.find(
      (record) => record.id === idToUpdate
    );

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

      FileManager.appendRecord(this.records);
    }
  }

  deleteRecord() {
    console.log("===== Delete Record =====\n");
    const idToDelete = readlineSync.question(
      "Enter the ID of the record to delete: "
    );
    const recordIndex = this.records.findIndex(
      (record) => record.id === idToDelete
    );

    if (recordIndex !== -1) {
      const recordToDelete = this.records[recordIndex]; // Capture the record to be deleted

      const confirmation = readlineSync.keyInYN(
        `Do you want to delete the record: ${recordToDelete.title} by ${recordToDelete.artist}? (Y/N) 
      //`
      );
      if (confirmation) {
        // User confirmed, so delete the record
        this.records.splice(recordIndex, 1);
        FileManager.appendRecord(this.records);
      } else {
        console.log("Deletion canceled. Record not removed.\n");
      }
    } else {
      console.log("Record not found.\n");
    }

    // Pause to display the result
    readlineSync.keyInPause("\n");
  }

  start() {
    while (true) {
      console.clear();
      const choice = readlineSync.keyInSelect(menuOptions);
      switch (choice) {
        case 0:
          this.createRecord();
          break;
        case 1:
          this.readRecords();
          break;
        case 2:
          this.updateRecord();
          break;
        case 3:
          this.deleteRecord();
          break;
        default:
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
}

const menuOptions = [
  "Create Record",
  "Read Records",
  "Update Record",
  "Delete Record",
];

const recordManager = new RecordManager();
recordManager.start();
