# PURSCLIQ TO-DO LIST API
A Task management API that authenticates users and allows them save, schedule and manage tasks.

## AUTHOR
JOSHUA ONWUEMENE

## FEATURES
- Authentication and Authorization
- Password reset
- Task management (create tasks, retrieve all or selected tasks, modify and delete tasks)
- Send tasks from user to user via email
- Generate Pdf document of task

## HOW TO USE (POSTMAN)
### Sign Up
1. Enter the url <a href="http://localhost:5000/user/signup/">http://localhost:5000/user/signup/</a> to signup.
2. Enter "firstName", "lastName", "userId", "email", and "password" fields.
3. Send a POST request to the URL above.

### Sign In
1. Enter the url <a href="http://localhost:5000/user/signin/">http://localhost:5000/user/signin/</a> to signin.
2. Enter the "email" and "password" fields.
3. Send a POST request to the URL above.

### Sign Out
Send a POST request to <a href="http://localhost:5000/user/signout/">http://localhost:5000/user/signout/</a> to log out.

### Reset and Update Password
1. Send a POST request to <a href="http://localhost:5000/user/resetPassword/">http://localhost:5000/user/resetPassword/</a> receive a reset link via mail.
2. Copy link to Postman and send a PATCH request with new password as body.

### Create, retreive, Modify and Delete tasks
- POST <a href="http://localhost:5000/user/signin/tasks/">http://localhost:5000/user/signin/tasks/</a> : Create task

- GET <a href="http://localhost:5000/user/signin/tasks/received/">http://localhost:5000/user/signin/tasks/total/</a> : Retrieve tasks created and received
- GET <a href="http://localhost:5000/user/signin/tasks/">http://localhost:5000/user/signin/tasks/</a> : Retrieve your tasks
- GET <a href="http://localhost:5000/user/signin/tasks/:id">http://localhost:5000/user/signin/tasks/:id/</a> : Retrieve a specific task by id

- PATCH <a href="http://localhost:5000/user/signin/tasks/:id/">http://localhost:5000/user/signin/tasks/:id</a> : Modify a task

- DELETE <a href="http://localhost:5000/user/signin/tasks/:id/">http://localhost:5000/user/signin/tasks/:id</a> : Delete a task
- DELETE <a href="http://localhost:5000/user/signin/tasks/">http://localhost:5000/user/signin/tasks/</a> : Delete all tasks

### Send task to mail
- POST <a href="http://localhost:5000/user/signin/tasks/mail">http://localhost:5000/user/signin/tasks/mail</a>

### Export as PDF
1. Enter "taskName" at URL below
2. POST <a href="http://localhost:5000/user/signin/tasks/createFile">http://localhost:5000/user/signin/tasks/createFile</a>


