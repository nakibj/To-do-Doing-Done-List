const input = document.getElementById('input');
const btn = document.getElementById('add');
const todoBox = document.querySelector("#todo .box-content");
const boxes = document.querySelectorAll(".box-content");
const trash = document.getElementById("trash");
const progressBox = document.querySelector("#progress .box-content");
const doneBox = document.querySelector("#done .box-content");

btn.addEventListener("click", createTask);

let selected = null;

function createTask(){
    if(input.value === "") return;

    const task = document.createElement("div");
    task.className = "task";
    task.textContent = input.value;
    task.draggable = true;

    todoBox.appendChild(task);
    input.value = "";
    saveBoard()

    task.addEventListener("dragstart", ()=>{
        selected = task;
    });
    task.addEventListener("dragend", ()=>{
        selected = null;
    });
}


boxes.forEach(box=>{
    box.addEventListener("dragover", (e)=>{
        e.preventDefault();
    });
    box.addEventListener("drop", ()=>{
        if(selected){
            box.appendChild(selected);
            saveBoard()
        }
    });
});

trash.addEventListener("dragover", (e)=>{
    e.preventDefault();
})
trash.addEventListener("drop", (e)=>{
    if(selected){
        selected.remove();
        saveBoard();
    }
})


function clearAll(){

    boxes.forEach(b=> {
        b.innerHTML = "";
    });
    localStorage.removeItem("board");
    
}


//keyboard

document.addEventListener("keydown", (e)=>{
    if(e.key == "Enter"){
        createTask();
    }
});



function saveBoard(){
    const data = {
        todo: [],
        progress: [],
        done: []
    };

    document.querySelectorAll("#todo .task").forEach(t=>data.todo.push(t.textContent));
    document.querySelectorAll("#progress .task").forEach(t=>data.progress.push(t.textContent));
    document.querySelectorAll("#done .task").forEach(t=>data.done.push(t.textContent));

    localStorage.setItem("board", JSON.stringify(data));
}

function loadBoard(){
    const saved = localStorage.getItem("board");
    if(!saved) return;

    const data = JSON.parse(saved);

    data.todo.forEach(t => loadPast(t, todoBox));
    data.progress.forEach(t => loadPast(t, progressBox));
    data.done.forEach(t => loadPast(t, doneBox));
}

function loadPast(text, targetBox){
    const task = document.createElement("div");
    task.className = "task";
    task.textContent = text;     
    task.draggable = true;

    targetBox.appendChild(task); 
}

loadBoard();