# Attendance System

An attendance system built with HTML, CSS, JavaScript, Bootstrap, jQuery, and a JSON server as the backend and database.

## Features

- 3 roles: Admin, SubAdmin (security), and users
- User can view their own data (username, email, address, etc.)
- User can view their last login time
- User can view their daily and monthly status (late, excuse, absence)
- User can view the number of times of their status during the month
- SubAdmin can assign daily attendance for any user 
- SubAdmin can search for any user to view their data
- Admin can take attendance and make excuses for employees
- Admin can view all data for all users in a datatable and in easy-to-read charts
- Admin can download reports for all users with their statistics in charts as a PDF

## Conclusion

The Attendance System is a simple, easy-to-use solution for managing attendance records. It is built using HTML, CSS, JavaScript, Bootstrap, jQuery, and JSON server as a backend and database. It allows users to mark their attendance, view their attendance status, and for administrators to manage attendance records and search for other users' attendance records, download reports in the form of PDF.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Installation

1. Clone the repository:

```yaml
git clone <https://github.com/sohailaalhakim/attendance-system.git>
```

2. Install dependencies:

  ```yaml
  npm install
  ```
  
3. Start JSON server by running  

  ```yaml
  json-server --watch db.json
  ```

<!-- 4. Start the development server by running

  ```yaml
  npm start -->
  ```

4. Run the application

## Usage

### User

1. Register an account and wait an acception
from admin or login if you already have one.
2. Wait for admin to accept your account.
3. Then you can login and view your daily and monthly attendance records.
4. Your admin or SubAdmin  assign attendance for you.
5. Check your attendance status and coming time.
6. View your profile name, email, address, etc.
7. Logout.

### SubAdmin

1. Login with your account.
2. Assign attendance for any user.
3. View any user's data.
4. Search for any user to view their data.
5. View your profile name, email, address, etc.
6. Logout.

### Admin

1. Login with your account.
2. Accept or reject any user's account.
3. Take attendance for any user.
4. Make excuses for any user.
5. View all users' data in a datatable.
6. View all users' data in charts.
7. Download reports for all users with their statistics in charts as a PDF.
8. View your profile name, email, address, etc.
9. Logout.

## Screenshots

TODO

## Built With

- [HTML 5](https://www.w3schools.com/html/)
- [CSS 3](https://www.w3schools.com/css/)
- [JavaScript](https://www.javascript.com/)
    - ES6
    - AJAX
    - Local Storage
- [Bootstrap](https://getbootstrap.com/)
- [jQuery](https://jquery.com/)
- [JSON Server](https://www.npmjs.com/package/json-server)
- [SMTP.js](https://smtpjs.com/)
  - Send email from Javascript to new users.
- [Sweet Alert 2](https://sweetalert2.github.io/)
  - A beautiful, responsive, customizable, accessible (WAI-ARIA) replacement for JavaScript's popup boxes.
- [Chart.js](https://www.chartjs.org/)
  - Simple yet flexible JavaScript charting for designers & developers.
- [jsPDF](https://parall.ax/products/jspdf)
  - Client-side JavaScript PDF generation for everyone.
- [Font Awesome](https://fontawesome.com/)
  - Get vector icons and social logos on your website with Font Awesome, the web's most popular icon set and toolkit.
  
## Authors

- [Sohaila Elhakim](https://github.com/sohailaalhakim)

<!-- ## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details -->
