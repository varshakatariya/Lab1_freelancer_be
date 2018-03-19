Step to run Freelancer prototype: 

1. client installation: 

a. Copy project structure on local machine and open cmd. Give project freelancer_ui folder path and run 'npm install' command
b. Now run command npm start to start client server


2. server installation: 

a. Copy project structure on local machine and open cmd. Give project freelancer_be folder path and run 'npm install' command
b. Now run command set PORT=3001 npm start to start server of project on 3001
c. Now again run command nodemon to start the server

3. SQL DB : 

Open my SQL to run below SQL scripts in Database : 

1. CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `email_id` varchar(45) NOT NULL,
  `password` varchar(1000) NOT NULL,
  `contact` varchar(45) DEFAULT NULL,
  `about_me` varchar(45) DEFAULT NULL,
  `skills` varchar(45) DEFAULT NULL,
  `profile_image` blob,
  `files` blob,
  PRIMARY KEY (`user_id`,`email_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

2. CREATE TABLE `project` (
  `project_id` int(11) NOT NULL,
  `employer_id` int(11) NOT NULL,
  `title` varchar(45) NOT NULL,
  `description` varchar(45) NOT NULL,
  `files` blob,
  `skills` varchar(45) DEFAULT NULL,
  `budget` varchar(50) DEFAULT NULL,
  `avg_bid` int(11) DEFAULT NULL,
  `status` varchar(45) NOT NULL,
  `project_completion_date` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`project_id`,`employer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

3. CREATE TABLE `bid` (
  `user_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  `bid_price` double DEFAULT NULL,
  `period_in_days` int(11) DEFAULT NULL,
  `files` blob,
  PRIMARY KEY (`user_id`,`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


4. Open browser and put URL localhost://3000  this should show landing page of freelancer with 2 links login and signup.  

5. If you are an existing user then please login by clicking login link. 

6. If you are new user then please sign up. 

7. After login or sign up , user will see Home screen where it shows list of all available projects where user can bid. Click Bid button to bid on the project from list. 

8. Next to Home link there is a dashboard link which shows freelancer and Employer view . On clicking Freelancer view user can see all projects on which he has bid. 

9. By clicking employer view user can see projects only if he has posted the projects. 

10. User can post project by cling on button post project displayed on screen after log in. 

11. After clicking post project, user can see post project form, upload project files and fill all details of post project and submit.

12. User can see posted project under employer view of dashboard. 

13. Inside Employer view of dashboard, user can see who has bid on the project and select the bid by clicking hire button

14. User can edit his/her profile details by clicking my profile link. Here user can upload image as display picture.

15. User can logout at any time using logout button on all screens. 