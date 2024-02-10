'use strict'

const gameModule = (() => {
  // 1ST MODULE
  const Player = (name, symbol, score) => {
    const getName = () => name
    const getSymbol = () => symbol
    const getScore = () => score
    const updateScore = () => (score += 1)
    return { getName, getSymbol, getScore, updateScore }
  }

  // 2ND MODULE
  const Gameboard = (() => {
    let playerOne = Player('Player 1', 'X', 0)
    let playerTwo = Player('Player 2', 'O', 0)
    let currentPlayer = playerOne
    const board = Array(9).fill(null)
    const getBoard = () => [...board]
    const getPlayerOne = () => playerOne
    const getPlayerTwo = () => playerTwo
    const getCurrentPlayer = () => currentPlayer

    const makeMove = (symbol, index) => {
      if (board[index] === null) {
        board[index] = symbol
        return true
      }
      return false
    }

    const restartBoard = () => {
      board.fill(null)
    }

    const updateCurrentPlayer = () => {
      currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne
    }

    const setPlayers = (firstPlayerName, secondPlayerName) => {
      playerOne = Player(firstPlayerName, 'X', 0)
      playerTwo = Player(secondPlayerName, 'O', 0)
      currentPlayer = playerOne
    }

    const resetPlayers = () => {
      setPlayers('Player 1', 'Player 2')
    }

    const boardIsfull = () => {
      return board.every((cell) => cell !== null)
    }

    const checkIfWin = () => {
      for (let i = 0; i < board.length; i += 3) {
        if (board[i] !== null && board[i] === board[i + 1] && board[i] === board[i + 2]) {
          return true
        }
      }

      for (let i = 0; i < 3; i++) {
        if (board[i] !== null && board[i] === board[i + 3] && board[i] === board[i + 6]) {
          return true
        }
      }

      if (board[0] !== null && board[0] === board[4] && board[0] === board[8]) {
        return true
      }

      if (board[2] !== null && board[2] === board[4] && board[2] === board[6]) {
        return true
      }

      return false
    }

    return { boardIsfull, getCurrentPlayer, resetPlayers, getBoard, makeMove, restartBoard, checkIfWin, updateCurrentPlayer, getPlayerOne, getPlayerTwo, setPlayers }
  })()

  // 3RD MODULE
  const domForm = (() => {
    const inputs = [...document.querySelectorAll('input')]
    const form = document.querySelector('.form')
    const startButton = document.querySelector('.start')

    const validate = (inputs) => {
      let isValid = true
      inputs.forEach((input) => {
        if (input.value.trim() === '') {
          isValid = false
        }
      })
      return isValid
    }

    const activateButton = () => {
      const isValid = validate(inputs)
      if (isValid) {
        startButton.removeAttribute('disabled')
      } else {
        startButton.setAttribute('disabled', true)
      }
    }

    const resetForm = () => {
      form.reset()
      activateButton()
    }

    form.addEventListener('input', activateButton)

    return { resetForm, form }
  })()

  const domGameboard = (() => {
    const resetButton = document.querySelector('.reset')

    const renderBoard = () => {
      const grid = document.querySelector('.grid')
      const board = Gameboard.getBoard()
      grid.innerHTML = ''
      board.forEach((symbol, index) => {
        const cell = document.createElement('div')
        cell.classList.add('cell')
        cell.id = index
        cell.innerText = symbol
        grid.appendChild(cell)
        if (symbol === null) {
          cell.addEventListener('click', () => fillCell(index))
        }
      })
    }

    const fillCell = (index) => {
      const currentPlayerSymbol = Gameboard.getCurrentPlayer().getSymbol()
      Gameboard.makeMove(currentPlayerSymbol, index)
      Gameboard.updateCurrentPlayer()
      domScore.declareWinner()
      renderBoard()
    }

    const paintWinningCells = (cells) => {
      cells.forEach((cell) => {
        cell.classList.add('winning-cell')
      })
    }

    const startGame = (event) => {
      event.preventDefault()
      if (Gameboard.getPlayerOne().getName() !== 'Player 1') {
        resetGame()
        startGame(event)
      } else {
        const firstPlayerInput = document.querySelector('#player-one').value
        const secondPlayerInput = document.querySelector('#player-two').value

        Gameboard.setPlayers(firstPlayerInput, secondPlayerInput)
        Gameboard.restartBoard()

        domScore.displayScores()

        domForm.resetForm()
      }
    }

    const resetGame = () => {
      Gameboard.restartBoard()
      Gameboard.resetPlayers()
      domGameboard.renderBoard()
      domScore.clearUi()
      domScore.displayScores()
    }

    const removeEventListeners = () => {
      const cells = [...document.querySelectorAll('.cell')]
      cells.forEach((cell) => {
        cell.removeEventListener('click', fillCell)
      })
      console.log('EJECUTO REMOVE EVENTS')
    }

    resetButton.addEventListener('click', resetGame)
    domForm.form.addEventListener('submit', (event) => startGame(event))
    return { renderBoard, removeEventListeners }
  })()

  const domScore = (() => {
    const winner = document.querySelector('.round-winner')
    const nextRoundContainer = document.querySelector('.next-round-container')
    const nextRoundButton = document.createElement('button')
    nextRoundButton.classList.add('next-round')

    const displayScores = () => {
      const playerOneScore = document.querySelector('.one')
      const playerTwoScore = document.querySelector('.two')
      const playerOne = Gameboard.getPlayerOne()
      const playerTwo = Gameboard.getPlayerTwo()
      playerOneScore.innerText = `${playerOne.getName()}: ${playerOne.getScore()}`
      playerTwoScore.innerText = `${playerTwo.getName()}: ${playerTwo.getScore()}`
    }

    const declareWinner = () => {
      const isWinner = Gameboard.checkIfWin()
      const isDraw = Gameboard.boardIsfull()

      let currentPlayer = Gameboard.getCurrentPlayer()
      if (!isWinner && isDraw) {
        winner.innerText = "It's a tie"
        Gameboard.updateCurrentPlayer()
        addNextRoundButton()
        domGameboard.removeEventListeners()
        return
      }
      if (isWinner) {
        Gameboard.updateCurrentPlayer()
        currentPlayer = Gameboard.getCurrentPlayer()
        winner.innerText = `${currentPlayer.getName()} is the winner`
        currentPlayer.updateScore()
        displayScores()
        addNextRoundButton()
        domGameboard.removeEventListeners()
      }
    }

    const addNextRoundButton = () => {
      nextRoundButton.innerText = 'Next round'
      nextRoundContainer.appendChild(nextRoundButton)
    }

    const clearUi = () => {
      Gameboard.restartBoard()
      domGameboard.renderBoard()
      winner.innerText = ''
      nextRoundButton.remove()
    }

    nextRoundButton.addEventListener('click', clearUi)

    return { clearUi, displayScores, declareWinner, winner }
  })()

  domGameboard.renderBoard()
})()
