<div align="center">

# Genignite Pre-Hackathon Submission Template 

<img src="assets/logo/f58664d6c437.jpg" alt="Genignite Pre-Hackathon Logo"/>

<br/>

---

 GenIgnite Pre-Hackathon IPEC

</div>

## 1. Problem Statement Name

AI-Powered Sports Talent Ecosystem

## 2. Problem Statement Description

India's sports talent ecosystem faces challenges like fragmented access, lack of standardized assessments, and limited coaching, especially in rural and marginalized areas. Socio-economic and gender barriers restrict participation, and families face uncertainty about support. There's a pressing need for an AI-powered, mobile-first platform to democratize talent discovery, enable scientific performance tracking, and foster inclusive, data-driven development, unlocking new opportunities in sports management and analytics.

## 3. Project Overview

- 🔑 **User Signup & Login** (with role & sport selection)  
- 🛡 **Secure Password Hashing** (bcrypt)  
- 💾 **MongoDB storage** for users & performance data  
- 📊 **Athlete Performance Metrics:** Height, Weight, Speed, Stamina, Accuracy  
- 🤖 **AI-powered performance analysis** using Gemini API  
- 🖥 **Dashboard** with User Profile & Performance Insights  

## 4. Architecture

sports-talent-ai/
│── app.js # Main server file
│── package.json # Dependencies & scripts
│── config/
│ └── db.js # MongoDB connection
│── models/
│ ├── user.js # User schema
│ └── performance.js # Performance schema
│── routes/
│ ├── userPostRoutes.js # Signup, Login, Performance POST routes
│ └── profile.js # User dashboard/profile routes
│── views/
│ ├── signup.ejs # Signup form
│ ├── login.ejs # Login form
│ ├── dashboard.ejs # Dashboard view
│ ├── performance.ejs # AI performance analysis page
│ └── partials/ # Shared header/footer
│── public/
│ └── css/style.css # Styling
└── README.md # Project documentation


## 5. Tech Stack

- **Frontend:** EJS + CSS  
- **Backend:** Node.js + Express  
- **Database:** MongoDB + Mongoose  
- **Authentication:** express-session  
- **AI Integration:** Gemini API 

---

## 6. Team Name

Bitwise Warriors

## 7. Team Members & Details

| Name                | Role                | Email                       | LinkedIn                        | College Name                   |
|---------------------|---------------------|-----------------------------|---------------------------------|--------------------------------|
| Lakshya Varshney    | Team Lead , AI/ML   |varshneylakshya642@gmail.com |https://www.linkedin.com/in/lakshya-varshney-183b70179/ | BIT, Mrt |
| Daksh Saini         | Backend Dev         |dakshsaini2525@gmail.com     |https://www.linkedin.com/in/lakshya-varshney-183b70179/ | BIT, Mrt |
| Mohit               | Frontend Dev        |mohit901282@gmail.com        |https://www.linkedin.com/in/lakshya-varshney-183b70179/ | BIT, Mrt |
| Tarang chauhan      | Database            |ctarangchauahn@gmail.com     |https://www.linkedin.com/in/lakshya-varshney-183b70179/ | BIT, Mrt |
| Chhavi Nagar        | UI/UX               |chhavinagar06@gmail.com      |https://www.linkedin.com/in/lakshya-varshney-183b70179/ | BIT, Mrt |

---

## 8. Additional Links

- [Project Demo/Video]
  ((https://drive.google.com/file/d/1meQsXO3j8i-xxrf1FNcWGd2cMRLl_TUq/view?usp=sharing))

---[Reference 1]
  (India.gov.in / Youth & Sports)
  (Open Government Data (India))- “Department of Sports” section on Data.gov.in.

- [Deployed App]
  ()

---

## 9. Instructions 

 --*Clone the repo**
```bash
git clone https://github.com/varshlaksh/AI-Powered-Sports-Talent-Ecosystem.git

---Install dependencies

"npm install"

--Start the server

"node app.js"

##**Team HackWithIndia x Devnovate**
