📖📖♻️♻️

Readcycle is a peer-to-peer book exchange platform where readers can donate, borrow, and share books effortlessly. It connects book enthusiasts, allowing them to pass on knowledge through book exchanges, leave reviews, and earn points for contributing to the community. It also encourages donors to contribute more books by allowing them to earn both money and points. Donors are notified whenever someone borrows their books, and they earn additional points each time their books are borrowed within the ecosystem. These points can then be traded for rewards. Whether you're looking to donate your old books or find your next great read, Readcycle makes the process seamless and community-driven.

Link to PRD: https://www.notion.so/PRD-Readcycle-11d92eb0b3d580f9bec0e736d5e7888e?pvs=4

Setup Instructions:

Clone the Repository:

git clone git@github.com:wjacobw/ReadCycle.git

cd Readcycle.ai

Docker Setup:

Start Docker containers (frontend, backend, and database) using Docker Compose:

docker-compose up --build

Install Dependencies:

After Docker containers are up, install npm packages for both the frontend and backend.

Navigate to the frontend folder:

cd frontend

npm install

Navigate to the backend folder:

cd ../backend

npm install

Rename .env.sample to .env:

For both frontend and backend, copy the environment file template to a .env file:

cp frontend/.env.example frontend/.env

cp backend/.env.example backend/.env

Run the Application:

Once the Docker containers are up and dependencies are installed:
Go to http://localhost:3000/

enjoy!
