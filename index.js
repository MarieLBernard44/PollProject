const express = require('express');
const bodyparser = require('body-parser');

const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));


const polls = [
    {
        id: 1,
        question: "Question ?",
        answers: ["Réponse 1", "Réponse 2", "Réponse 3"],
        votes: []
    },
    {
        id: 2,
        question: "Question 2 ?",
        answers: ["Réponse 1", "Réponse 2", "Réponse 3"],
        votes: [1, 0, 0, 2, 1, 0, 1, 1]
    }

];

// Lister les sondages -------------------------------------------------------------------------------------------------
app.get('/polls', function (req, res) {
    res.send(polls);
});



// Récupérer un sondage ------------------------------------------------------------------------------------------------
app.get('/polls/:id', function (req, res) {
    // On extrait le paramètre id et on le transforme en nombre
    const id = parseInt(req.params.id, 10) ;
        function correspond(poll){
            return poll.id  === id;
        }
    // On cherche le sondage par son id
    const poll = polls.find(correspond);

    if(typeof (poll) !== 'undefined'){
        //Si un sondage est trouvé, on le renvoie
        res.send(poll);
    } else {
        // Sinon, on renvoie une erreur 404
        res.sendStatus(404);
    }
});



// Créer un sondage (question, réponses) -------------------------------------------------------------------------------
app.post('/polls', function(req, res) {
    const question = req.body.question;
    const answers = req.body.answers
    // On vérifie si une question est une chaine de caractères
    if ((typeof(question) !== 'string')){
        return res.sendStatus(400);
    }
     //On vérifie si answers est une liste de chaine de caractères
    if (!Array.isArray (answers) || answers.some(a => typeof (a) !== 'string')) {
        return res.sendStatus(400);
    }

    // On crée un nouvel identifiant unique, supérieur à tous les autres
    const id = polls.reduce((max, p) => max > p.id ? max: p.id, 0) + 1;

    // On crée un nouvel objet sondage
    const poll = {
            id, question, answers,
            votes: []
        };

    // On ajoute le nouveau sondage à la liste
    polls.push(poll);

    // et on le renvoie avec le bon code HTTP
    res.send(201, poll);
});




// Voter pour une réponse d'un sondage ---------------------------------------------------------------------------------
app.post('polls/:id/votes', function(req, res){
    const id = parseInt(req.params.id, 10) ;
    function correspond(poll){
        return poll.id  === id;
    }
    const poll = polls.find(correspond);
    const answers = req.body.answers
    if(typeof (poll) !== 'undefined'){
        poll.votes.push(answers);
    } else {
        res.sendStatus(404);
    }
});


app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});