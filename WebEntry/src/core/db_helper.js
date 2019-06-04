import axios from 'axios';

/////// Examples of database function calls

//dbFunctions.getAllQuestionsFromDb(this.handleAllQuestion);

//this.deleteAllQuestionsFromDb();

// var x = Date();
// this.addQuestionToDb({
//   question: "Test question: " + x,
//   aois: [],
//   tags: [],
//   responses: ["first answer", "second answer", "third answer"],
//   startTimestamp: null,
//   stopTimestamp: null
// });

//this.getQuestionWithID("5c49ba4459299152240536c5", () => {});

// this.updateQuestionFromDb("5c49ba4459299152240536c5", {
//   aois: ["1", "2", "3", "4", "5"]
// });

//this.deleteQuestionFromDb("5c49ba4659299152240536c6");

// this.addSetToDb({
//   name: "Third set",
//   question: []
// }, (id) => {});

//dbFunctions.getAllSetsFromDb(() => {});

//this.getSetWithID("5c49c48197031d4984fea65c", () => {});

//this.deleteAllSetsFromDb();

// this.updateSetFromDb("5c49c49097031d4984fea65d", {
//   questions: []
// });

//this.addQuestionToSetDb("5c49c49097031d4984fea65d", "5c49ba4659299152240536c6");

//this.removeQuestionFromSetDb("5c49c47897031d4984fea65b", "5c49ba4159299152240536c4");

//this.deleteSetFromDb("5c49c48197031d4984fea65c");

//////// END EXAMPLES

// fetch data from our data base
export function getAllTasksFromDb(callback){
  fetch("/api/getAllTasks")
    .then((response) => {
      if(response.ok) {
        return response.json();
      }
      else {
        alert("Database connection failed!");
        throw new Error("Database connection failed");
      }
    })
    .then(res => {
      console.log("data fetched from database", res);
      callback(res.questions);
    })
    .catch((error) => {
      console.log(error)
    });
};

export function queryTasksFromDb(queryTasks, queryString,callback){
  console.log("Finding tasks containing ", queryString);

  var queryCollection = queryTasks ? 'Tasks' : 'TaskSets';

  axios.post("/api/getAllTasksContaining", {
    queryCollection: queryCollection,
    queryString: queryString,
  }).then((response) => {
    if(response.status === 200) {
      console.log("Task received from database with id: ", queryString, response.data);
      callback(queryTasks, response.data);
    }
    else {
      alert("Cannot find tasks containing ", queryString);
      throw new Error("Database connection failed");
    }
  })
  .catch((error) => {
    console.log(error)
  });
};

//retrieve a task of an //ID
export function getTaskWithID(id, callback){
  console.log("find ", id);
  axios.post("/api/getTaskWithID", {
    id: id
  }).then((response) => {
    if(response.status === 200) {
      console.log("Task received from database with id: ", id, response.data.question);
      callback(response.data.question);
    }
    else {
      alert("Cannot find task with this ID ", id);
      throw new Error("Database connection failed");
    }
  })
  .catch((error) => {
    console.log(error)
  });
};

// to create new query into our data base
export function addTaskToDb(dbQuestionObject, callback){
  axios.post("/api/addTask", {
    message: JSON.stringify(dbQuestionObject)
  })
  .then((response) => {
    if(response.status === 200) {
      if(response.data.success === true){
        console.log("added task to database", response.data._id);
        callback(response.data._id);
      }
      else{
        alert("Failed to add task to the database!");
      }
    }
    else {
      alert("Something's wrong! Cannot add new task to database.");
      throw new Error("Cannot add new task");
    }
  });
};

// to overwrite existing data base information
export function updateTaskFromDb(id, editedObj, callback){
  axios.post("/api/updateTask", {
    id: id,
    message: JSON.stringify(editedObj)
  }).then(data =>
    {
      console.log("after updating", data)
      callback(data._id)
    });
};

