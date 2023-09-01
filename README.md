# PURSCLIQ TASK TRACKER API
A Task Tracking system that authenticates users and allows them save, schedule and manage tasks.

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
1. Enter the url <a href="https://task-manager-4qtw.onrender.com/auth/signup/">https://task-manager-4qtw.onrender.com/auth/signup/</a> to signup.
2. Enter "firstName", "lastName", "email", and "password" fields.
3. Send a POST request to the URL above.

### Sign In
1. Enter the url <a href="https://task-manager-4qtw.onrender.com/auth/signin/">https://task-manager-4qtw.onrender.com/auth/signin/</a> to signin.
2. Enter the "email" and "password" fields.
3. Send a POST request to the URL above.

### Sign Out
Send a POST request to <a href="https://task-manager-4qtw.onrender.com/auth/signout/">https://task-manager-4qtw.onrender.com/user/signout/</a> to log out.

### Reset and Update Password
1. Send a POST request to <a href="https://task-manager-4qtw.onrender.com/auth/reset">https://task-manager-4qtw.onrender.com/auth/reset/</a> receive a reset link via mail.
2. Copy link to Postman and send a PATCH request with new password as body.

### Create, retreive, Modify and Delete tasks
- POST <a href="https://task-manager-4qtw.onrender.com/api/tasks/">http://https://task-manager-4qtw.onrender.com/api/tasks/</a> : Create task

- GET <a href="https://task-manager-4qtw.onrender.com/api/tasks/received/">http://https://task-manager-4qtw.onrender.com/api/tasks/total/</a> : Retrieve tasks created and received
- GET <a href="https://task-manager-4qtw.onrender.com/api/tasks/">http://https://task-manager-4qtw.onrender.com/api/tasks/</a> : Retrieve your tasks
- GET <a href="https://task-manager-4qtw.onrender.com/api/tasks/:id">http://https://task-manager-4qtw.onrender.com/api/tasks/:id/</a> : Retrieve a specific task by id

- PATCH <a href="https://task-manager-4qtw.onrender.com/tasks/:id/">http://https://task-manager-4qtw.onrender.com/api/tasks/:id</a> : Modify a task

- DELETE <a href="https://task-manager-4qtw.onrender.com/tasks/:id/">https://task-manager-4qtw.onrender.com/api/tasks/:id</a> : Delete a task
- DELETE <a href="https://task-manager-4qtw.onrender.com/tasks/">https://task-manager-4qtw.onrender.com/api/tasks/</a> : Delete all tasks

### Send task to mail
- POST <a href="https://task-manager-4qtw.onrender.com/tasks/mail">http://https://task-manager-4qtw.onrender.com/api/tasks/mail</a>

### Export as PDF
1. Enter "taskName" at URL below
2. POST <a href="https://task-manager-4qtw.onrender.com/api/tasks/createFile">http://https://task-manager-4qtw.onrender.com/api/tasks/createFile</a>


