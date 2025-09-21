# AI-Powered Sports Talent Ecosystem

SportsTalent AI is a **web application** built with **Node.js, Express, MongoDB, and EJS**, designed to help athletes **track and analyze their performance**.  
It includes **authentication, performance tracking**, and **AI-powered analysis** via the Gemini API.

---

## 🚀 Features

- 🔑 **User Signup & Login** (with role & sport selection)  
- 🛡 **Secure Password Hashing** (bcrypt)  
- 💾 **MongoDB storage** for users & performance data  
- 📊 **Athlete Performance Metrics:** Height, Weight, Speed, Stamina, Accuracy  
- 🤖 **AI-powered performance analysis** using Gemini API  
- 🖥 **Dashboard** with User Profile & Performance Insights  

---

## 🛠 Tech Stack

- **Frontend:** EJS + CSS  
- **Backend:** Node.js + Express  
- **Database:** MongoDB + Mongoose  
- **Authentication:** express-session  
- **AI Integration:** Gemini API  

---

## 📂 Project Structure

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


---

## ⚡ Installation

1. **Clone the repo**
```bash
git clone https://github.com/varshlaksh/AI-Powered-Sports-Talent-Ecosystem.git


Install dependencies

npm install


Start the server

node app.js

📋 Usage

Signup

Choose your role: Athlete or Coach

Select your sport

Login

Access your account with secure credentials

Enter Performance Data

Fill in metrics: Height, Weight, Speed, Stamina, Accuracy

AI Analysis

Gemini API generates strengths, weaknesses, and improvement tips

Dashboard

View all saved performance data

Access AI insights and track progress over time

✅ Future Improvements

📈 Graphical Performance Dashboard – Visualize athlete metrics over time

🏅 Leaderboard for Athletes – Compare performance with peers

📱 Mobile-friendly UI – Responsive design for all devices

🔗 Google OAuth Login – Simplified authentication with Google accounts

🤝 Contributing

Contributions are welcome! Feel free to fork the repository, create branches, and submit pull requests.

📄 License

This project is licensed under the MIT License.


---

You can now:  

1. Save this as **`README.md`** in your project root.  
2. Stage and commit it:

```bash
git add README.md
git commit -m "Add professional README"
git push


✅ After that, your GitHub repo will have a professional README.

If you want, I can also create a version with placeholders for screenshots or GIFs so it looks even more visually appealing on GitHub.

Do you want me to do that?