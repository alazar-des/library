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
    Book.#myLibrary.forEach((book) => book.addTableRow());
  }

  static countBook() {
    return {
      books: Book.#myLibrary.length,
      read: Book.#myLibrary.reduce((prev, curr) => {
        if (curr.read == "read") return prev + 1;
        else return prev;
      }, 0),
      notread: Book.#myLibrary.reduce((prev, curr) => {
        if (curr.read == "notread") return prev + 1;
        else return prev;
      }, 0),
    };
  }

  #deleteBook(table) {
    let index = Book.#myLibrary.indexOf(this);
    Book.#myLibrary.splice(index, 1);
    table.deleteRow(index + 1);
    displayBookCount();
  }

  #addReadStatusButton(row) {
    let read = row.insertCell();
    let btn = document.createElement("button");
    btn.innerHTML = this.read == "read" ? "read" : "notread";
    btn.classList.add(this.read);
    btn.addEventListener("click", (e) => {
      this.read = this.read == "read" ? "notread" : "read";
      btn.innerHTML = this.read;
      btn.classList.toggle("notread");
      btn.classList.toggle("read");
      displayBookCount();
    });
    read.appendChild(btn);
  }

  #addDeleteButton(table, row) {
    let dlt = row.insertCell();
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
    );
    svg.appendChild(path);
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.addEventListener("click", (e) => {
      this.#deleteBook(table);
    });
    dlt.appendChild(svg);
  }

  addTableRow() {
    document.querySelector(".form-container").classList.add("hidde");
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

function validateForm() {
  const inputs = document.querySelectorAll("input");
  inputs.forEach(input => validate(input));
  return Array.from(inputs).every((input) => input.validity.valid);
}

function displayBookCount() {
  const bookCount = Book.countBook();
  document.querySelector(
    "p.books"
  ).textContent = `Books(${bookCount.books}): ${bookCount.read} read / ${bookCount.notread} not read`;
}

function addBook(e) {
  e.preventDefault();
  if (validateForm()) {
    const form = document.querySelector("#book-form");
    const newBook = new Book(
      form.elements.title.value,
      form.elements.author.value,
      form.elements.pages.value,
      form.elements.status.value
    );
    newBook.addTableRow();
    displayBookCount();
    form.reset();
  }
}

function validate(target) {
  if (target.validity.valid) {
    target.previousElementSibling.children[1].textContent = "";
    target.classList.remove("error");
  } else {
    target.classList.add("error");
    target.previousElementSibling.children[1].textContent = " *Required";
  }
}

(function () {
  Book.displayBooks();
  displayBookCount();

  const addBtn = document.querySelector(".add-book");
  addBtn.addEventListener("click", () => {
    document.querySelector(".form-container").classList.remove("hidde");
  });

  const form = document.querySelector("#book-form");
  form.addEventListener("submit", addBook);

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => input.addEventListener("focusout", e => validate(e.target)));

  const formContainer = document.querySelector(".form-container");
  formContainer.addEventListener("click", (e) => {
    e.target.classList.add("hidde");
  });
})();
