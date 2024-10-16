# BrainMinder - Backend for Frontend
 
## Project Folder Structure

- Classes: Contains the definition of entities (classes), which represent the main objects used in the application.
- Controllers: Responsible for managing the application's endpoints. This is where the functions that handle HTTP requests are defined, calling the implementations and returning the appropriate responses.
- Implementations: Contains the implementations of each endpoint, as well as all the associated business logic.
- **models**: Includes the database schemas (MongoDB) defined with Mongoose.
- **plugins**: Additional configurations and plugins used in MongoDB, such as encryption functionalities and Mongoose extensions.
- **routes**: Where the API routes are defined. These routes connect the endpoints to the appropriate controllers.
- **services**: Auxiliary services, such as authentication, sending emails, and other functionalities isolated from the application's main logic.
- **validators**: Contains data validations for requests, ensuring that user inputs are correct before they are processed.
- **commons**: Interfaces, request bodies and validators that are shared between the backend and the frontend. This folder centralizes all reusable resources to avoid code duplication.


## Technologies Used

- **axios**: ^1.4.0 - HTTP client for making external requests.
- **bcrypt**: ^5.1.1 - Hash library for password encryption.
- **bcryptjs**: ^2.4.3 - Alternative to bcrypt, used for password encryption.
- **body-parser**: ^1.20.0 - Middleware for handling the body of HTTP requests.
- **celebrate**: ^15.0.3 - Validation of API entries based on Joi.
- **cors**: ^2.8.5 - Middleware to allow requests from different sources (Cross-Origin Resource Sharing).
- **dot-object**: ^2.1.4 - Tool for manipulating JSON objects, useful for transforming and mapping data.
- **express**: ^4.17.3 - Web framework for building fast and robust APIs in Node.js.
- **jsonwebtoken**: ^9.0.2 - For generating and validating JWT tokens (JSON Web Tokens).
- **moment**: ^2.30.1 - Library for manipulating and formatting dates.
- **mongoose**: ^6.2.9 - ORM for data modeling and integration with MongoDB.
- **node-schedule**: ^2.1.1 - Scheduling tasks in Node.js (e.g. running periodic tasks).
- **nodemailer**: ^6.8.0 - Library for sending emails.
- **zod**: ^3.22.4 - Library for data validation with typed security.
- **mongodb-client-encryption**: ^6.1.0 - Tool for data encryption in MongoDB.


## Notes
- Different repositories will be used for each part of the project: Front-end, Back for Front and Front for AI.