// to remove existing database information
export function deleteTaskFromDb(idTodelete, callback){
  axios.post("/api/deleteTask", {
      id: idTodelete
  }).then(response =>
    {console.log("after deleting", response)
    callback();
  });
};

export function deleteAllTasksFromDb(){
  axios.delete("/api/deleteAllTasks");
};

export function getAllTaskSetsFromDb(callback){
  fetch("/api/getAllTaskSets")
    .then((response) => {
      if(response.ok) {
        return response.json();
      }
      else {
        alert("Database connection failed!");
        throw new Error("Database connection failed");
      }
    })
    .then(res => {
      console.log("Tasksets fetched from database", res.sets);
      callback(res.sets)
    })
    .catch((error) => {
      console.log(error)
    });
};

export function getTaskSetWithID(id, callback){
  axios.post("/api/getTaskSetWithID", {
    id: id
  }).then((response) => {
    if(response.status === 200) {
      console.log("Task set received from database with id: ", id, response.data.set);
      callback(response.data.set);
    }
    else {
      alert("Cannot find task set with this ID ", id);
      throw new Error("Database connection failed");
    }
  })
  .catch((error) => {
    console.log(error)
  });
}

export function addTaskSetToDb(obj, callback){
  axios.post("/api/addTaskSet", {
    message: JSON.stringify(obj)
  })
  .then((response) => {
    if(response.status === 200) {
      console.log("added task set to database", response.data._id);
      callback(response.data._id);
    }
    else {
      alert("Something's wrong! Cannot add new question to database.");
      throw new Error("Cannot add new question");
    }
  });
};

// to overwrite existing data base information
export function updateTaskSetFromDb(id, editedObj, callback){
  axios.post("/api/updateTaskSet", {
    id: id,
    message: JSON.stringify(editedObj)
  }).then(data => {
        console.log("after updating set", data);
        callback();
      });
};

export function deleteTaskSetFromDb(idTodelete, callback){
  axios.post("/api/deleteTaskSet", {
      id: idTodelete
  }).then(response => {
    console.log("after deleting set", response);
    callback();
  });
};

//when we add a child to a set, we need two fields: childId and childType (Task or TaskSet)
export function addChildToTaskSetDb(setID, childObj){
  axios.post("/api/addChildToTaskSet", {
    setId: setID,
    childObj: childObj
  }).then(data => {console.log("after adding child to set", data)});
}

//childId is enough for removing it from its set
export function removeChildFromTaskSetDb(setID, childId){
  axios.post("/api/removeChildFromTaskSet", {
    setId: setID,
    childId: childId
  }).then(data => {console.log("after remove child from set", data)});
}

export function deleteAllTaskSetsFromDb(){
  axios.delete("api/deleteAllTaskSets");
};

//the ids can be either task or taskset, the database will do recursive query to query them all
export function getTasksOrTaskSetsWithIDs(objIds, callback) {
  axios.post("/api/getTasksOrTaskSetsWithIDs", {
      objIds: JSON.stringify(objIds)
  }).then(response => {
    console.log("after get all tasks or tasksets from set", response);
    callback(response.data.data);
  });
};

//----------------------experiments-----------------------
export function getAllExperimentsFromDb(callback){
  fetch("/api/getAllExperiments")
    .then((response) => {
      if(response.ok) {
        return response.json();
      }
      else {
        alert("Database connection failed!");
        throw new Error("Database connection failed");
      }
    })
    .then(res => {
      callback(res.experiments)
    })
    .catch((error) => {
      console.log(error)
    });
};

//---------------------participants-----------------------
export function getAllParticipantsFromDb(callback){
  fetch("/api/getAllParticipants")
    .then((response) => {
      if(response.ok) {
        return response.json();
      }
      else {
        alert("Database connection failed!");
        throw new Error("Database connection failed");
      }
    })
    .then(res => {
      callback(res.participants)
    })
    .catch((error) => {
      console.log(error)
    });
};
