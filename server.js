//Require Dependencies

const fs = require('fs');
const path = require('path');
const express = require('express');

//Express app initialization
const PORT = process.env.PORT || 3001;
const app = express();

//setup notes variable
const allNotes = require('./db/db.json');

//setup data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//Setup the /api/notes get route
app.get('/api/notes', (req, res) => {
    res.json(allNotes.slice(1));
});

// Display index.html when all /index is pass
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//Display notes.html when all /notes is accessed
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

// Display index.html when all other routes are accessed
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//This function will create the notes with specific id
function createNewNote(body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray))
        notesArray = [];
    
    if (notesArray.length === 0)
        notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}

 // Setup the /api/notes post route
app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, allNotes);
    res.json(newNote);
});

//This function delete a note with the specific id
function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );

            break;
        }
    }
}

 // Setup the /api/notes delete route
app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, allNotes);
    res.json(true);
});

// Setup listener
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT} 🚀`)
);