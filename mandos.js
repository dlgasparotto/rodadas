// A partir de um array qualquer, tenta ajustar mandos com as regras:
// - na maximo 2 em casa seguidas, 2 fora seguidas e 
// controlando o numero de partidas em casa e fora

let log = console.log
let fs = require("fs");

let qtdTimes = 4
let mapalivre = fs.readFileSync("mapaslivres/4.json");
let rodadas = JSON.parse(mapalivre)

log('Rodadas iniciais: ', rodadas)

let rodadasComMandos = setMandos(rodadas, qtdTimes)

function setMandos(rodadas, qtdTimes){

  let maxJogos = Math.floor(qtdTimes)

  rodadasLista = rodadas.flat().map(j => {
    return [j, 'p', '']
  })

  let hist = Array(qtdTimes + 1).fill(0)
  let histTimes = hist.map(h => [0, 0, 0]) // jogos em casa/sequencia/jogos fora
  //histTimesIni3 = null

  let indjogo = 0
  while (indjogo < rodadasLista.length){

    evento = rodadasLista[indjogo]
    jogo = evento[0]
    if (evento[1] == 'x') {
      histTimes = JSON.parse(evento[2]) // restaura
    }
    rodadasLista[indjogo][2] = JSON.stringify(histTimes) // é a memmoria
    
    /* if (indjogo == 2){
      histTimesIni3 = JSON.parse(JSON.stringify(histTimes))
    } */

    t1 = jogo[0]
    t2 = jogo[1]

    testePath = true
    // teste mando padrao
    if (evento[1] == 'p' && histTimes[t1][0] < maxJogos && histTimes[t1][1] < 2 && histTimes[t2][1] > -2 && histTimes[t2][2] < maxJogos) {
      // segue mando sugerido
    } else if (histTimes[t2][0] < maxJogos && histTimes[t2][1] < 2 && histTimes[t1][1] > -2 && histTimes[t1][2] < maxJogos) {
      // inverte mando
      rodadasLista[indjogo][1] = 'i'
      jogo.reverse()
    } else {
      testePath = false // caminho inválido.... vorta a bagaça
    }

    if (testePath){

      indjogo++
      setSequencia(jogo)
    } else {
      achou = false
      // volta ate o primeiro indjogo nao invertido contendo 1 dos times
      // marca ele como 'x' -> path invalido
      while (!achou) {
        indjogo--
        if (rodadasLista[indjogo][1] == 'p' && (rodadasLista[indjogo][0].includes(t1) || rodadasLista[indjogo][0].includes(t2) ) ) {
          achou = true
          rodadasLista[indjogo][1] = 'x'
          for (i=indjogo + 1; i < rodadasLista.length; i++){
            if (rodadasLista[i][1] == 'i'){
              rodadasLista[i][0].reverse()
            }
            rodadasLista[i][1] = 'p'
            rodadasLista[i][2] = ''
          }
        }
      }
    }


    function setSequencia(jogo){
      t1 = jogo[0]
      t2 = jogo[1]
      histTimes[t1][0]++ 
      histTimes[t2][2]++ 
      histTimes[t1][1] = histTimes[t1][1] > 0 ? histTimes[t1][1] + 1 : 1
      histTimes[t2][1] = histTimes[t2][1] < 0 ? histTimes[t2][1] - 1 : -1
    }

  }

  //log('inicio r3: ', histTimesIni3)
  log('stats final', histTimes)
  log('jogos final', rodadasLista.map(r => r[0]))

}

