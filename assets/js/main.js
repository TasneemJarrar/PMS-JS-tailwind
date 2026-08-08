const modebtn = document.getElementById("mode-toggle");
const modeicon = document.getElementById("mode-icon");
const html = document.documentElement;
const title = document.querySelector("#title");
const price = document.querySelector("#price");
const taxes = document.querySelector("#taxes");
const ads = document.querySelector("#ads");
const discount = document.querySelector("#discount");
const total = document.querySelector("#total");
const count = document.querySelector("#count");
const category = document.querySelector("#category");
const createbtn = document.querySelector("#createbtn");
const totalContainer = document.querySelector("#totalContainer");
const productsTable = document.querySelector("#productsTable");
const seperator = document.querySelector(".seperator");
const deleteAllbtn = document.querySelector("#deleteAllbtn");
const dataSection = document.querySelector(".outputs");
const selectsearchMode = document.querySelector("#selectsearchMode");
const searchBar = document.querySelector("#searchBar");
const searchFail = document.querySelector(".searchFail");
const clock = document.querySelector("#clock");

let searchMode = "title";
selectsearchMode.addEventListener("change", (e) => {
  getSearchMood(e.target.value);
});

let mode = "create";
let tmp;

if (localStorage.getItem("theme") == "dark") {
  html.classList.add("dark");
  modeicon.classList.replace("fa-moon", "fa-sun");
}

modebtn.addEventListener("click", () => {
  html.classList.toggle("dark");

  if (html.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    modeicon.classList.replace("fa-moon", "fa-sun");
  } else {
    localStorage.setItem("theme", "light");
    modeicon.classList.replace("fa-sun", "fa-moon");
  }
});

// get total
const getTotal = () => {
  if (price.value && taxes.value && ads.value) {
    let result = +price.value + +taxes.value + +ads.value - +discount.value;
    total.innerHTML = result;
    totalContainer.classList.remove("bg-rose-400/70", "dark:bg-rose-500/40");
    totalContainer.classList.add("bg-emerald-400/70", "dark:bg-emerald-500/40");
    seperator.classList.remove("hidden");
  } else {
    total.innerHTML = "";
  }
};

let products;
if (localStorage.getItem("products") === null) products = [];
else {
  products = JSON.parse(localStorage.products);
}

// create products
createbtn.onclick = (e) => {
  e.preventDefault();
  let newProduct = {
    id: 1,
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value.toLowerCase(),
  };

  if (title.value != '' 
    && price.value != '' 
    && category.value != ''
  && newProduct.count < 100) {
    if (mode === "create") {
      if (newProduct.count > 1) {
        console.log(newProduct.count);
        for (let i = 0; i < newProduct.count; i++) {
        products.push(newProduct);
      }
    } else {
      products.push(newProduct);
    }
  } else {
    products[tmp] = newProduct;
    mode = "create";
    createbtn.innerHTML = "Create Product";
    count.style.display = "block";
  }
    clearData();
    }
    else{

    }

  searchFail.classList.remove("hidden");
  seperator.classList.add("hidden");
  totalContainer.classList.remove(
    "bg-emerald-400/70",
    "dark:bg-emerald-500/40",
  );
  totalContainer.classList.add("bg-rose-400/70", "dark:bg-rose-500/40");
  saveToLocalStorage();
  showData();
};

// save to local storage
const saveToLocalStorage = () => {
  localStorage.setItem("products", JSON.stringify(products));
};

// clear inputs
const clearData = () => {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerHTML = "";
  count.value = "";
  category.value = "";
};

