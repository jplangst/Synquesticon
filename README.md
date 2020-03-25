# Synquesticon

<p>Dependencies that must be installed:</p>
<ul>
  <li>Node.js (https://nodejs.org/en/)</li>
  <li>MongoDB (https://www.mongodb.com/)</li>
  <li>
    Mosquitto (https://mosquitto.org/download/) - Mosquitto windows installation instructions:
    <ol>
      <li>
        Download and install mosquitto using the x64 installer
      </li>
      <li>
        Edit the mosquitto.conf file in the installation directory as Admin and add the following lines:
        <ul>
          <li>port 1884</li>
          <li>listener 9001 </li>
          <li>protocol websockets</li>
        </ul>
      </li>
      <li>
        Create a bat file at your desired location and add the following: 
        <ul>
          <li>cd C:/Program Files/mosquitto (use your path)</li>
          <li>mosquitto -v -c ./mosquitto.conf </li>
        </ul>
      </li>
      <li>
        Use this bat file to start the mosquitto mqtt broker 
      </li>
    </ol>
  </li>  
</ul>

<p>Installation instructions:</p>
<ul>
  <li>In the WebEntry dir - cmd npm install</li>
  <li>In the WebEntry/backend dir - cmd npm install</li>
</ul>

How to run:
Use the launcher.bat file.
