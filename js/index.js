'use strict'

const gameModule = (() => {
  // 1ST MODULE
  const Player = (name, symbol, score) => {
    const getName = () => name
    const getSymbol = () => symbol
    const getScore = () => score
    const updateScore = () => (score += 1)
    const resetScore = () => (score = 0)
    return { getName, getSymbol, getScore, updateScore, resetScore }
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
      playerOne = Player(firstPlayerName, 'X', playerOne.getScore())
      playerTwo = Player(secondPlayerName, 'O', playerTwo.getScore())
      currentPlayer = playerOne
    }

    const resetPlayers = () => {
      setPlayers('Player 1', 'Player 2')
      resetScores()
    }

    const resetScores = () => {
      playerOne.resetScore()
      playerTwo.resetScore()
      domScore.displayScores()
      domScore.clearUi()
    }

    const boardIsFull = () => {
      return board.every((cell) => cell !== null)
    }

    const checkIfWin = () => {
      for (let i = 0; i < board.length; i += 3) {
        if (board[i] !== null && board[i] === board[i + 1] && board[i] === board[i + 2]) {
          return [i, i + 1, i + 2]
        }
      }

      for (let i = 0; i < 3; i++) {
        if (board[i] !== null && board[i] === board[i + 3] && board[i] === board[i + 6]) {
          return [i, i + 3, i + 6]
        }
      }

      if (board[0] !== null && board[0] === board[4] && board[0] === board[8]) {
        return [0, 4, 8]
      }

      if (board[2] !== null && board[2] === board[4] && board[2] === board[6]) {
        return [2, 4, 6]
      }

      return null
    }

    return { resetScores, boardIsFull, getCurrentPlayer, resetPlayers, getBoard, makeMove, restartBoard, checkIfWin, updateCurrentPlayer, getPlayerOne, getPlayerTwo, setPlayers }
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
    const resetScoresButton = document.querySelector('.rounds')
    const grid = document.querySelector('.grid')

    const renderBoard = () => {
      const checkIfWin = Gameboard.checkIfWin()
      const board = Gameboard.getBoard()
      grid.innerHTML = ''

      board.forEach((symbol, index) => {
        const cell = document.createElement('div')
        cell.classList.add('cell')
        cell.id = index
        cell.innerText = symbol
        grid.appendChild(cell)
      })

      if (checkIfWin !== null) {
        checkIfWin.forEach((winningCell) => {
          const cell = document.getElementById(`${winningCell}`)
          cell.classList.add('winning-cell')
        })
      }
    }

    const handleCellClick = (event) => {
      const clickedCell = event.target
      const index = clickedCell.id

      if (clickedCell.classList.contains('cell') && Gameboard.getBoard()[index] === null) {
        fillCell(index)
      }
    }

    const fillCell = (index) => {
      const currentPlayerSymbol = Gameboard.getCurrentPlayer().getSymbol()
      Gameboard.makeMove(currentPlayerSymbol, index)
      Gameboard.updateCurrentPlayer()
      domScore.declareWinner()
      renderBoard()
    }

    const startGame = (event) => {
      event.preventDefault()

      const firstPlayerInput = document.querySelector('#player-one').value
      const secondPlayerInput = document.querySelector('#player-two').value

      Gameboard.setPlayers(firstPlayerInput, secondPlayerInput)
      Gameboard.restartBoard()

      domScore.displayScores()

      domForm.resetForm()
    }

    const resetGame = () => {
      Gameboard.restartBoard()
      Gameboard.resetPlayers()
      domGameboard.renderBoard()
      domScore.clearUi()
      domScore.displayScores()
    }

    const removeEventListeners = () => {
      grid.removeEventListener('click', handleCellClick)
    }

    const addEventListeners = () => {
      grid.addEventListener('click', handleCellClick)
    }

    addEventListeners()
    resetButton.addEventListener('click', resetGame)
    resetScoresButton.addEventListener('click', Gameboard.resetScores)
    domForm.form.addEventListener('submit', (event) => startGame(event))
    return { renderBoard, removeEventListeners, addEventListeners }
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
      const isDraw = Gameboard.boardIsFull()

      let currentPlayer = Gameboard.getCurrentPlayer()
      if (isWinner === null && isDraw) {
        winner.innerText = "It's a tie"
        Gameboard.updateCurrentPlayer()
        addNextRoundButton()
        domGameboard.removeEventListeners()
        return
      }
      if (isWinner !== null) {
        Gameboard.updateCurrentPlayer()
        currentPlayer = Gameboard.getCurrentPlayer()
        winner.innerText = `${currentPlayer.getName()} is the winner`
        currentPlayer.updateScore()
        displayScores()
        domGameboard.removeEventListeners()
        addNextRoundButton()
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
      domGameboard.addEventListeners()
      nextRoundButton.remove()
    }

    nextRoundButton.addEventListener('click', clearUi)

    return { clearUi, displayScores, declareWinner, winner }
  })()

  domGameboard.renderBoard()
})()
