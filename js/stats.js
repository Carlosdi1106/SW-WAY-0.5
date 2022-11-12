export {updateStats, getStats, initState}



let initState = function(what, solutionId) { 
    let respuesta=[];
    let s= JSON.parse(localStorage.getItem(what))
    respuesta[0]=s;
    respuesta[1]= function(guess){
        s.guesses.push(guess)
        localStorage.setItem(what,JSON.stringify(s))
    }
    return respuesta
}

function successRate (e){
    let aciertosTotales=e.totalGames-e.gamesFailed;
    let sinRedondeo= (aciertosTotales/e.totalGames)*100;
    return sinRedondeo.toFixed(0);
}

let getStats = function(what) {
    
    let previo = localStorage.getItem(what);
    let res={};
    if(previo==undefined)
    {
        res=
        {
            totalGames: 0,
            bestStreak: 0,
            currentStreak: 0,
            successRate: 0,
            gamesFailed: 0,
            winDistribution: [0,0,0,0,0,0,0,0,0]
        }
            
    }
    else
    {
        res=JSON.parse(previo);
    }

    /*
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
    console.log(res)
    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
    */

    return res;
};

let gameStats = getStats('gameStats');

function updateStats(t){
    /*console.log('-------------------------------------');
    console.log(t);
    console.log('-------------------------------------');
    */
    gameStats.totalGames += 1;
    if(t<8)
    {
        gameStats.currentStreak += 1;
        if(gameStats.bestStreak < gameStats.currentStreak)
        {
            gameStats.bestStreak=gameStats.currentStreak;
        }
    }
    else
    {
        gameStats.currentStreak = 0;
        gameStats.gamesFailed += 1;
    }
    
    gameStats.successRate= successRate(gameStats);
    //gameStats.winDistribution[t] += 1;
    gameStats.winDistribution[t-1] += 1;

    localStorage.setItem('gameStats',JSON.stringify(gameStats));

    console.log(JSON.parse(localStorage.getItem('gameStats')));
};




