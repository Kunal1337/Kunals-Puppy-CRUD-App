# 🐕 Kunal's Puppy CRUD App

A full-stack web application for managing puppies using React, Express.js, and PostgreSQL.

## 🚀 Features

- **Create**: Add new puppies with name, breed, weight, and vaccination status
- **Read**: View all puppies in a responsive table
- **Update**: Toggle vaccination status for puppies
- **Delete**: Remove puppies with confirmation
- **Real-time updates**: Automatic refresh after operations

## 🛠️ Tech Stack

### Frontend
- **React** 19.1.1 - UI Framework
- **Vite** 7.1.7 - Build tool and dev server
- **Axios** - HTTP client for API calls

### Backend
- **Express.js** - Web framework
- **Sequelize** - ORM for database operations
- **PostgreSQL** - Database
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Database
- **PostgreSQL** hosted on Render.com
- **animal_db** database with **puppies** table

## 📁 Project Structure

```
Lab10/
├── Backend/
│   ├── .env                 # Environment variables
│   ├── .gitignore          # Backend gitignore
│   ├── package.json        # Backend dependencies
│   └── Server.js           # Express server with API routes
├── Frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── App.css         # Styles
│   │   └── main.jsx        # React entry point
│   ├── .env                # Frontend environment variables
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
├── .gitignore              # Main gitignore
└── README.md               # This file
```

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (Render.com or local)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kunal1337/Kunals-Puppy-CRUD-App.git
   cd Kunals-Puppy-CRUD-App
   ```

2. **Setup Backend**
   ```bash
   cd Backend
   npm install
   ```
   
   Create `.env` file with:
   ```
   DATABASE_URL=your_postgresql_connection_string
   PORT=5000
   ```

3. **Setup Frontend**
   ```bash
   cd ../Frontend
   npm install
   ```
   
   Create `.env` file with:
   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```

### 🚀 Running the Application

1. **Start the Backend** (Terminal 1)
   ```bash
   cd Backend
   node Server.js
   ```

2. **Start the Frontend** (Terminal 2)
   ```bash
   cd Frontend
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🗄️ Database Schema

```sql
CREATE TABLE puppies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(100),
    weight_lbs DECIMAL(5,2),
    arrival_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vaccinated BOOLEAN DEFAULT FALSE
);
```

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/puppies` | Get all puppies |
| GET | `/puppies/:id` | Get puppy by ID |
| POST | `/puppies` | Create new puppy |
| PUT | `/puppies/:id` | Update puppy |
| DELETE | `/puppies/:id` | Delete puppy |

## 🎨 UI Components

- **Header**: App title and description
- **AddPuppyForm**: Form to add new puppies
- **PuppyTable**: Display puppies with action buttons
- **Body**: Main content container with state management
- **Footer**: Simple footer with copyright

## 🚀 Deployment

This application is designed to be deployed on Render.com:

1. **Backend**: Deploy as a Web Service
2. **Frontend**: Deploy as a Static Site
3. **Database**: PostgreSQL hosted on Render

## 👨‍💻 Author

**Kunal** - Full Stack Developer

## 📝 License

This project is created for educational purposes as part of a web development lab assignment.

---

Built with ❤️ using React + Express + PostgreSQL