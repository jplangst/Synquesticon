start mosquitto -v -c ./mosquitto.conf
cd backend
start node server.js
cd ..
start npm start
exit 0