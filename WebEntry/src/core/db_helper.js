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
export function getAllQuestionsFromDb(callback){
  fetch("/api/getAllQuestions")
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

export function queryQuestionsFromDb(queryTasks, queryString,callback){
  console.log("Finding tasks containing ", queryString);

  var queryCollection = queryTasks ? 'Tasks' : 'TaskSets';

  axios.post("/api/getAllQuestionContaining", {
    queryCollection: queryCollection,
    queryString: queryString,
  }).then((response) => {
    if(response.status === 200) {
      console.log("question received from database with id: ", queryString, response.data);
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

//retrieve a question of an //ID
export function getQuestionWithID(id, callback){
  console.log("find ", id);
  axios.post("/api/getQuestionWithID", {
    id: id
  }).then((response) => {
    if(response.status === 200) {
      console.log("question received from database with id: ", id, response.data.question);
      callback(response.data.question);
    }
    else {
      alert("Cannot find question with this ID ", id);
      throw new Error("Database connection failed");
    }
  })
  .catch((error) => {
    console.log(error)
  });
};

// to create new query into our data base
export function addQuestionToDb(dbQuestionObject, callback){
  axios.post("/api/addQuestion", {
    message: JSON.stringify(dbQuestionObject)
  })
  .then((response) => {
    if(response.status === 200) {
      if(response.data.success === true){
        console.log("added question to database", response.data._id);
        callback(response.data._id);
      }
      else{
        alert("Failed to add question to the database!");
      }
    }
    else {
      alert("Something's wrong! Cannot add new question to database.");
      throw new Error("Cannot add new question");
    }
  });
};

// to overwrite existing data base information
export function updateQuestionFromDb(id, editedObj){
  axios.post("/api/updateQuestion", {
    id: id,
    message: JSON.stringify(editedObj)
  }).then(data => {console.log("after updating", data)});
};

// to remove existing database information
export function deleteQuestionFromDb(idTodelete){
  axios.post("/api/deleteQuestion", {
      id: idTodelete
  }).then(response => {console.log("after deleting", response)});
};

export function deleteAllQuestionsFromDb(){
  axios.delete("/api/deleteAllQuestions");
};

export function getAllSetsFromDb(callback){
  fetch("/api/getAllSets")
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
      console.log("sets fetched from database", res.sets);
      callback(res.sets)
    })
    .catch((error) => {
      console.log(error)
    });
};

export function getSetWithID(id, callback){
  axios.post("/api/getSetWithID", {
    id: id
  }).then((response) => {
    if(response.status === 200) {
      console.log("set received from database with id: ", id, response.data.set);
      callback(response.data.set);
    }
    else {
      alert("Cannot find question with this ID ", id);
      throw new Error("Database connection failed");
    }
  })
  .catch((error) => {
    console.log(error)
  });
}

export function addSetToDb(obj, callback){
  axios.post("/api/addSet", {
    message: JSON.stringify(obj)
  })
  .then((response) => {
    if(response.status === 200) {
      console.log("added set to database", response.data._id);
      callback(response.data._id);
    }
    else {
      alert("Something's wrong! Cannot add new question to database.");
      throw new Error("Cannot add new question");
    }
  });
};

// to overwrite existing data base information
export function updateSetFromDb(id, editedObj){
  axios.post("/api/updateSet", {
    id: id,
    message: JSON.stringify(editedObj)
  }).then(data => {console.log("after updating set", data)});
};

export function deleteSetFromDb(idTodelete){
  axios.post("/api/deleteSet", {
      id: idTodelete
  }).then(response => {console.log("after deleting set", response)});
};

export function addQuestionToSetDb(setID, questionID){
  axios.post("/api/addQuestionToSet", {
    setId: setID,
    questionId: questionID
  }).then(data => {console.log("after adding question to set", data)});
}

export function removeQuestionFromSetDb(setID, questionID){
  axios.post("/api/removeQuestionFromSet", {
    setId: setID,
    questionId: questionID
  }).then(data => {console.log("after remove question from set", data)});
}

export function deleteAllSetsFromDb(){
  axios.delete("api/deleteAllSets");
};
