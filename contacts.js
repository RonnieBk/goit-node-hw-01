const fs = require("fs").promises;
const path = require("path");
const { nanoid } = require("nanoid");
require("colors");

const contactsPath = path.join(__dirname, "db", "contacts.json");

function listContacts() {
  fs.readFile(contactsPath)
    .then((data) => JSON.parse(data))
    .then((contacts) => console.table(contacts))
    .catch((err) => console.log(err.message));
}

function getContactById(contactId) {
  fs.readFile(contactsPath)
    .then((data) => JSON.parse(data))
    .then((contacts) => {
      const contactToFind = contacts.find(
        (contact) => contact.id === contactId
      );
      if (!contactToFind) {
        throw new Error("Contact cannot be found!".bgMagenta);
      } else return contactToFind;
    })
    .then((selectedContact) =>
      console.log("Found contact: ".bgYellow, selectedContact)
    )
    .catch((err) => console.log(err.message));
}

function removeContact(contactId) {
  fs.readFile(contactsPath)
    .then((data) => JSON.parse(data))
    .then((contacts) => contacts.filter((contact) => contact.id !== contactId))
    .then((updatedList) => {
      fs.writeFile(contactsPath, JSON.stringify(updatedList, null, 1));
      console.log("Contact has been successfully removed!".bgYellow);
      console.table(updatedList);
    })
    .catch((err) => console.log(err.message));
}

function addContact(name, email, phone) {
  const newContact = { id: nanoid(), name, email, phone };

  fs.readFile(contactsPath)
    .then((data) => JSON.parse(data))
    .then((contacts) => {
      if (contacts.find((contact) => contact.name === name)) {
        throw new Error(`${name} is already in contacts!`.bgMagenta);
      } else return [...contacts, newContact];
    })
    .then((updatedList) => {
      fs.writeFile(contactsPath, JSON.stringify(updatedList, null, 1));
      console.log(`${name} has been added to contacts!`.bgYellow);
      console.table(updatedList);
    })
    .catch((error) => console.log(error.message));
}

module.exports = { listContacts, getContactById, removeContact, addContact };
