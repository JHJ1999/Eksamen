const express = require('express') // kalder express
const cors = require('cors');
const app = express(); // benytter express
const port = 3000
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./Routes/userRoutes');
const ejs = require('ejs');

//const { updateOne, update } = require('./Model/User');


mongoose.connect("mongodb+srv://eksamen:eksamen@cluster0.uuj1t.mongodb.net/Cluster0?retryWrites=true&w=majority", { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });
//connecter til mongoDB cluster

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
console.log("database connected");
});

app.set('view engine', 'ejs');

// skal gå igennem 
app.use('/routes', userRoutes); // henviser til mine userRoutes 
//app.use('/Routes', adminRoutes); 
app.use(cors());
app.use(express.static("./Views/")); // for at hente HTML/CSS til view engine 
 //sætter view engine til ejs

 app.get('/', (req,res) => {
  res.render("index.ejs");
});

 app.listen(port, () => {
  console.log(`App kører på http://localhost:${port}`)
})



/*
   <% matchList.forEach(function (matchList) { %>
             <form name="remove" action="http://localhost:3000/routes/<%=user._id%>/matches" role="form" method="POST"></form>
               
                    <h2><%= matchList.name%></h2>

                <ul>
                    <li> Name: <%matchList.name%> </li>

                    <li> Age: <%=matchList.age%> </li>

                    <li> Interest: <%=matchList.interest%> </li>

                    <li> Email: <%=matchList.email%> </li>
                </ul>

                    
                    <input type="text" name="second_id" value="<%=userList._id %>">
                    
                    
                    <button name="remove" class="remove">Fjern match </button>

                   
                </form>
        
        <% } %>
*/