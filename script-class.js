// Book class
class Book {
    constructor(title, author, date, isbn) {
        this.title = title;
        this.author = author;
        this.date = date;
        this.isbn = isbn;
    }
}

// UI Class: Handles UI
class UI {
    static displayBooks() {
        

        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.getElementById('book-list');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.date}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn delete" ><i class='bx bx-x delete'></i></a></td>
        `;
        list.appendChild(row);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#date').value = '';
        document.querySelector('#isbn').value = '';
    }

    static deleteBook(el) {
        if (el.classList.contains('delete')) {
            // Get the ISBN from the data attribute
            const isbn = el.getAttribute('data-isbn');
            
            // Remove the book from the UI
            el.closest('tr').remove();
            
            // Remove the book from the Store
            // Store.removeBook(isbn);
        }
    }
    
}


class Store {
   
    static getBooks(){
        
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));

        }

        return books;
    }
   
    static addBook(book){
        const books = Store.getBooks()
        books.push(book)
        localStorage.setItem('books', JSON.stringify(books));
    }
   
    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1); // Corrected the typo
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
        
        Validation.removedToast()
    }
    
}










// Event: Display Books
export const display = document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // Select the input elements
const titleInput = document.querySelector('#title');
const authorInput = document.querySelector('#author');
const dateInput = document.querySelector('#date');
const isbnInput = document.querySelector('#isbn');

// Get their values
const title = titleInput.value;
const author = authorInput.value;
const date = dateInput.value;
const isbn = isbnInput.value;

// Check if any fields are empty
if (title === '' || author === '' || date === '' || isbn === '') {
    Validation.failedToast();

    // Apply red outline to empty input fields
    if (title === '') {titleInput.style.outline = '2px solid red'}else{titleInput.style.outline = '2px solid #4caf50'}

    if (author === '') {authorInput.style.outline = '2px solid red'}else{authorInput.style.outline = '2px solid #4caf50'}

    if (date === '') {dateInput.style.outline = '2px solid red'}else{dateInput.style.outline = '2px solid #4caf50'}

    if (isbn === '') {isbnInput.style.outline = '2px solid red'}else{isbnInput.style.outline = '2px solid #4caf50'}



} else {
    // Create a new book
    const book = new Book(title, author, date, isbn);

    // Add book to UI
    UI.addBookToList(book);

    Store.addBook(book)
    // Show success toast
    Validation.successToast();

    // Clear input fields
    UI.clearFields();

    // Optionally, remove the outline after clearing the fields
    titleInput.style.outline = '';
    authorInput.style.outline = '';
    dateInput.style.outline = '';
    isbnInput.style.outline = '';
}

});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    UI.deleteBook(e.target);
    // console.log(e.target)
    Store.removeBook(e.target.parentElement.parentElement.previousElementSibling.textContent)
});
 
// Validation Class for Toast Alerts
class Validation {
    static showToast(message, type) {
        const toastContainer = document.querySelector('.toast');
        const closeIcon = document.createElement('i');
        closeIcon.classList.add('bx', 'bx-x', 'xbtn');
    
        if (toastContainer) {
            // Define icon color class
            const iconClass = type === 'success' ? 'success-icon' : 'failure-icon';
            
            // Clear previous content and add new content
            toastContainer.innerHTML = `
                <div class="toast-content">
                    <i class='bx bx-${type === 'success' ? 'check' : 'x'} ${iconClass}'></i>
                    <div class="message">
                        <span class="text text1">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                        <span class="text text2">${message}</span>
                    </div>
                </div>
                <div class="progress"></div>
            `;
            toastContainer.appendChild(closeIcon);
    
            // Remove any previous type-specific class
            toastContainer.classList.remove('success', 'failure');
            
            // Add the appropriate class based on the type
            toastContainer.classList.add(type);
            toastContainer.classList.add('active');
    
            // Set a timeout to automatically remove the toast after 5 seconds
            setTimeout(() => {
                toastContainer.classList.remove('active');
            }, 5000);
    
            // Close the toast when the close icon is clicked
            closeIcon.addEventListener('click', () => {
                toastContainer.classList.remove('active');
            });
        } else {
            console.error("Toast container not found in the DOM.");
        }
    }

    static successToast() {
        this.showToast('Your new book has been added', 'success');
    }

    static removedToast(){  
        this.showToast('Removed succesfully', 'success')
    }
    static failedToast() {
        this.showToast('Please input all fields', 'failure');
    }
}
