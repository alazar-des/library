class Book {
  static #myLibrary = [];
  constructor(title, author, pages, status) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = status;
    this.insertionDate = new Date(Date.now());
    Book.#myLibrary.push(this);
  }

  static displayBooks() {
    Book.#myLibrary.forEach(book => book.addTableRow());
  }

  #deleteBook(table) {
    let index = Book.#myLibrary.indexOf(this);
    Book.#myLibrary.splice(index, 1);
    table.deleteRow(index + 1);
  }

  #addReadStatusButton(row) {
    let read = row.insertCell();
    let btn = document.createElement("button");
    btn.innerHTML = this.read == "read" ? "read" : "not read";
    btn.classList.add(this.read);
    btn.addEventListener('click', e => {
      this.read = this.read == "read" ? "not read" : "read";
      btn.innerHTML = this.read;
      btn.classList.toggle("notread");
      btn.classList.toggle("read");
    });
    read.appendChild(btn);
  }

  #addDeleteButton(table, row) {
    let dlt = row.insertCell();
    let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute(
      "d",
      "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
    );
    svg.appendChild(path);
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.addEventListener('click', e => {
      this.#deleteBook(table);
    });
    dlt.appendChild(svg);
  }

  addTableRow() {
    document.querySelector(".form-container").classList.add('hidde');
    let table = document.querySelector("#book-table");
    let rowCount = table.rows.length;
    let row = table.insertRow(rowCount);

    //add title of the book
    let title = row.insertCell();
    title.innerHTML = this.title;

    //add author of the book
    let author = row.insertCell();
    author.innerHTML = this.author;

    //add pages of the book
    let pages = row.insertCell();
    pages.innerHTML = this.pages;

    //add date of the book inserted
    let date = row.insertCell();
    date.innerHTML = this.insertionDate.toDateString();

    //add read/not read button
    this.#addReadStatusButton(row);

    //add delete svg icon to delete the book
    this.#addDeleteButton(table, row);
  }
}

Book.displayBooks();

const addBtn = document.querySelector(".add-book");
addBtn.addEventListener('click', () => {
  document.querySelector(".form-container").classList.remove('hidde');
});

const form = document.querySelector('#book-form');
form.addEventListener('submit', addBook);

function addBook(e) {
  e.preventDefault();
	const newBook = new Book(
    form.elements.title.value,
    form.elements.author.value,
    form.elements.pages.value,
    form.elements.status.value);
  newBook.addTableRow();
}
