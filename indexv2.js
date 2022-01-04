// Versão 2
// Tentativa de adaptar o exploratorio para um que vai excluindo jogos
// ja utilizados


log = console.log

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
} 

exec(18)

async function exec(qtdTimes){

  let isPar = qtdTimes % 2 === 0
  let qtdJogosRodada = Math.floor(qtdTimes/2)
  let qtdRodadas = isPar ? qtdTimes - 1 : qtdTimes
  let jogos = criaListaJogos(qtdTimes)
  let rodadasJogoBase = Array(qtdRodadas + 1).fill(0)
  let rodada = 1
  let inicio = new Date().getTime()
  
  let testes = { rodadas: 0,  jogos: 0 }
  while (rodada <= qtdRodadas){
    testes.rodadas++

    //await delay(100)
    log('Rodada ', rodada, ' -> inicio em ', rodadasJogoBase[rodada])

    jogosRodada = []
    timeFolga = isPar ? 0 : rodada

    for (ind = 0; ind < jogos.length; ind++) {
      
      testes.jogos++
      
      x = ind + rodadasJogoBase[rodada]
      if (x >= jogos.length) x = x - jogos.length
      jogo = jogos[x]
      if (jogo[0]) continue
      
      timesRodada = jogosRodada.flat()
      if (!timesRodada.includes(jogo[1]) && !timesRodada.includes(jogo[2]) && !jogo.includes(timeFolga)) {
        //log('+ jogo ', x,  jogo, 'ind' + ind)
        jogosRodada.push(jogo)
        if (jogosRodada.length == 1) {
          desloca = rodadasJogoBase[rodada] + ind
        }
      }
      rodadaCompleta = jogosRodada.length == qtdJogosRodada
      if (rodadaCompleta) {
        jogosRodada.forEach(jogo => {
          jogo[0] = rodada
        })
        break
      } 
    }

    if (rodadaCompleta) {
      log('****************** rodada completa')
      rodada++
    } else {
      if (desloca){
        rodadasJogoBase[rodada] = desloca +1
      } else {
        rodadasJogoBase[rodada]++
      }
      // rodadasJogoBase[rodada]++
      if (rodadasJogoBase[rodada] >= jogos.length) {
        log('nao fechou... tem que voltar rodada')
        achou = false
        while (!achou){
          rodadasJogoBase[rodada] = 0  // reseta start da rodada atual
          rodada-- // volta uma rodada
          if (rodada < 1) throw new Error('bugou rodada...')
          jogos.forEach(j => {
            if (j[0] == rodada) j[0] = null // zera jogos da rodada anterior
          })
          rodadasJogoBase[rodada]++ // incremente a rodada anterior -> 
          achou = rodadasJogoBase[rodada] < jogos.length
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
  //return jogos
  return jogos.reverse()
}