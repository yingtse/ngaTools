Project Name:	SkyhookMap

Dependencies:	1. skyhook_test.py
		2. skyhookMap.html
		3. skyhookMap.js

Set-up:		1. Install Python (v2.7 preferred)
		2. pip install libraries (bottle, requests, geojson)
			-open command prompt
			-navigate to folder where Python is install
			-(typically C:/python27)
			-navigate to ../scripts
			-type "pip install bottle"
			-hit enter
			-repeat "pip install" step for all libraries
		3. check internal ip address
			-type "ipconfig"
			-copy the IPv4 Address under Ethernet adapter Local Area Connection
		4. replace the ip in the .py with your ip
		5. replace the ip in the .html with your ip (line 78)

Use:		1. launch skyhook_test.py
		2. launch skyhookMap.html in your browser