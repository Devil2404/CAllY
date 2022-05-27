const express = require('express');
const router = express.Router();
const Note = require('../module/Note');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const Trash = require('../module/Trash');


//1) rote to fetch all notes from the database login required
router.get('/fetchnotes', fetchuser, async (req, res) => {

    try {
        const notes = await Note.find({ user: req.user.id });
        res.status(200).json(notes);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Sever Occured");
    }
})

//2) route to add notes from the user login required
router.post('/addnote', fetchuser,
    [
        body('title', 'Enter a valid title ').isLength({ min: 5 }),
        body('description', 'Enter a valid description').isLength({ min: 12 })
    ],

    async (req, res) => {
        try {
            const errors = validationResult(req);
            //error checking 
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { title, description, category } = req.body;
            const note = new Note({
                title, description, category, user: req.user.id
            })
            const savenotes = await note.save();
            res.status(200).json(savenotes);
        } catch (error) {
            console.log(error);
            res.status(500).send("Internal Sever Occured");
        }

    })


//3) route to update the note login required
router.post('/updatenote/:id', fetchuser, async (req, res) => {

    try {
        const { title, description, category } = req.body;
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (category) { newNote.category = category };

        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not found"); }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.status(200).json(note);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Sever Occured");
    }

})

//4) route to  delete the note login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {

        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not found"); }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }
        const { title, description, category, user } = note;

        let deletenote = new Trash({
            title, description, category, user
        });

        const deleten = await deletenote.save();
        note = await Note.findByIdAndDelete(req.params.id);
        res.status(200).json({ note: note, deletenote: deleten });
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Sever Occured");
    }

});


//5) route for back to the deleted note from trash
router.delete('/trashnoteadd/:id', fetchuser, async (req, res) => {
    try {

        let deletenote = await Trash.findById(req.params.id);
        if (!deletenote) { return res.status(404).send("Not found"); }

        if (deletenote.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }
        const { title, description, category, user } = deletenote;

        let returnnote = new Note({
            title, description, category, user
        });

        const rnote = await returnnote.save();
        deletenote = await Trash.findByIdAndDelete(req.params.id);
        res.status(200).send("Your notes is restored succefully");
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Sever Occured");
    }
});


//6)all deleted notes displaying login required
router.get('/fetchalldnotes', fetchuser, async (req, res) => {
    try {
        const dnotes = await Trash.find({ user: req.user.id });
        res.status(200).json(dnotes);
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Sever Occured");
    }
});

//7) delete the notes in restore area login required
router.delete('/deletednote/:id', fetchuser, async (req, res) => {
    try {

        let dnote = await Trash.findById(req.params.id);
        if (!dnote) { return res.status(404).send("Not found") }
        if (dnote.user.toString() !== req.user.id) {
            return res.status(401).send("Not allowed");
        }
        dnote = await Trash.findByIdAndDelete(req.params.id);
        res.status(200).json("Your note is deleted succefully");
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Sever Occured");
    }

})


module.exports = router;