import axios from 'axios';

//this class is responsible to sending messages to the server
class courier {
  exportToCSV(data, callback){
    axios.post("/api/exportToCSV", {
      data: JSON.stringify(data)
    })
    .then((response) => {
      callback(response.status + " " + response.statusText);
    });
 };

 exportAllToCSVs(callback) {
   axios.post("/api/exportAllToCSVs").then((response) => {
     callback(response.status + " " + response.statusText);
   });
 }
}

export default new courier();
