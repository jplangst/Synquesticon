import axios from 'axios';
import * as db_objects from './db_objects.js';

/**
 * Contains all the DB helper functions
 */
class db_helper {
  /*
  ████████  █████  ███████ ██   ██     ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████
     ██    ██   ██ ██      ██  ██      ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██
     ██    ███████ ███████ █████       █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████
     ██    ██   ██      ██ ██  ██      ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
     ██    ██   ██ ███████ ██   ██     ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████
  */

  /**
   * getAllTasksFromDb - Asynch query the DB for all existing Tasks, the results are recieved via callback.
   *
   * @param  {function} callback This function will be called with the result of the query. The function should take one parameter.
   */
   getAllTasksFromDb(callback){
     axios.post("/api/getAllTasks", {
     }).then((response) => {
        if(response.status === 200) {
          callback(response.data.tasks);
        }
        else {
          alert("Database connection failed!");
          throw new Error("Database connection failed");
        }
      })
      .catch((error) => {
        console.log(error)
      });
  };

  /**
   * getTaskWithID - Asynch query for a specific task. Takes a task id and returns the result of the query via the provided callback.
   *
   * @param  {string}   id       The MongoDB generated ID to query for.
   * @param  {function} callback This function will be called with the result of the query. The function should take one parameter.
   */
   getTaskWithID(id, callback){
    axios.post("/api/getTaskWithID", {
      id: id
    }).then((response) => {
      if(response.status === 200) {
        callback(response.data.task);
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

  /**
   * addTaskToDb - Asynch add a new task to the DB.
   *
   * @param  {TaskObject} dbQuestionObject The task object to add to the DB. Should use TaskObject defined in db_objects.js.
   * @param  {function}   callback         This function will be called with the MongoDB id assigned to the created task. The function should take one parameter.
   */
   addTaskToDb(dbQuestionObject, callback){
    axios.post("/api/addTask", {
      message: JSON.stringify(dbQuestionObject),
    })
    .then((response) => {
      if(response.status === 200) {
        if(response.data.success === true){
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

  addTwoTasksToDb(tasks, callback) {
    axios.post("/api/addTwoTasks", {
      tasks: JSON.stringify(tasks)
    })
    .then((response) => {
      if(response.data.success) {
        callback(response.data._ids);
      }
    });
  }

  getManyTaskWithIDs(ids, callback) {
    axios.post("/api/getManyTaskWithIDs", {
      ids: ids
    }).then((response) => {
      if(response.status === 200) {
        callback(response.data.tasks);
      }
      else {
        //alert("Cannot find task with this ID ", id);
        throw new Error("Database connection failed");
      }
    })
    .catch((error) => {
      console.log(error)
    });
  }

  /**
   * updateTaskFromDb - Asynch call to update an existing task in the DB.
   *
   * @param  {string}     id        The MongoDB id of the task to update.
   * @param  {TaskObject} editedObj The task object to update in the DB. Should use TaskObject defined in db_objects.js.
   * @param  {function}   callback  This function will be called with the MongoDB id of the updated task. The function should take one parameter.
   */
   updateTaskFromDb(id, editedObj, callback){
    axios.post("/api/updateTask", {
      id: id,
      message: JSON.stringify(editedObj)
    }).then(data =>
      {
        callback(data._id)
      });
  };

  /**
   * deleteTaskFromDb - Asynch call to remove a specific task from the DB. Takes the id of the task and a callback function.
   *
   * @param  {string}   idTodelete The MongoDB id of the task to delete.
   * @param  {function} callback   This function will be called when the task has been deleted from the DB. Use it to update the interface.
   */
   deleteTaskFromDb(idTodelete, callback){
    axios.post("/api/deleteTask", {
        id: idTodelete
    }).then(response =>
    {
      callback();
    });
  };

  /**
   * deleteAllTasksFromDb - Deletes all the tasks in the DB. Use with care.
   */
   deleteAllTasksFromDb(){
    axios.delete("/api/deleteAllTasks", {
    });
  };

  /*
  ████████  █████  ███████ ██   ██     ███████ ███████ ████████     ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████
     ██    ██   ██ ██      ██  ██      ██      ██         ██        ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██
     ██    ███████ ███████ █████       ███████ █████      ██        █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████
     ██    ██   ██      ██ ██  ██           ██ ██         ██        ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
     ██    ██   ██ ███████ ██   ██     ███████ ███████    ██        ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████
  */

  /**
   * getAllTaskSetsFromDb - Asynch query the DB for all existing Sets, the results are recieved via callback.
   *
   * @param  {function} callback This function will be called with the result of the query. The function should take one parameter.
   */
    getAllTaskSetsFromDb(callback){
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
        callback(res.sets)
      })
      .catch((error) => {
        console.log(error)
      });
  };

  /**
   * getTaskSetWithID - Asynch query for a specific set. Takes a set id and returns the result of the query via the provided callback.
   *
   * @param  {string}   id       The MongoDB generated ID to query for.
   * @param  {function} callback This function will be called with the result of the query. The function should take one parameter.
   */
    getTaskSetWithID(id, callback){
    axios.post("/api/getTaskSetWithID", {
      id: id
    }).then((response) => {
      if(response.status === 200) {
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

  /**
   * getTaskSetObject - Asynch Get the specified set's object from the DB. The callback is called with the set object once the query has finished.
   *                    The object will contain all child objects as well.
   *
   * @param  {string}   taskSetID The MongoDB id of the set you want to retrieve.
   * @param  {function} callback  This function will be called when the object has been retrieved. The function should take one parameter.
   */
   getTaskSetObject(taskSetID, callback) {
    axios.post("/api/getCompleteTaskSetObject", {
        objId: JSON.stringify(taskSetID)
    }).then(response => {
      callback(response.data.data);
    });
  };

  /**
   * addTaskSetToDb - Asynch add a new set to the DB.
   *
   * @param  {TaskSetObject} setObject The task object to add to the DB. Should use TaskObject defined in db_objects.js.
   * @param  {function}      callback  This function will be called with the MongoDB id assigned to the created set. The function should take one parameter.
   */
   addTaskSetToDb(setObject, callback){
    axios.post("/api/addTaskSet", {
      message: JSON.stringify(setObject)
    })
    .then((response) => {
      if(response.status === 200) {
        callback(response.data._id);
      }
      else {
        alert("Something's wrong! Cannot add new question to database.");
        throw new Error("Cannot add new question");
      }
    });
  };

  /**
   * updateTaskSetFromDb - Asynch call to update an existing set in the DB.
   *
   * @param  {string}     id        The MongoDB id of the set to update.
   * @param  {TaskObject} editedObj The set object to update in the DB. Should use TaskSetObject defined in db_objects.js.
   * @param  {function}   callback  This function will be called when the set has been updated. No parameters.
   */
   updateTaskSetFromDb(id, editedObj, callback){
    axios.post("/api/updateTaskSet", {
      id: id,
      message: JSON.stringify(editedObj)
    }).then(data => {
          callback();
        });
  };

  /**
   * deleteTaskSetFromDb - Asynch call to remove a specific set from the DB. Takes the id of the set and a callback function.
   *
   * @param  {string}   idTodelete The MongoDB id of the set to delete.
   * @param  {function} callback   This function will be called when the set has been deleted from the DB. Use it to update the interface.
   */
   deleteTaskSetFromDb(idTodelete, callback){
    axios.post("/api/deleteTaskSet", {
        id: idTodelete
    }).then(response => {
      callback();
    });
  };

  /**
   * addChildToTaskSetDb - Add a child to the specified set. Takes the ID of the set and the child object to add.
   *
   * @param  {string}                   setID    The MongoDB id of the set to add the child to.
   * @param  {TaskObject/TaskSetObject} childObj The javascript object with the child data to add.
   */
   addChildToTaskSetDb(setID, childObj){
    axios.post("/api/addChildToTaskSet", {
      setId: setID,
      childObj: childObj
    }).then(data => {});
  }

  /**
   * removeChildFromTaskSetDb - Remove a child from a set.
   *
   * @param  {string} setID   The MongoDB id of the set.
   * @param  {string} childId The MongoDB id of the child
   */
   removeChildFromTaskSetDb(setID, childId){
    axios.post("/api/removeChildFromTaskSet", {
      setId: setID,
      childId: childId
    }).then(data => {});
  }

  /**
   * deleteAllTaskSetsFromDb - Deletes all the sets in the DB. Use with care.
   *
   */
   deleteAllTaskSetsFromDb(){
    axios.delete("api/deleteAllTaskSets");
   };

   deleteAllLegacyTasksFromDb(){
     axios.delete("api/deleteAllLegacyTasks");
   };

  /**
   * getImage - Asynch load the image from the filepath.
   *
   * @param  {string}   filepath The filepath to load the image from.
   * @param  {function} callback This function is called with the result. Should take one parameter.
   */
   getImage(filepath, callback){
    axios.post("/api/getImage", {
      file: filepath
    }).then(data => {
      callback(data.data.data);
    });
  }

  /*
  ████████  █████  ███████ ██   ██      █████  ███    ██ ██████      ███████ ███████ ████████
     ██    ██   ██ ██      ██  ██      ██   ██ ████   ██ ██   ██     ██      ██         ██
     ██    ███████ ███████ █████       ███████ ██ ██  ██ ██   ██     ███████ █████      ██
     ██    ██   ██      ██ ██  ██      ██   ██ ██  ██ ██ ██   ██          ██ ██         ██
     ██    ██   ██ ███████ ██   ██     ██   ██ ██   ████ ██████      ███████ ███████    ██
  */

  queryAllTagValuesFromDB(queryType,callback){
    var queryCollection;
    if(queryType === db_objects.ObjectTypes.SET){
      queryCollection = 'TaskSets';
    }
    else if(queryType === db_objects.ObjectTypes.TASK){
      queryCollection = 'Synquestitasks';
    }
    else{
      console.log("Unknown query type: ", queryType);
      return;
    }

    axios.post("/api/getAllTagValues", {
      queryCollection: queryCollection,
    }).then((response) => {
      if(response.status === 200) {
        callback(queryCollection, response.data);
      }
      else {
        alert("Cannot find any tags in ", queryCollection);
        throw new Error("Database connection failed");
      }
    })
    .catch((error) => {
      console.log(error)
    });
  }


  /**
   * queryTasksFromDb - Asynch query of the Task or Set collection in the database.
   * Takes a bool to decide the collection to query, and a string to use for the query.
   * @param  {Boolean}  queryTasks  If true the Tasks collection is queried, otherwise the Set collection is queried.
   * @param  {String}   queryString The string to use as the query.
   * @param  {String}   queryCombination How to combine the queries. E.g. "AND" or "OR"
   * @param  {function} callback    This function will be called with the result of the query. The function should take two parameters.
   *                                The first will be the queried collection, the second will be the result of the query
   */
   queryTasksFromDb(queryType, queryString, queryCombination, callback){

     var queryCollection;
     if(queryType === db_objects.ObjectTypes.SET){
       queryCollection = 'TaskSets';
     }
     else if(queryType === db_objects.ObjectTypes.TASK){
       queryCollection = 'Synquestitasks';
     }
     else{
       console.log("Unknown query type: ", queryType);
       return;
     }

    axios.post("/api/getAllTasksContaining", {
      queryCollection: queryCollection,
      queryString: queryString,
      queryCombination: queryCombination
    }).then((response) => {
      if(response.status === 200) {
        callback(queryType, response.data);
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

  /**
   * getTasksOrTaskSetsWithIDs - Asynch Get tasks or sets with the specified ids.
   * @param  {string}   objIds   The ids to retrieve, should be in a list/array format.
   * @param  {function} callback This function is called with the result of the query. Should take one parameter.
   */
   getTasksOrTaskSetsWithIDs(wrapperSetId, callback) {
    axios.post("/api/getTasksOrTaskSetsWithIDs", {
        wrapperSetId: JSON.stringify(wrapperSetId)
    }).then(response => {
      callback(response.data.data, response.data.count, response.data.mainTaskSetName);
    });
  };

  /**
   * getTasksOrTaskSetsWithIDsPromise - Async Get tasks or sets with the specified ids. Can be made Synchronous by using await.
   *
   * @param  {string}   objIds   The ids to retrieve, should be in a list/array format.
   *
   * @return {list} Returns a list of Task and Set objects.
   */
  async getTasksOrTaskSetsWithIDsPromise(objIds) {
      console.log(objIds);
      return new Promise((resolve, reject) => {
        axios.post("/api/getTasksOrTaskSetsWithIDs", {
          wrapperSetId: JSON.stringify(objIds)
        }).then(response => {
            resolve(response.data.data);
        }, (errorResponse) => {
          console.log(errorResponse);
          reject(errorResponse);
        });
    })
  };

  /*
  ███████ ██   ██ ██████  ███████ ██████  ██ ███    ███ ███████ ███    ██ ████████
  ██       ██ ██  ██   ██ ██      ██   ██ ██ ████  ████ ██      ████   ██    ██
  █████     ███   ██████  █████   ██████  ██ ██ ████ ██ █████   ██ ██  ██    ██
  ██       ██ ██  ██      ██      ██   ██ ██ ██  ██  ██ ██      ██  ██ ██    ██
  ███████ ██   ██ ██      ███████ ██   ██ ██ ██      ██ ███████ ██   ████    ██
  */



  /**
   * getAllExperimentsFromDb - Queries the DB for all sets tagged as experiments
   *
   * @param  {function} callback This function is called with the esult of the query. The function should take one parameter.
   *                             A list of Set objects is passed.
   */
   getAllExperimentsFromDb(callback){
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

  /*
██████   █████  ██████  ████████ ██  ██████ ██ ██████   █████  ███    ██ ████████
██   ██ ██   ██ ██   ██    ██    ██ ██      ██ ██   ██ ██   ██ ████   ██    ██
██████  ███████ ██████     ██    ██ ██      ██ ██████  ███████ ██ ██  ██    ██
██      ██   ██ ██   ██    ██    ██ ██      ██ ██      ██   ██ ██  ██ ██    ██
██      ██   ██ ██   ██    ██    ██  ██████ ██ ██      ██   ██ ██   ████    ██
*/

  /**
   * getAllParticipantsFromDb - Asynch Query the DB for all participants. The result is passed to the callback function.
   *
   * @param  {function} callback This functiom will be called with the result of the query. The function should take one paramter.
   */
   getAllParticipantsFromDb(callback){
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

  /**
   * addParticipantToDb - Asynch add a new participant to the DB.
   *
   * @param  {ParticipantObject} obj       The participant object to add to the DB. Should use ParticipantObject defined in db_objects.js.
   * @param  {function}          callback  This function will be called with the MongoDB id assigned to the created participant. The function should take one parameter.
   */
   addParticipantToDb(obj, callback){
    axios.post("/api/addParticipant", {
      message: JSON.stringify(obj)
    })
    .then((response) => {
      if(response.status === 200) {
        callback(response.data._id);
      }
      else {
        alert("Something's wrong! Cannot log the current run into database.");
        throw new Error("Cannot log data");
      }
    });
  };

  /**
   * addNewLineToParticipantDB - Adds a new logging line to the specified participant.
   * Takes the MongoDB of the participant, and the new line data to add. Note that the
   * data should be stringified before calling this function.
   *
   * @param  {string}     participantId The MongoDB id of the participant
   * @param  {LineOfData} newLineJSON   The data to add to the participant. Should use LineOfData object defined in db_objects.js.
   */
   addNewLineToParticipantDB(participantId, newLineJSON){
    if (participantId === undefined) {
      return;
    }
    axios.post("/api/addNewLineToParticipant", {
      participantId: participantId,
      newLineJSON: newLineJSON
    }).then(response => {});
  };

  /**
   * addNewGlobalVariableToParticipantDB - Adds a new global variable to the specified participant.
   * Takes the MongoDB of the participant, and the new global variable to add. Note that the
   * data should be stringified before calling this function.
   *
   * @param  {string} participantId      The MongoDB id of the participant-
   * @param  {type}   globalVariableJSON The global variable object.
   */
   addNewGlobalVariableToParticipantDB(participantId, globalVariableJSON){
    if (participantId === undefined) {
      return;
    }
    axios.post("/api/addNewGlobalVariableToParticipant", {
      participantId: participantId,
      globalVariableJSON: globalVariableJSON //please stringify before calling this function
    }).then(response => {});
   };


  /*
   * deleteAllParticipantsFromDb - Deletes all the participants from the DB. Use with care.
   *
   */
   deleteAllParticipantsFromDb(callback) {
    axios.delete("/api/deleteAllParticipants").then(() => callback());
   }

   /*
    * deleteAllParticipantsFromDb - Deletes all the participants from the DB. Use with care.
    *
    */
    deleteParticipantFromDb(participantId, callback) {
     axios.post("/api/deleteParticipant", {
       id:participantId
     }).then(() => callback());
    }

    /**
     * getTasksOrTaskSetsWithIDsPromise - Async Get tasks or sets with the specified ids. Can be made Synchronous by using await.
     *
     * @param  {string}   objIds   The ids to retrieve, should be in a list/array format.
     *
     * @return {list} Returns a list of Task and Set objects.
     */
    async deleteParticipantFromDbPromise(participantId) {
        return new Promise((resolve, reject) => {
          axios.post("/api/deleteParticipant", {
            id:participantId
          }).then(response => {
              resolve();
          }, (errorResponse) => {
            reject(errorResponse);
          });
      })
    };

   /*
██████   ██████  ██      ███████ ███████
██   ██ ██    ██ ██      ██      ██
██████  ██    ██ ██      █████   ███████
██   ██ ██    ██ ██      ██           ██
██   ██  ██████  ███████ ███████ ███████
*/
 getAllRolesFromDb(callback){
    fetch("/api/getAllRoles")
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
        callback(res.roles)
      })
      .catch((error) => {
        console.log(error)
      });
  };

   addRoleToDb(name){
    axios.post("/api/addRole", {
      role: name
    })
    .then((response) => {
      if(response.status === 200) {
      }
      else {
        alert("Something's wrong! Cannot log the current run into database.");
        throw new Error("Cannot log data");
      }
    });
  };

  deleteRoleFromDb(role, callback){
     axios.post("/api/deleteRole", {
         role: role
     }).then(response => {
       callback();
     });
   };

   deleteAllRolesFromDb(callback) {
    axios.delete("/api/deleteAllRoles").then(() => callback());
   }

   /*
    ██████  ██████  ███████ ███████ ██████  ██    ██ ███████ ██████      ███    ███ ███████ ███████ ███████  █████   ██████  ███████ ███████
   ██    ██ ██   ██ ██      ██      ██   ██ ██    ██ ██      ██   ██     ████  ████ ██      ██      ██      ██   ██ ██       ██      ██
   ██    ██ ██████  ███████ █████   ██████  ██    ██ █████   ██████      ██ ████ ██ █████   ███████ ███████ ███████ ██   ███ █████   ███████
   ██    ██ ██   ██      ██ ██      ██   ██  ██  ██  ██      ██   ██     ██  ██  ██ ██           ██      ██ ██   ██ ██    ██ ██           ██
    ██████  ██████  ███████ ███████ ██   ██   ████   ███████ ██   ██     ██      ██ ███████ ███████ ███████ ██   ██  ██████  ███████ ███████
   */
   getAllObserverMessagesFromDb(callback){
     fetch("/api/getAllObserverMessages")
      .then((response) => {
         if(response.ok) {
           return response.json();
         }
       })
       .then(res => {
         callback(res.messages);
       }).catch((err) => {})
   };

   getAllMessagesFromAnObserverFromDb(name, role, callback) {
     axios.post("/api/getAllMessagesFromAnObserver", {
       name: name,
       role: role })
       .then(response => {
         callback(response.data.messages);
       });
    }

    getAllMessagesForAParticipantFromDb(participantId, callback) {
      axios.post("/api/getAllMessagesForAParticipant", {
        participantId: participantId
      }).then(response => {
        callback(response.data.messages);
      })
    }

    getAllMessagesForALineOfDataFromDb(lineOfDataId, callback) {
      axios.post("/api/getAllMessagesForALineOfData", {
        lineOfDataId: lineOfDataId
      }).then(response => {
        callback(response.data.messages);
      });
    }

    addNewObserverMessageToDb(message) {
     axios.post("/api/addNewObserverMessage", {
       observerMessage: JSON.stringify(message)
     }).then(response => {});
    }

    deleteAMessageFromDb(info) {
      axios.post("/api/deleteAMessage", {
        info: JSON.stringify(info)
      }).then(response => {});
    }

    deleteAllMessagesForParticipantFromDb(participantId) {
      axios.post("/api/deleteAllMessagesForParticipant", {
        participantId: participantId
      }).then(response => {});
    }

    deleteAllMessagesFromObserverFromDb(name, role) {
      axios.post("/api/deleteAllMessagesFromObserver", {
        name: name,
        role: role
      }).then(response => {});
    }

    deleteAllMessagesFromDb() {
      axios.post("/api/deleteAllMessages").then(response => {});
    }

    /*
 ██████   █████  ███████ ███████     ██████   █████  ████████  █████
██       ██   ██    ███  ██          ██   ██ ██   ██    ██    ██   ██
██   ███ ███████   ███   █████       ██   ██ ███████    ██    ███████
██    ██ ██   ██  ███    ██          ██   ██ ██   ██    ██    ██   ██
 ██████  ██   ██ ███████ ███████     ██████  ██   ██    ██    ██   ██
*/

    saveGazeData(participantId, task, gazeData) {
      axios.post("/api/saveGazeData", {
        participantId: participantId,
        task: task,
        gazeData: JSON.stringify(gazeData)
      });
    }

    /*
    ██ ███    ███  █████   ██████  ███████     ██    ██ ██████  ██       ██████   █████  ██████  ██ ███    ██  ██████
    ██ ████  ████ ██   ██ ██       ██          ██    ██ ██   ██ ██      ██    ██ ██   ██ ██   ██ ██ ████   ██ ██
    ██ ██ ████ ██ ███████ ██   ███ █████       ██    ██ ██████  ██      ██    ██ ███████ ██   ██ ██ ██ ██  ██ ██   ███
    ██ ██  ██  ██ ██   ██ ██    ██ ██          ██    ██ ██      ██      ██    ██ ██   ██ ██   ██ ██ ██  ██ ██ ██    ██
    ██ ██      ██ ██   ██  ██████  ███████      ██████  ██      ███████  ██████  ██   ██ ██████  ██ ██   ████  ██████
    */

    uploadImage(fileName, image, config, name, callback) {
      axios.post("/api/uploadImage", image, name, config).then(response => {
        console.log("upload image: ", response);
      });
    }

    getAllImages(callback) {
      fetch("/api/getAllImages")
       .then((response) => {
          if(response.ok) {
            return response.json();
          }
        })
        .then(res => {
          callback(res.images);
        }).catch((err) => {})
    }

    /*
    ██████   █████  ████████  █████      ███████ ██   ██ ██████   ██████  ██████  ████████  █████  ████████ ██  ██████  ███    ██
    ██   ██ ██   ██    ██    ██   ██     ██       ██ ██  ██   ██ ██    ██ ██   ██    ██    ██   ██    ██    ██ ██    ██ ████   ██
    ██   ██ ███████    ██    ███████     █████     ███   ██████  ██    ██ ██████     ██    ███████    ██    ██ ██    ██ ██ ██  ██
    ██   ██ ██   ██    ██    ██   ██     ██       ██ ██  ██      ██    ██ ██   ██    ██    ██   ██    ██    ██ ██    ██ ██  ██ ██
    ██████  ██   ██    ██    ██   ██     ███████ ██   ██ ██       ██████  ██   ██    ██    ██   ██    ██    ██  ██████  ██   ████
    */

    async exportToCSV(data, callback){
      return new Promise((resolve, reject) => {axios.post("/api/exportToCSV", {
        data: JSON.stringify(data)
      }).then(response => {
        resolve(response.data);
      }, (errorResponse) => {
        reject(errorResponse);
      })});
    };
}
export default new db_helper();
