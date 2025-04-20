document.addEventListener('DOMContentLoaded', function () {
    const gridSize = 9;
    const solveButton = document.getElementById('solve-btn');
    const clearButton = document.getElementById('clear-btn');
    const sampleButton = document.getElementById('sample-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const statusDisplay = document.getElementById('status');
    const sudokuGrid = document.getElementById('sudoku-grid');
    const timerDisplay = document.getElementById('timer');
    let selectedCell = null;
    let startTime;
    let timerInterval;
  
    function createGrid() {
      for (let row = 0; row < gridSize; row++) {
        const newRow = document.createElement('tr');
        for (let col = 0; col < gridSize; col++) {
          const cell = document.createElement('td');
          const input = document.createElement('input');
          input.type = 'number';
          input.className = 'cell';
          input.id = `cell-${row}-${col}`;
          input.min = '1';
          input.max = '9';
  
          input.addEventListener('focus', () => {
            selectedCell = input;
            highlightRelatedCells(row, col);
          });
  
          input.addEventListener('keydown', e => {
            let newRow = row, newCol = col;
            switch (e.key) {
              case 'ArrowUp': newRow = Math.max(row - 1, 0); break;
              case 'ArrowDown': newRow = Math.min(row + 1, 8); break;
              case 'ArrowLeft': newCol = Math.max(col - 1, 0); break;
              case 'ArrowRight': newCol = Math.min(col + 1, 8); break;
            }
            const next = document.getElementById(`cell-${newRow}-${newCol}`);
            if (next) next.focus();
          });
  
          input.addEventListener('input', function (e) {
            const value = parseInt(e.target.value);
            if (isNaN(value) || value < 1 || value > 9) {
              e.target.value = '';
            }
          });
  
          cell.appendChild(input);
          newRow.appendChild(cell);
        }
        sudokuGrid.appendChild(newRow);
      }
    }
  
    function highlightRelatedCells(row, col) {
      document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('highlight-row', 'highlight-col', 'highlight-box');
      });
  
      for (let i = 0; i < gridSize; i++) {
        document.getElementById(`cell-${row}-${i}`).classList.add('highlight-row');
        document.getElementById(`cell-${i}-${col}`).classList.add('highlight-col');
      }
  
      const startRow = Math.floor(row / 3) * 3;
      const startCol = Math.floor(col / 3) * 3;
      for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
          document.getElementById(`cell-${i}-${j}`).classList.add('highlight-box');
        }
      }
    }
  
    async function solveSudoku() {
      solveButton.disabled = true;
      statusDisplay.textContent = 'Solving...';
      startTimer();
  
      const sudokuArray = [];
      for (let row = 0; row < gridSize; row++) {
        sudokuArray[row] = [];
        for (let col = 0; col < gridSize; col++) {
          const cell = document.getElementById(`cell-${row}-${col}`);
          const value = cell.value;
          sudokuArray[row][col] = value !== '' ? parseInt(value) : 0;
          if (value !== '') {
            cell.classList.add('user-input');
          }
        }
      }
  
      if (solveSudokuHelper(sudokuArray)) {
        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
            const cell = document.getElementById(`cell-${row}-${col}`);
            if (!cell.classList.contains('user-input')) {
              cell.value = sudokuArray[row][col];
              cell.classList.add('solved');
              await sleep(20);
            }
          }
        }
        statusDisplay.textContent = 'Solved successfully!';
        launchConfetti();
      } else {
        statusDisplay.textContent = 'No solution exists for this puzzle!';
      }
  
      clearInterval(timerInterval);
      solveButton.disabled = false;
    }
  
    function solveSudokuHelper(board) {
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          if (board[row][col] === 0) {
            for (let num = 1; num <= 9; num++) {
              if (isValidMove(board, row, col, num)) {
                board[row][col] = num;
                if (solveSudokuHelper(board)) return true;
                board[row][col] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    }
  
    function isValidMove(board, row, col, num) {
      for (let i = 0; i < gridSize; i++) {
        if (board[row][i] === num || board[i][col] === num) return false;
      }
  
      const startRow = Math.floor(row / 3) * 3;
      const startCol = Math.floor(col / 3) * 3;
      for (let i = startRow; i < startRow + 3; i++) {
        for (let j = startCol; j < startCol + 3; j++) {
          if (board[i][j] === num) return false;
        }
      }
  
      return true;
    }
  
    function clearGrid() {
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const cell = document.getElementById(`cell-${row}-${col}`);
          cell.value = '';
          cell.classList.remove('user-input', 'solved');
        }
      }
      statusDisplay.textContent = '';
      clearInterval(timerInterval);
      timerDisplay.textContent = 'Time: 0s';
    }
  
    function loadSamplePuzzle() {
      clearGrid();
      const sample = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
      ];
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          if (sample[r][c] !== 0) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            cell.value = sample[r][c];
            cell.classList.add('user-input');
          }
        }
      }
    }
  
    function startTimer() {
      startTime = Date.now();
      timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = `Time: ${elapsed}s`;
      }, 1000);
    }
  
    function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  
    function launchConfetti() {
      const confetti = document.createElement('div');
      confetti.innerHTML = '🎉';
      confetti.style.position = 'fixed';
      confetti.style.top = '50%';
      confetti.style.left = '50%';
      confetti.style.transform = 'translate(-50%, -50%)';
      confetti.style.fontSize = '4rem';
      confetti.style.animation = 'fadeOut 2s ease-out forwards';
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 2000);
    }
  
    document.querySelectorAll('.number-pad button').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!selectedCell) return;
        const num = btn.getAttribute('data-number');
        const action = btn.getAttribute('data-action');
        if (action === 'erase') selectedCell.value = '';
        else if (num) selectedCell.value = num;
      });
    });
  
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
    });
  
    // Beginner helper pop-up
    alert("👋 Welcome to Sudoku Solver!\n\nHOW TO PLAY:\n- Fill each row, column, and 3x3 box with numbers 1-9.\n- Use the Number Pad to input values.\n- Load a sample puzzle and try solving it yourself.\n- Click Solve if you get stuck or just want to cheat a little 😉\n\nHave fun and good luck!");
  
    createGrid();
    solveButton.addEventListener('click', solveSudoku);
    clearButton.addEventListener('click', clearGrid);
    sampleButton.addEventListener('click', loadSamplePuzzle);
  });
  