# Respect Meter Full-Stack webapp

**Disclaimer:** 
Please note that the **Respect Meter** web app's design is not the main focus of this project. The primary emphasis is on the underlying **code** and **logic** behind the app. The user interface and design are simple and may not be polished, as they are not the focus of this development. If you are reviewing the project, I encourage you to focus on the functionality and the structure of the code.


The **Respect Meter** web app is a tool for users to track and commit to their habits. By adding habits and monitoring their progress, users can receive feedback on how well they are staying on track. The app uses a **Respect Meter** to visualize the user's commitment, with the percentage of progress calculated via the **OpenAi ChatGPT API**.

## Features

- **Habit Tracking**: Users can add, view, and manage their habits.
- **Commitment System**: Users can commit to a habit and monitor their progress.
- **Respect Meter**: The app provides a dynamic gauge showing the user's percentage of commitment.
- **Interactive Progress**: The progress is visually shown through a meter, with feedback messages based on user progress.
- **Data Persistence**: The user's habit information is stored in a MongoDB database.
  
## Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **API Integration**: ChatGPT API for progress calculation
- **Styling**: CSS (for custom UI design) + bootstrap
  
## Installation

To run the project locally, follow these steps:

### Prerequisites

Ensure you have the following software installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) (or MongoDB Atlas for cloud database)

### Step-by-Step Installation

1. Clone the repository:
    
    git clone https://github.com/awsaqh/respect-meter.git
    

2. Navigate to the project directory:
    
    cd respect-meter
    
3. Install frontend dependencies:
   
    npm install

4. Install backend dependencies:
    
    cd NodeServer
    npm install
    


    

5. Set up your environment variables:
    - In the backend, create a `.env` file and include your **ChatGPT API** credentials and MongoDB connection string.

6. Start the backend server:
    
    node app.js
   

7. Start the frontend server:
    
   
    npm run dev
    

8. Open your browser and visit:
    
    http://localhost:<port number>
    

## Usage

1. **Create a New Habit**: Click on the "+" button to add a new habit. Specify the habit's name, importance level, and duration.
2. **Commit to a Habit**: Once you add a habit, click on the "Commit" button to track your progress.
3. **Monitor Your Progress**: The **Respect Meter** will display your current progress as a percentage, reflecting how committed you are to your habit.
4. **Track Multiple Habits**: You can track multiple habits and interact with each habit individually.


## Contributing

If you would like to contribute to this project, follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-name`)
3. Commit your changes (`git commit -am 'Add feature'`)
4. Push to the branch (`git push origin feature-name`)
5. Open a pull request

Please make sure your code adheres to the project's coding standards and passes existing tests before submitting a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **ChatGPT API**: Used for calculating the respect meter percentage.
- **MERN Stack**: For the technology stack powering this web app.
- **React.js**: For building the frontend UI.
