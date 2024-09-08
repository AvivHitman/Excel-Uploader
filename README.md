# Excel File Upload Management System

This project manages the uploading and processing of Excel files, storing metadata in a database, and updating the status of each file in real-time using WebSockets. 
The system also supports queuing for file uploads, ensuring that no more than 5 files are processed at a time.

## Features
- **File Upload**: Upload Excel files containing customer data.
- **File Processing**: The data within the Excel file is parsed and each row (representing a customer) is stored in the customers table.
- **Real-Time Updates**: A WebSocket is used to push real-time updates to the React frontend, which displays the current status of each file (e.g., "uploading", "pending", "completed").
- **Queue Management**: The system can only upload 5 files simultaneously. Any additional uploads go into a pending queue.
- **Containerized Services**: Uses Docker to configure and run services such as MariaDB, Redis, NestJS, and ReactJS.
  
- **Save Files In Folders** - In the NestJS container, two folders created to handle Excel files:
  - ExcelUploads – This folder will store the uploaded Excel files.
  - ExcelPending – This folder will store temporary pending Excel files before they are fully processed.
  - 
- **User Actions** -
  - Info: Clicking on this shows the Excel rows in a table format.
  - Download: Allows the user to download the Excel file.
  - Remove: Deletes the uploaded file.


### Docker Containers
This project uses four Docker containers to handle the different services required by the system:

1. **MariaDB**: Database to store user, file metadata, and customer data.
2. **Redis**: Used for managing real-time updates and queues.
3. **NestJS**: Backend API and WebSocket server to handle file uploads and process the queue.
4. **ReactJS (Redux)**: Frontend application for managing and interacting with the system, including uploading files and tracking their status.


## Setup and Installation
### 1. Clone the Repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Docker Setup
```bash
docker-compose up --build
```

### 3. Backend Configuration

Configure the .env file with your MariaDB credentials:

```bash
DB_HOST=mariadb
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
```

### 4. Accessing the Application
- Frontend: Go to `http://localhost:3001` in your browser to access the React app.
- Backend: The NestJS API will be running at `http://localhost:3000`.
