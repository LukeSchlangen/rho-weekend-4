$(document).ready(function(){
  console.log('Sourced tasks.js');

  getAllTasks();

  // Our Get all tasks request
  function getAllTasks(){
    $.ajax({
      type: 'GET',
      url: '/allTasks',
      success: function(data){
        displayTasks(data);
      }
    });
  }

  // Display all of the tasks returned from our get request
  function displayTasks(data){
    console.log(data);
    $('#tasks').text('');
    data.forEach(function(task){
      var $div = $('<div></div>');
      $div.data('id', task.id);
      $div.text(task.name);

      if(task.is_complete){
        $div.append('You are all done! Good work!');
      }else{
        $div.append('<button class="completeTask"> Complete </button>');
      }

      $div.append('<button class="deleteTask"> Delete </button>');

      $('#tasks').append($div);
    })
  }

  // Triggering adding a new task
  $('#addTaskButton').on('click', function(){
    var newTask = $('#newTask').val();
    console.log(newTask);
    addTask(newTask);
  })

  // Adding a new task
  function addTask(name){
    $.ajax({
      type: 'POST',
      url: '/addTask',
      data: {
        name
      },
      success: function(data){
        getAllTasks();
      }
    })
  }

  // Our trigger to complete a task
  $('#tasks').on('click', '.completeTask', function(){
    var idToComplete = $(this).parent().data('id');
    console.log('We are completing task: ', idToComplete);
    completeTask(idToComplete);
  });

  function completeTask(id){
    $.ajax({
      type: 'PUT',
      url: '/completeTask',
      data: {
        id
      },
      success: function(){
        getAllTasks();
      }
    })
  }

  // Our trigger to complete a task
  $('#tasks').on('click', '.deleteTask', function(){
    if(confirm('ARE you really really sure?')){
      var idToDelete = $(this).parent().data('id');
      console.log('We are deleting task: ', idToDelete);
      deleteTask(idToDelete);
    }
  });

  function deleteTask(id){
    $.ajax({
      type: 'DELETE',
      url: '/deleteTask',
      data: {
        id
      },
      success: function(){
        getAllTasks();
      }
    })
  }


});
