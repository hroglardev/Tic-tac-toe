'use strict'

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

  return { getBoard, makeMove }
})()

const Player = (name, symbol) => {
  const getName = () => name
  const getSymbol = () => symbol

  return { getName, getSymbol }
}

let playerOne = Player('Lucas', 'X')
let playerTwo = Player('Mariano', 'O')
let currentPlayer = playerOne

const renderBoard = () => {
  const gridBoard = document.querySelector('#game-board')
  const board = Gameboard.getBoard()

  board.forEach((slot, index) => {
    const cell = document.createElement('div')
    cell.classList.add('cell')
    cell.innerText = slot
    cell.addEventListener('click', handleClickCell(index))
    gridBoard.appendChild(cell)
  })
}

const checkWinner = () => {
  const board = Gameboard.getBoard()

  for (let i = 0; i < 9; i += 3) {
    if (board[i] !== null && board[i] === board[i + 1] && board[i] === board[i + 2]) {
      return board[i]
    }
  }

  for (let i = 0; i < 3; i++) {
    if (board[i] !== null && board[i] === board[i + 3] && board[i] === board[i + 6]) {
      return board[i]
    }
  }

  if (board[0] !== null && board[0] === board[4] && board[0] === board[8]) {
    return board[0]
  }

  if (board[2] !== null && board[2] === board[4] && board[2] === board[6]) {
    return board[2]
  }
  return null
}

const handleClickCell = (index) => {
  const board = Gameboard.getBoard()
  const isWinner = checkWinner()
  if (Gameboard.makeMove(index, currentPlayer.getSymbol())) {
    if (isWinner) {
      board.forEach((slot) => {
        const cell = document.querySelector('.cell')
        cell.removeEventListener('click')
      })
    }

    renderBoard()
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne
  }
}
