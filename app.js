// Tüm elementler seçildi
const form = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");

eventListeners();

//Tüm eventlistenerlar
function eventListeners() {
    form.addEventListener("submit", addTodo);
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);
}

//Tüm todoları temizle
function clearAllTodos(e) {
    if(confirm("Tümünü silmek istediğinize emin misiniz ?")) {
        // todoList.innerHTML =""; // işlem daha yavaş
        while(todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos");
    }    
}

//Search İşlemi
function filterTodos(e) {
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(listItem) {
        const text = listItem.textContent.toLowerCase();
        if(text.indexOf(filterValue) === -1) {
            //Bulamadı
            listItem.setAttribute("style","display : none !important");
        }
        else {
            listItem.setAttribute("style","display : block")
        }
    });
}

//Todo Silme
function deleteTodo(e) {
    if(e.target.className === "fa fa-remove") {
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success","Todo başarıyla silindi!");
    }
}

//LocalStorageden todo silme
function deleteTodoFromStorage(deletetodo) {
    let todos = getTodosFromStorage();

    todos.forEach(function(todo,index){
        if(todo === deletetodo) {
            todos.splice(index,1); // Arrayden değeri silmek.
        }
    });

    localStorage.setItem("todos",JSON.stringify(todos));
}


//Todoları reload'da gösterme
function loadAllTodosToUI() {
    let todos = getTodosFromStorage();
    todos.forEach(function(todo){
        addTodoToUI(todo);
    });
}

//Todo ekleme
function addTodo(e) {
    const newTodo = todoInput.value.trim();

    if (newTodo === "") {
        showAlert("danger","Lütfen bir todo giriniz!");
    } else {
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success","İşlem Başarılı!")
    }

    e.preventDefault();
}

//Alert
function showAlert(type,message) {
    const alert = document.createElement("div");

    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    firstCardBody.appendChild(alert);
    setTimeout(function() {
        alert.remove();
    },2000);
    
}

// Storageden todoları al
function getTodosFromStorage() {
    let todos;

    if (localStorage.getItem("todos") === null){
        todos = [];
    } else {
        todos =  JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

//LocalStorage'ye todo ekleme
function addTodoToStorage(newTodo) {
    let todos = getTodosFromStorage();
    todos.push(newTodo);
    localStorage.setItem("todos", JSON.stringify(todos));
}

//Ekranda Todoları Gösterme
function addTodoToUI(newTodo) {
    //List Item Oluşturma
    const listItem = document.createElement("li");
    //Link Oluşturma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>"

    listItem.className = "list-group-item d-flex justify-content-between";

    // Text node oluşturma
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    //Todo list'e list Item'ı ekleme
    todoList.appendChild(listItem);
    todoInput.value = "";
}
