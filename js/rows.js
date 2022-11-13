// YOUR CODE HERE :  
// .... stringToHTML ....
// .... setupRows .....
// .... initState ....



import {stats,toggle,headless} from "./fragments.js";
import {updateStats} from "./stats.js";
export {setupRows}
import {stringToHTML} from './fragments.js';
import {higher,lower} from "./fragments.js";
import {initState} from './stats.js';

// From: https://stackoverflow.com/a/7254108/243532
function pad(a, b){
    return(1e15 + a + '').slice(-b);
}

const delay = 350;
const attribs = ['nationality', 'leagueId', 'teamId', 'position', 'birthdate']
let setupRows = function (game) {

    let [state, updateState] = initState('WAYgameState', game.solution.id)


    function leagueToFlag(leagueId) {
         //otra forma
         let res='';
         if(leagueId==564)
         {
             res='es1'
         }
         else if (leagueId==8)
         {
             res='en1';
         }
         else if (leagueId==82)
         {
             res='de1';
         }
         else if (leagueId==384)
         {
             res='it1';
         }
         else if (leagueId==301)
         {
             res='fr1';
         }
         return res;
    }


    function getAge(dateString) {
        let hoy = new Date();
        let fechaNacimiento = new Date(dateString);
    
        let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
        let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth();
    
    
        if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())) 
        {
            edad--;
        }
    
    
        return edad;
    }
    
    let check = function (theKey, theValue) {
        let res='';

        let jugadorMisterioso=obtenerJugadorMisterioso();
    
        if(theValue==jugadorMisterioso[theKey])
        {
            res='correct';
        }
        //esta bien?
        else if(theKey=='birthDate')
        {
            let edadPropuesta=getAge(theValue);
            let edadJugador=getAge(jugadorMisterioso.birthdate);
            if (edadPropuesta==edadJugador)
            {
                res=edadPropuesta;
            }
            else if(edadJugador>edadPropuesta)
            {
                res=edadPropuesta+higher;
            }
            else
            {
                res=edadPropuesta+lower;
            }
            
    
        }
        else
        {
            res='incorrect';
        }
    
        return res;
    }
    function obtenerJugadorMisterioso()
    {
        return game.solution;
    }

    function unblur(outcome) {
        return new Promise( (resolve, reject) =>  {
            setTimeout(() => {
                document.getElementById("mistery").classList.remove("hue-rotate-180", "blur")
                document.getElementById("combobox").remove()
                let color, text
                if (outcome=='success'){
                    color =  "bg-blue-500"
                    text = "Awesome"
                } else {
                    color =  "bg-rose-500"
                    text = "The player was " + game.solution.name
                }
                document.getElementById("picbox").innerHTML += `<div class="animate-pulse fixed z-20 top-14 left-1/2 transform -translate-x-1/2 max-w-sm shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden ${color} text-white"><div class="p-4"><p class="text-sm text-center font-medium">${text}</p></div></div>`
                resolve();
            }, "2000")
        })
    }


    function showStats(timeout) {
        return new Promise( (resolve, reject) =>  {
            setTimeout(() => {
                document.body.appendChild(stringToHTML(headless(stats())));
                document.getElementById("showHide").onclick = toggle;
                bindClose();
                resolve();
            }, timeout)
        })
    }

    function bindClose() {
        document.getElementById("closedialog").onclick = function () {
            document.body.removeChild(document.body.lastChild)
            document.getElementById("mistery").classList.remove("hue-rotate-180", "blur")
        }
    }


    function setContent(guess) {
        return [
            `<img src="https://playfootball.games/who-are-ya/media/nations/${guess.nationality.toLowerCase()}.svg" alt="" style="width: 60%;">`,
            `<img src="https://playfootball.games/media/competitions/${leagueToFlag(guess.leagueId)}.png" alt="" style="width: 60%;">`,
            `<img src="https://cdn.sportmonks.com/images/soccer/teams/${guess.teamId % 32}/${guess.teamId}.png" alt="" style="width: 60%;">`,
            `${guess.position}`,
            `${check('birthDate',guess.birthdate)}`
        ]
    }

    function showContent(content, guess) {
        let fragments = '', s = '';
        for (let j = 0; j < content.length; j++) {
            s = "".concat(((j + 1) * delay).toString(), "ms")
            fragments += `<div class="w-1/5 shrink-0 flex justify-center ">
                            <div class="mx-1 overflow-hidden w-full max-w-2 shadowed font-bold text-xl flex aspect-square rounded-full justify-center items-center bg-slate-400 text-white ${check(attribs[j], guess[attribs[j]]) == 'correct' ? 'bg-green-500' : ''} opacity-0 fadeInDown" style="max-width: 60px; animation-delay: ${s};">
                                ${content[j]}
                            </div>
                         </div>`
        }

        let child = `<div class="flex w-full flex-wrap text-l py-2">
                        <div class=" w-full grow text-center pb-2">
                            <div class="mx-1 overflow-hidden h-full flex items-center justify-center sm:text-right px-4 uppercase font-bold text-lg opacity-0 fadeInDown " style="animation-delay: 0ms;">
                                ${guess.name}
                            </div>
                        </div>
                        ${fragments}`

        let playersNode = document.getElementById('players')
        playersNode.prepend(stringToHTML(child))
    }


    function resetInput(){
        let rr= document.getElementById('myInput')
        rr.value=""
        rr.placeholder= 'Guess '+(game.guesses.length +1)+' of 8';
    }

    let getPlayer = function (playerId) {
        let jugadores=obtenerJugadores();
        let res = jugadores.filter(e => e.id==playerId);
        return res[0];  
    }


    function gameEnded(lastGuess){
        if(lastGuess== game.solution.id || (state.guesses.length==8 && lastGuess!= game.solution.id))return true
        return false
    }

    function obtenerJugadores()
    {
        return game.players;
    }

    function success(){
        unblur('success')
        showStats(20);
    }
    function gameOver(){
        unblur('gameOver')
        showStats(20);
    }

    resetInput();

    return /* addRow */ function (playerId) {

        let guess = getPlayer(playerId)

        let content = setContent(guess)

        game.guesses.push(playerId)
        updateState(playerId)

        resetInput();

        if (gameEnded(playerId)) {
            updateStats(game.guesses.length);
            
            if (playerId == game.solution.id) {
                success();
            }

            if (game.guesses.length == 8) {
                gameOver();
            }


            //TERMINAR
            let interval = setInterval(cambiarTexto(),1);

            function cambiarTexto() {
                //let muestra=document.getElementById("nextPlayer");                
                //muestra.value=tiempoAhora();  
            }
            /*
            function tiempoAhora(){
                
                let mañana = "2021-02-26T00:00:00.000Z";
                let ahora= Date.now();

                let res=mañana-ahora;

                return res;
            }
            */
            


        }


        showContent(content, guess)
    }
}
