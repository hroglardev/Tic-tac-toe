'use strict'

const gameModule = (() => {
  let playerOne = null
  let playerTwo = null
  let currentPlayer = null

  // 1ST MODULE
  const Player = (name, symbol, score) => {
    const getName = () => name
    const getSymbol = () => symbol
    const getScore = () => score
    const updateScore = () => (score += 1)
    return { getName, getSymbol, updateScore, getScore }
  }

  // "2ND" MODULE
  const formModule = (() => {
    const inputs = [...document.querySelectorAll('input')]
    const form = document.querySelector('.form')
    const startButton = document.querySelector('.start')
    const playerOneParagraph = document.querySelector('.one')
    const playerTwoParagraph = document.querySelector('.two')
    const resetButton = document.querySelector('.reset')

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

    const startGame = (event) => {
      event.preventDefault()

      const playerOneInput = document.querySelector('#player-one').value
      const playerTwoInput = document.querySelector('#player-two').value

      playerOne = Player(playerOneInput, 'X', 0)
      playerTwo = Player(playerTwoInput, 'O', 0)

      playerOneParagraph.innerText = `${playerOne.getName()}: ${playerOne.getScore()}`
      playerTwoParagraph.innerText = `${playerTwo.getName()}: ${playerTwo.getScore()}`

      currentPlayer = playerOne
      resetForm()
      Gameboard.renderBoard()
    }

    const resetGame = () => {
      playerOne = null
      playerTwo = null
      currentPlayer = null
      playerOneParagraph.innerText = 'Player 1: 0'
      playerTwoParagraph.innerText = 'Player 2: 0'
      Gameboard.restartBoard()
      Gameboard.renderBoard()
    }

    form.addEventListener('input', activateButton)
    form.addEventListener('submit', startGame)
    resetButton.addEventListener('click', resetGame)
  })()

  // 3RD MODULE
  const Gameboard = (() => {
    const board = Array(9).fill(null)
    const getBoard = () => [...board]
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

    const renderBoard = () => {
      const grid = document.querySelector('.grid')
      grid.innerHTML = ''
      const board = Gameboard.getBoard()
      board.forEach((symbol, index) => {
        const cell = document.createElement('div')
        cell.classList.add('cell')
        cell.id = index
        cell.innerText = symbol
        grid.appendChild(cell)
        if (symbol === null) {
          cell.addEventListener('click', () => paintCell(index))
        }
      })
    }

    const paintCell = (index) => {
      const cell = document.getElementById(`${index}`)
      const currentPlayerSymbol = currentPlayer.getSymbol()
      cell.innerText = currentPlayerSymbol
      console.log(cell, 'ACA')
      console.log(Gameboard.getBoard(), 'BOARD')
      Gameboard.makeMove(currentPlayerSymbol, index)
      updateCurrentPlayer()
      console.log(currentPlayer)
      renderBoard()
    }

    return { getBoard, makeMove, restartBoard, renderBoard }
  })()

  const updateCurrentPlayer = () => {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne
  }
  console.log(Gameboard.getBoard())
  Gameboard.renderBoard()
})()
