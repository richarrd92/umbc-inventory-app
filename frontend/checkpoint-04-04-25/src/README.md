### Frontend With Vite + React and Tailwind CSS

This guide will provide instructions for setting up and running the frontend for our Retriever's Essentials Inventory App. The frontend has been created using Vite + React and Tailwind CSS. Vite and React act as the scaffolding to

```

frontend/
│──/node_modules 
│──/public
│── /src
│──│──/assets
│──│──/components
│──│──│──/ui
│──│──/hooks
│──│──/pages
│──│──│──Analytics.css
│──│──│──Analytics.jsx
│──│──│──ErrorPage.css
│──│──│──ErrorPage.jsx
│──│──│──Inventory.css
│──│──│──Inventory.jsx
│──│──│──Login.css
│──│──│──Login.jsx
│──│──│──PreviousOrders.jsx
│──│──│──RestockOrders.jsx
│──│──/services
│──│──│──/api
│──│──/utils
│──│──App.css
│──│──App.jsx
│──│──index.css
│──│──main.jsx
│──eslint.config.js
│──index.html
│──package-lock.json
│──package.json
│──vite.config.js

```

### Prerequisites

Before starting the frontend, ensure you have Node.js installed on your computer.

#### Windows Installation of Node.js

1. Either download the prepackaged Windows .msi installer at https://nodejs.org/en/download, or enter the following commands into a Powershell terminal:

```
# Download and install fnm:
winget install Schniz.fnm

# Download and install Node.js:
fnm install 22

# Verify the Node.js version:
node -v # Should print "v22.14.0".

# Verify npm version:
npm -v # Should print "10.9.2".

```

#### Linux Installation of Node.js

1. Either download the standalone binary file of Node.js at https://nodejs.org/en/download or enter the following commands into a Bash shell:

   ```
   # Download and install fnm:
   curl -o- https://fnm.vercel.app/install | bash

   # Download and install Node.js:
   fnm install 22

   # Verify the Node.js version:
   node -v # Should print "v22.14.0".

   # Verify npm version:
   npm -v # Should print "10.9.2".

   ```

#### MacOS Installation of Node.js

1. Either download a prepackaged MacOS .pkg installer of Node.js at https://nodejs.org/en/download or enter the following commands into a Bash terminal:

   ```
   # Download and install fnm:
   curl -o- https://fnm.vercel.app/install | bash

   # Download and install Node.js:
   fnm install 22

   # Verify the Node.js version:
   node -v # Should print "v22.14.0".

   # Verify npm version:
   npm -v # Should print "10.9.2".

   ```

### Setup Instructions

1. After installing Node.js, open two terminals, one to run the frontend and the other to run the backend.
2. Change directories in one terminal to the frontend with `cd frontend` and the other to the backend with `cd backend`
3. In the backend terminal, if you have not already created a virtual environment, do so now by running the command: `python3.12 -m venv venv`
4. Activate the virtual environment by running: `.\venv\Scripts\activate` (on Windows) or `source venv/bin/activate` (on Linux)
5. If the database tables are not initialized already, before running the backend, run: `ipython3 database.py` or `python3 database.py`
6. Run the file main.py in the backend by running: `ipython3 main.py` or `python3 main.py`
7. Once the database server is initialized, if this is your first time running the frontend, run `npm install` in the frontend terminal to install the required dependencies.
8. To install Axios, which is required for our API calls to the backend, run the command: `npm install axios`
9. To install Tailwind CSS, run the command: `npm install tailwindcss @tailwindcss/vite`
10. To run the frontend, run `npm run dev` if you are developing, else run `npm run build` and `npm preview` .
11. If you used `npm run dev`, enter o after Vite starts up to open the frontend at https://localhost:5173 (the port number might be different for your machine), otherwise the frontend will open automatically at https://localhost:5173
