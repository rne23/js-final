
function TaskList() {

  this.name = document.getElementById('name');
  this.priority = document.getElementById('priority');
  this.form = document.getElementById('form');
  this.submit = document.getElementById('submit');
  this.removeAll = document.getElementById('removeAll');
  this.the_list = document.getElementById('the_list');

  this.tasks = [];
  this.taskCounter = 0;

  this.assignEventListeners();
}

TaskList.prototype.assignEventListeners = function () {

  this.form.addEventListener('submit', function(e) {
    e.preventDefault();
    currentTaskList.addTaskItem(this.name.value, this.priority.value);
    currentTaskList.refresh();
  });

  this.removeAll.addEventListener('click', function(e) {
    e.preventDefault();
    var deleteConfirm = confirm("Are you sure you want to delete ALL the tasks?");
    if (deleteConfirm) {
    currentTaskList.removeAllTasks();
    }
  });
};

TaskList.prototype.userAddTaskListItemHTML = function (taskName, taskPriority) {
  var newLi = document.createElement('li');
  newLi.id = "task_" + this.taskCounter++;
  newLi.className += ' list-group-item taskItem ';

  var nameSpan = document.createElement('span');
  nameSpan.textContent = taskName;
  nameSpan.className += ' pull-left taskNameSpan ';
  nameSpan.setAttribute("contenteditable", "false");


  var prioritySpan = document.createElement('span');
  prioritySpan.textContent = taskPriority;
  prioritySpan.className += ' badge badgeToDo ';

  var controlSpan = document.createElement('span');
  var editBtn = this.addTaskItemEditButton(nameSpan);
  var checkBox = this.addTaskItemCheckBox(nameSpan, editBtn);
  var deleteBtn = this.addTaskItemDeleteButton();
  controlSpan.className += ' pull-right ';
  controlSpan.append(checkBox, editBtn, deleteBtn);

  newLi.append(nameSpan, prioritySpan, controlSpan);

  this.the_list.append(newLi);

  var taskData = {
    name: taskName,
    priority: parseInt(taskPriority),
    li: newLi,
    id: newLi.id,
    namespan: nameSpan,
    editspan: editBtn
  };

  return taskData

};

TaskList.prototype.addTaskItem = function(taskName, taskPriority) {
  if(taskName == undefined || taskName == null || taskName == '') {
    alert("Empty Task Name!");
    return;
  }

  if(taskPriority == undefined || taskPriority == null || taskPriority == ''){
    alert("Empty Task Priority!");
    return;
  }

  var newTaskData = this.userAddTaskListItemHTML(taskName, taskPriority);

  this.tasks.push(newTaskData);

};

TaskList.prototype.removeTaskItem = function (taskId) {

  for (var i = 0; i < this.tasks.length; i++) {
    var currentTask = this.tasks[i];

    if(taskId == currentTask.id) {
      currentTask.li.remove();
      this.tasks.splice(list_item_id,1);
    }
  }

};

TaskList.prototype.userRemoveTaskItem = function(deleteBtnElement) {

  var list_item = deleteBtnElement.parentNode.parentNode;
  var list_item_id = list_item.id;
  list_item.remove();

  for (var i = 0; i < this.tasks.length; i++) {
    var currentTask = this.tasks[i];
    if (currentTask['id'] == list_item_id) {
      this.tasks.splice(list_item_id,1);
    }
  }

};

TaskList.prototype.editTaskItem = function (editBtn, nameSpan) {
  var currentTaskList = this;
  var taskId = nameSpan.parentNode.id;
  var newTaskName = null;
  var isEditable = nameSpan.getAttribute("contenteditable");
  isEditable = isEditable == 'true' ? true : false;

  if(isEditable) {
    nameSpan.setAttribute("contenteditable", "false");
  } else {
    nameSpan.setAttribute("contenteditable", "true");
    nameSpan.addEventListener('input', function(e){
      currentTaskList.updateTaskItemName(taskId, nameSpan.innerHTML);
    });
  };
};

TaskList.prototype.updateTaskItemName = function(taskId, newTaskName) {

  for (var i = 0; i < this.tasks.length; i++) {
    var currentTask = this.tasks[i];
    if (currentTask['id'] == taskId) {
      currentTask.name = newTaskName;
      break;
    }
  }
};

TaskList.prototype.addTaskItemDeleteButton = function () {
  var currentTaskList = this;
  var deleteBtn = document.createElement('button');
  deleteBtn.className += ' button btn btn-xs btn-danger ';
  deleteBtn.innerHTML = '<i class="glyphicon glyphicon-trash"></i>';

  deleteBtn.addEventListener('click', function(e){
    var deleteConfirm = confirm("Are you sure you want to delete this task?");
    if (deleteConfirm) {
    currentTaskList.userRemoveTaskItem(deleteBtn);
    currentTaskList.refresh();
    }
  });

  return deleteBtn;
};

TaskList.prototype.addTaskItemEditButton = function (nameSpan) {
  var currentTaskList = this;
  var editBtn = document.createElement('button');

  editBtn.className += ' button btn btn-xs btn-default ';
  editBtn.innerHTML = '<i class="glyphicon glyphicon-pencil"></i>';

  editBtn.addEventListener('click', function(e){
    currentTaskList.editTaskItem(editBtn, nameSpan);
    if (nameSpan.textContent == ''){
      nameSpan.textContent = '---';
    };
  });


  return editBtn;
};

TaskList.prototype.addTaskItemCheckBox = function (nameSpan, editBtn) {
  var checkBox = document.createElement('input');
  checkBox.type = 'checkbox';

  checkBox.addEventListener('change', function(e){
    if (nameSpan.classList.contains('strikeThrough')){
      nameSpan.classList.remove('strikeThrough');
      editBtn.classList.remove('hide');
    } else {
      nameSpan.classList.add('strikeThrough');
      editBtn.classList.add('hide');
    };
    currentTaskList.refresh();
  });

  return checkBox;
};

TaskList.prototype.removeAllTasks = function() {

  for (var i = 0; i < this.tasks.length; i++) {
    var currentTask = this.tasks[i];
      currentTask.li.remove();
  }

  this.tasks = [];
  this.taskCounter = 0;

};

TaskList.prototype.refresh = function () {
  var currentTaskList = this;

  while(this.the_list.firstChild) {
    this.the_list.removeChild(this.the_list.firstChild);
  };

  this.tasks.sort(function(a,b){
    return a.priority - b.priority;
  });

  for(var i=0; i<this.tasks.length; i++) {
    var currentTask = this.tasks[i];
    if (currentTask.namespan.classList.contains('strikeThrough') == false) {
      this.the_list.append(currentTask.li);
    };
  };

  for(var i=0; i<this.tasks.length; i++) {
    var currentTask = this.tasks[i];
    if (currentTask.namespan.classList.contains('strikeThrough') == true) {
      this.the_list.append(currentTask.li);
    };
  };

  this.name.value = '';
  this.priority.value = '';
};

var currentTaskList = new TaskList();
