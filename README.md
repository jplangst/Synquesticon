# Synquesticon

<p>Dependencies that must be installed:</p>
<ul>
  <li>Node.js (https://nodejs.org/en/)</li>
  <li>MongoDB (https://www.mongodb.com/)</li>
  <li>
    Crossbar (https://crossbar.io/) - Crossbar windows installation instructions:
    <ol>
      <li>Python 3.7.x should be installed and setup correctly on the windows path (If a different version of python3 is used the  files mentioned later must be replaced with versions to match the python version, Python 2 is not supported)
      </li>
      <li>
        Download the following .whl files
        <ul>
          <li>From https://www.lfd.uci.edu/~gohlke/pythonlibs/#snappy download python_snappy‑0.5.4‑cp37‑cp37m‑win_amd64.whl</li>
          <li>From https://www.lfd.uci.edu/~gohlke/pythonlibs/#twisted download Twisted‑19.10.0‑cp37‑cp37m‑win_amd64.whl</li>
        </ul>
      </li>
      <li>
        Open CMD with admin rights and write the following commands:
        <ul>
          <li>pip install PyWin32</li>
          <li>pip install C:\Downloads\python_snappy‑0.5.4‑cp37‑cp37m‑win_amd64.whl
(Replace path to match download location)
          </li>
          <li>pip install C:\Downloads\Twisted‑19.10.0‑cp37‑cp37m‑win_amd64.whl
(Replace path to match download location)
          </li>
          <li>pip install crossbar</li>
        </ul>
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
