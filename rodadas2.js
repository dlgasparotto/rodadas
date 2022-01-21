// Versão 2 - Melhoria de performance, para tentar resolver ate 25 times
// Tentativa de adaptar o exploratorio para um que vai excluindo jogos
// ja utilizados

log = console.log
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
} 

exec(20)

async function exec(qtdTimes){

  let isPar = qtdTimes % 2 === 0
  let qtdJogosRodada = Math.floor(qtdTimes/2)
  let qtdRodadas = isPar ? qtdTimes - 1 : qtdTimes
  let jogos = criaListaJogos(qtdTimes)
  let jogosMap = jogos.map((jogo, ind) => [ind, jogo[1], jogo[2]])
  let rodadasJogoBase = Array(qtdRodadas + 1).fill(0)
  let rodadasJogosMap = Array(qtdRodadas + 1)
  let rodada = 1
  let inicio = new Date().getTime()
  
  //log(jogos)
  //return

  //log(jogosMap)
  //return
  
  let testes = { rodadas: 0, jogos: 0 }
  while (rodada <= qtdRodadas){
    testes.rodadas++

    //await delay(100)
    //log('Rodada ', rodada, ' -> inicio em ', rodadasJogoBase[rodada])

    jogosRodada = []
    timeFolga = isPar ? -1 : rodada

    qtdJogos = jogosMap.length
    //log('jogosmap ', jogosMap)
    for (ind = 0; ind < qtdJogos; ind++) {
      
      testes.jogos++
      
      x = ind + rodadasJogoBase[rodada]
      if (x >= qtdJogos) x = x - qtdJogos
      jogo = jogosMap[x]
      //if (jogo[0]) continue
      //log('teste jogo', jogo)
      
      timesRodada = []
      jogosRodada.forEach(j => {
        timesRodada.push(j[1])
        timesRodada.push(j[2])
      })

      if (!timesRodada.includes(jogo[1]) && !timesRodada.includes(jogo[2]) && !jogo.includes(timeFolga, 1)) {
        //log('+ jogo ', x,  jogo, 'ind' + ind)
        jogosRodada.push(jogo)
        if (jogosRodada.length == 1) {
          desloca = rodadasJogoBase[rodada] + ind
        }
      }
      rodadaCompleta = jogosRodada.length == qtdJogosRodada
      if (rodadaCompleta) {
        rodadasJogosMap[rodada] = JSON.stringify(jogosMap)
        jogosRodada.forEach(jogo => {
          indOri = jogo[0]
          jogos[indOri][0] = rodada
          indMap = jogosMap.findIndex(j => j == jogo)
          jogosMap.splice(indMap, 1)

        })
        break
      } 
    }

    if (rodadaCompleta) {
      log('****************** rodada ', rodada, ' completa. Base ',  rodadasJogoBase[rodada])
      rodada++
    } else {
      if (desloca){
        rodadasJogoBase[rodada] = desloca +1
      } else {
        rodadasJogoBase[rodada]++
      }
      // rodadasJogoBase[rodada]++
      if (rodadasJogoBase[rodada] >= qtdJogos) {
        log('nao fechou rodada ', rodada, ' ... tem que voltar rodada')
        achou = false
        while (!achou){
          rodadasJogoBase[rodada] = 0  // reseta start da rodada atual
          rodada-- // volta uma rodada
          if (rodada < 1) throw new Error('bugou rodada...')
          jogos.forEach(j => {
            if (j[0] == rodada) j[0] = null // zera jogos da rodada anterior
          })
          jogosMap = JSON.parse(rodadasJogosMap[rodada]) //devolve jogos da rodada anterior ao 
          rodadasJogoBase[rodada]++ // incremente a rodada anterior -> 
          achou = rodadasJogoBase[rodada] < qtdJogos
        }
      } 
    }
  }

  let fim = new Date().getTime()
  log(`A operação levou ${fim - inicio} milissegundos`);
  log('Testes: ', testes)

  // agrupando jogos em rodadas
  let composicaoRodadas = Array(qtdRodadas)
  for (rod = 0; rod < composicaoRodadas.length; rod++) {
    composicaoRodadas[rod] = []
  }
  jogos.forEach(j => {
    r = j[0]-1
    j2 = j.slice(1)
    composicaoRodadas[r].push(j2)
  }) 
  //jogos.sort((jogo1, jogo2) => jogo1[0] - jogo2[0])


  log('Composicao: ', composicaoRodadas)

}

function criaListaJogos(qtdTimes) {
  let jogos = []
  for (t1 = 1; t1 <= qtdTimes; t1++) {
    for (t2 = t1 + 1; t2 <= qtdTimes; t2++) {
      jogos.push([null, t1, t2])
    }
  }
  return jogos
  //return jogos.reverse()
}