Simple Task for co-worker:

Description 
Build a Full-Stack web application for managing restaurant reservations.

---

Backend \- Rest-api with this CRUD operations

* GET /api/reservations \- fetch all reservations  
* POST /api/reservations \- create new reservation (name, date, time, number of guests)  
* PUT /api/reservations/{id} \- update status: pending / confirmed / cancelled  
* Database: In-Memory or SQLite \- both are fine  
* Admin login required to confirm or cancel reservations  
* After a reservation is created, the customer receives a confirmation email with a cancellation link  
* Nice to have: a small menu list with dishes and prices, prices can be updated by the Admin

---

Frontend \- your choice

* Admin area: list of all reservations with status management  
* Public form: customer can create a new reservation  
* Framework: React, Angular, Blazor, Vue, or plain HTML/CSS \- you are free to choose

---

Infrastructure, mandatory

* Dockerfile for Backend / Frontend  
* docker-compose.yml, everything runs on the server with one command: docker compose up