// read
const showData = () => {
  if (products.length > 0) {
    deleteAllbtn.innerHTML = `<button type="button" onclick="deleteAll()"
              class="w-full p-3 bg-purple-400 text-black dark:text-white dark:bg-purple-500 hover:bg-purple-500 dark:hover:bg-purple-400 font-semibold hover:tracking-wider rounded-2xl transition-colors duration-200 ease-in-out">
              Delete All (${products.length})</button>`;
    dataSection.classList.remove("hidden");
  } else {
    deleteAllbtn.innerHTML = "";
    dataSection.classList.add("hidden");
  }
  let table = "";
  for (let i = 0; i < products.length; i++) {
    table += `
        <tr class="odd:bg-white even:bg-gray-100 dark:odd:bg-gray-800 dark:even:bg-gray-700">
          <td class="p-3 text-sm">${i + 1}</td>
          <td class="p-3">${products[i].title}</td>
          <td class="p-3">${products[i].price}</td>
          <td class="p-3">${products[i].taxes}</td>
          <td class="p-3">${products[i].ads}</td>
          <td class="p-3 font-semibold">${products[i].discount}</td>
          <td class="p-3 font-semibold">${products[i].category}</td>
          <td class="p-3">${products[i].total}</td>
          <td class="p-3">
            <button onclick="updateItem(${i})"
              class="px-2 py-1 bg-purple-300 dark:bg-purple-500 text-white rounded-md hover:bg-purple-400 dark:hover:bg-purple-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor"
                  d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z" />
              </svg>
            </button>
            <button onclick="deleteItem(${i})" class="px-2 py-1 bg-red-500 text-white rounded-md ml-2 hover:bg-red-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor"
                  d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zm3.713-4.288Q11 16.426 11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17t.713-.288m4 0Q15 16.426 15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17t.713-.288" />
              </svg>
            </button>
          </td>
      </tr>`;
  }
  productsTable.innerHTML = table;
};

// delete
const deleteItem = (id) => {
  products.splice(id, 1);
  saveToLocalStorage();
  showData();
};

// delete all
const deleteAll = () => {
  products = [];
  saveToLocalStorage();
  showData();
};

// update
const updateItem = (id) => {
  const product = products[id];
  console.log(product);
  title.value = product.title;
  price.value = product.price;
  taxes.value = product.taxes;
  ads.value = product.ads;
  discount.value = product.discount;
  category.value = product.category;
  count.style.display = "none";
  createbtn.innerHTML = "Update";
  getTotal();
  mode = "update";
  tmp = id;
  scroll({
    top: 0,
    behavior: "smooth",
  });
};

// search
const getSearchMood = (value) => {
  if (value === "title") {
    searchMode = value;
  } else if (value === "category") {
    searchMode = value;
  }
  searchBar.setAttribute("placeholder", `Search by ${searchMode} ...`);
  searchBar.focus();
  searchBar.value = "";
  showData();
};

const searchData = (value) => {
  let table = "";
  let found = false;
  value = value.trim().toLowerCase();

  for (let i = 0; i < products.length; i++) {
    let productValue;
    if (searchMode === "title") {
      productValue = products[i].title;
    } 
    else if (searchMode === "category") {
      productValue = products[i].category;
    }

    if (productValue.toLowerCase().includes(value)) {
      found = true;
      table += `
        <tr class="odd:bg-white even:bg-gray-100 dark:odd:bg-gray-800 dark:even:bg-gray-700">
          <td class="p-3 text-sm">${i + 1}</td>
          <td class="p-3">${products[i].title}</td>
          <td class="p-3">${products[i].price}</td>
          <td class="p-3">${products[i].taxes}</td>
          <td class="p-3">${products[i].ads}</td>
          <td class="p-3 font-semibold">${products[i].discount}</td>
          <td class="p-3 font-semibold">${products[i].category}</td>
          <td class="p-3">${products[i].total}</td>
          <td class="p-3">
            <button onclick="updateItem(${i})"
              class="px-2 py-1 bg-purple-300 dark:bg-purple-500 text-white rounded-md hover:bg-purple-400 dark:hover:bg-purple-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor"
                  d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z" />
              </svg>
            </button>
            <button onclick="deleteItem(${i})" class="px-2 py-1 bg-red-500 text-white rounded-md ml-2 hover:bg-red-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path fill="currentColor"
                  d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zm3.713-4.288Q11 16.426 11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17t.713-.288m4 0Q15 16.426 15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17t.713-.288" />
              </svg>
            </button>
          </td>
      </tr>`;
    }
  }

  if (found) {
    searchFail.classList.add("hidden");
    searchFail.classList.remove("flex");
  } else {
    searchFail.classList.remove("hidden");
    searchFail.classList.add("flex");
  }

  productsTable.innerHTML = table;
};

//clock 
const updateClock = () => {
  clock.textContent = new Date().toLocaleTimeString();
};

updateClock();

setInterval(updateClock, 1000);

showData();
