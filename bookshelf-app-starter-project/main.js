const books = [];
const RENDER_EVENT = "render-books";
const STORAGE_KEY = "BOOKSHELF_APPS";

function isStorageExist() {
  return typeof Storage !== "undefined";
}

function saveData() {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
}

function loadDataFromStorage() {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (storedData) {
    books.push(...JSON.parse(storedData));
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("bookForm");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }

  const bookFormIsComplete = document.getElementById("bookFormIsComplete");
  const bookFormSubmitSpan = document
    .getElementById("bookFormSubmit")
    .querySelector("span");

  bookFormIsComplete.addEventListener("change", function () {
    if (bookFormIsComplete.checked) {
      bookFormSubmitSpan.innerText = "Selesai dibaca";
    } else {
      bookFormSubmitSpan.innerText = "Belum selesai dibaca";
    }
  });

  const searchForm = document.getElementById("searchBook");
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });
});

function addBook() {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = Number(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    title,
    author,
    year,
    isComplete
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById("incompleteBookList");
  const completedBookList = document.getElementById("completeBookList");

  uncompletedBookList.innerHTML = "";
  completedBookList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) {
      completedBookList.append(bookElement);
    } else {
      uncompletedBookList.append(bookElement);
    }
  }
});

function makeBook(bookObject) {
  const container = document.createElement("div");
  container.setAttribute("data-bookid", bookObject.id);
  container.setAttribute("data-testid", "bookItem");

  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;
  textTitle.setAttribute("data-testid", "bookItemTitle");

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis: ${bookObject.author}`;
  textAuthor.setAttribute("data-testid", "bookItemAuthor");

  const textYear = document.createElement("p");
  textYear.innerText = `Tahun: ${bookObject.year}`;
  textYear.setAttribute("data-testid", "bookItemYear");

  const buttonContainer = document.createElement("div");

  const completeButton = document.createElement("button");
  completeButton.setAttribute("data-testid", "bookItemIsCompleteButton");

  if (bookObject.isComplete) {
    completeButton.innerText = "Belum Selesai";
  } else {
    completeButton.innerText = "Selesai Dibaca";
  }

  completeButton.addEventListener("click", function () {
    completeBookStatus(bookObject.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
  deleteButton.innerText = "Hapus";
  deleteButton.addEventListener("click", function () {
    removeBook(bookObject.id);
  });

  buttonContainer.append(completeButton, deleteButton);
  container.append(textTitle, textAuthor, textYear, buttonContainer);

  return container;
}

function completeBookStatus(bookId) {
  const bookTarget = findBook(bookId);

  if (!bookTarget) return;

  bookTarget.isComplete = !bookTarget.isComplete;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  return books.find((bookItem) => bookItem.id === bookId) || null;
}

function removeBook(bookId) {
  const bookIndex = books.findIndex((bookItem) => bookItem.id === bookId);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }
}

function searchBook() {
  const searchTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();

  const uncompletedBookList = document.getElementById("incompleteBookList");
  const completedBookList = document.getElementById("completeBookList");

  uncompletedBookList.innerHTML = "";
  completedBookList.innerHTML = "";

  for (const bookItem of books) {
    if (bookItem.title.toLowerCase().includes(searchTitle)) {
      const bookElement = makeBook(bookItem);
      if (bookItem.isComplete) {
        completedBookList.append(bookElement);
      } else {
        uncompletedBookList.append(bookElement);
      }
    }
  }
}
