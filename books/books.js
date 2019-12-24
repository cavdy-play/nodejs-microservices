const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Book = require('./models/Book');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

mongoose.connect(
  'mongodb://admin:password123@ds257648.mlab.com:57648/book-services',
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
  () => console.log('db connected')
);

app.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'This is our main endpoint'
  });
});

app.post('/book', async (req, res) => {
  try {
    const { title, author, numberPages, publisher } = req.body;
    const createBook = await new Book({
      title,
      author,
      numberPages,
      publisher
    });
    createBook.save();

    res.status(201).json({
      status: 201,
      message: 'Book Added',
      data: createBook
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong'
    });
  }
});

app.get('/book/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);

    res.status(201).json({
      status: 201,
      message: 'Get Book',
      data: book
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong'
    });
  }
});

app.get('/books', async (req, res) => {
  try {
    const allBooks = await Book.find({});
    res.status(200).json({
      status: 200,
      message: 'All Books',
      data: allBooks
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong'
    });
  }
});

app.delete('/book/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;
    const deleteBook = await Book.findOneAndRemove(bookId);
    deleteBook.save();

    res.status(200).json({
      status: 200,
      message: 'Book deleted'
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      status: 500,
      message: 'Something went wrong'
    });
  }
});

app.listen(PORT, () => console.log(`Books server started at port: ${PORT}`));
