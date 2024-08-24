import express from 'express';
import mongoose from 'mongoose';

const app = express();

const uri = 'mongodb+srv://ndelhi66:zxQDwUh7BKTn99LT@cluster0.vk87d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(uri)
    .then(() => console.log('MongoDB Connected.'))
    .catch(err => console.log(err));

app.use(express.json());

const BookSchema = new mongoose.Schema({
    title: {
        type: 'String',
        required: true
    },
},
    {
        timestamps: true
    }
);
const Book = mongoose.model('Book', BookSchema);

app.post('/create-book', async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json(book);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/get-books', async (req, res) => {
    try {
        const book = await Book.find();
        res.status(200).json(book);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/get-book/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json('Book not found');
        res.status(200).json(book);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/update-book/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body,
            { new: true, runValidators: true }
        );
        if (!book) return res.status(404).json('Book not found');
        res.status(200).json(book);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/delete-book/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) return res.status(404).json('Book not found');
        res.status(200).json(book);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
})

const PORT = 4000;
app.listen(PORT, () => console.log(`Server is running on port : ${PORT}`));