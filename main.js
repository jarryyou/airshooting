window.onload = () => {
  let screenWidth = window.innerWidth
  let screenHeight = window.innerHeight

  let back = document.querySelector('.back')

  let ctrlCon = document.querySelector('.ctrl')
  let ctrls = document.querySelectorAll('.ctrl p')
  for (let i = 0; i < ctrls.length; i++) {
    ctrls[i].onclick = function () {
      for (let j = 0; j < ctrls.length; j++) {
        ctrls[j].className = ''
      }
      this.className = 'selected-mode'
      ctrlMode = this.innerHTML
      playerMove(this.innerHTML)
      ctrlCon.style.display = 'none'
    }
  }

  let player = document.createElement('div')
  let speed = 300

  player.className = 'player'
  player.style.left = screenWidth / 2 + 'px'
  player.style.top = screenHeight / 2 + 'px'
  back.appendChild(player)

  let shooting = setInterval(() => {
    let t = 0
    for (let i = 0; i < 2; i++) {
      if (t > 1) t = 0
      let bullet = document.createElement('div')
      bullet.className = 'bullet'
      bullet.style.left = player.offsetLeft + (t > 0 ? 38 : 15) - player.offsetWidth / 2 + 'px'
      bullet.style.top = player.offsetTop - player.offsetHeight + 'px'
      back.appendChild(bullet)
      t++
    }
  }, speed)

  let bulletMove = setInterval(() => {
    let bullets = document.querySelectorAll('.bullet')
    for (let i = 0; i < bullets.length; i++) {
      bullets[i].style.top = bullets[i].offsetTop - 1 + 'px'
      if (bullets[i].offsetTop < -32) {
        back.removeChild(bullets[i])
      }
    }
  }, 1)

  function playerMove (type) {
    let playerMove
    if (type == 'MOUSE') {
      document.onmousemove = e => {
        player.style.left = e.clientX + 'px'
        player.style.top = e.clientY + 'px'
      }
    } else {
      document.onkeydown = e => {
        clearInterval(playerMove)
        playerMove = setInterval(() => {
          switch (e.keyCode) {
            case 37: {
              if (player.offsetLeft <= 0) return
              player.style.left = player.offsetLeft - 1 + 'px'
              break
            }
            case 38: {
              if (player.offsetTop <= 0) return
              player.style.top = player.offsetTop - 1 + 'px'
              break
            }
            case 39: {
              if (player.offsetLeft >= screenWidth) return
              player.style.left = player.offsetLeft + 1 + 'px'
              break
            }
            case 40: {
              if (player.offsetTop >= screenHeight - player.offsetHeight) return
              player.style.top = player.offsetTop + 1 + 'px'
              break
            }
            default: { }
          }
        }, 1)
      }
      document.onkeyup = () => {
        clearInterval(playerMove)
      }
    }
  }

  let createEnemy = setInterval(() => {
    let enemy = document.createElement('div')
    let level = Math.floor(Math.random() * 6)
    enemy.level = level * 2
    enemy.hp = level * 2
    enemy.className = 'enemy enemy-' + level
    enemy.style.left = Math.random() * screenWidth.toFixed() + 'px'
    enemy.style.top = -Math.random() * screenHeight.toFixed() + 'px'

    let hp = document.createElement('div'),
      hpBack = document.createElement('div')

    hp.className = 'hp'
    hpBack.className = 'hp-back'
    hp.appendChild(hpBack)
    enemy.appendChild(hp)

    back.appendChild(enemy)

    let enemyMove = setInterval(() => {
      enemy.style.top = enemy.offsetTop + 1 + 'px'
      if (enemy.offsetTop > screenHeight + enemy.offsetHeight) {
        back.removeChild(enemy)
        clearInterval(enemyMove)
      }
    }, 15)
  }, 1500)

  let hit = setInterval(() => {
    let enemies = document.querySelectorAll('.enemy')
    let bullets = document.querySelectorAll('.bullet')
    let t = 0
    for (let i = 0; i < enemies.length; i++) {
      for (let j = 0; j < bullets.length; j++) {
        if (enemies[i].level > 0 && bullets[j].offsetTop < enemies[i].offsetTop && enemies[i].offsetLeft - 0.5 * enemies[i].offsetWidth < bullets[j].offsetLeft && (bullets[j].offsetLeft + bullets[j].offsetWidth < enemies[i].offsetLeft + enemies[i].offsetWidth)) {
          back.removeChild(bullets[j])
          enemies[i].level -= 1
          enemies[i].children[0].children[0].style.left = -((enemies[i].hp - enemies[i].level) / enemies[i].hp * 100).toFixed() + '%'
        }
      }
      if (enemies[i].level == 0) {
        enemies[i].style.background = 'url("./image/explode-' + (enemies[i].hp || 1) + '.png") no-repeat center center /contain'
        if (t > 50) {
          back.removeChild(enemies[i])
          t = 0
        }
        t++
      }
    }
  }, 1)
}