import React from "react";
import runWeakAi from "./WeakAI.js";
import runMediumAi from "./mediumAI.js";
import Alert from './Alert.js'
import './App.css'



class Game extends React.Component {
  componentDidMount() {
    this.initGame();
  }

  state = {
    battlefield: [],
    formation_count: 1,
    formation_countb: 1,
    storage_A: [[], [], [], [], [], [], [], [], [], [], [], []],
    storage_B: [[], [], [], [], [], [], [], [], [], [], [], []],
    fleetB: [5, 4, 3, 3, 2],
    fleetB_logo: ["C", "B", "c", "S", "D"],
    //In dir_check array, left, right, bottom, top
    //                    west, east, south, north
    dir_check: [],
    dir_id: [],
    eligible_dir: 0,
    is_eligible: 0,

    battlefield_mirror: [],
    setup_A: 0,
    startGame: 0,

    carrierB: 5,
    carrierA: 5,

    battleshipB: 4,
    battleshipA: 4,

    cruiserB: 3,
    cruiserA: 3,

    submarineB: 3,
    submarineA: 3,

    destroyerB: 2,
    destroyerA: 2,

    successfulHitsA: 0,
    successfulHitsB: 0,

    playerA_turn: 0,
    playerB_turn: 0,

    game_victory: 0,

    setupCount: 0,

    AI_diff: 'none',
    AI_picked: 0,

    message:'', 
  };



  updateDifficulty = (event) => {
    this.setState({
      AI_diff: event.target.value
    })
  } 

  initGame = () => {
    this.setState({
      battlefield: this.createBattlefield([]),
      storage_A: this.createBattlefield([]),
      storage_B: this.createBattlefield([]),
    });
  };

  refreshBattlefield = () => {
    this.setState({
      battlefield: this.createBattlefield([]),
    });
  };
  createBattlefield = (arr) => {
    for (let i = 0; i < 12; i++) {
      arr.push([]);
      for (let j = 0; j < 12; j++) {
        arr[i].push("");
      }
    }
    return arr;
  };

  showNewbattlefield = () => {
    this.setState({
      battlefield_mirror: this.createBattlefield([]),
    });
  };

  renderSquares(row) {
    let rendered_squares = [];
    if (this.state.setup_A == 0 && this.state.startGame == 0) {
      for (let index = 0; index < this.state.storage_A[row].length; index++) {
        let square = this.state.storage_A[row][index];
        let square_key = row * 10 + index;
        rendered_squares.push(
          <td
            key={square_key}
            onClick={() => {
              this.updateFormationA(row, index);
            }}
          >
            {square}
          </td>
        );
      }
    } else if (this.state.setup_A == 1 && this.state.startGame == 0) {
      for (let index = 0; index < this.state.storage_B[row].length; index++) {
        let square = this.state.storage_B[row][index];
        let square_key = row * 10 + index;
        rendered_squares.push(
          <td
            key={square_key}
            onClick={() => {
              this.updateFormationB();
            }}
          >
            {square}
          </td>
        );
      }
    } else if (this.state.setup_A == 1 && this.state.startGame == 1) {
      for (let index = 0; index < this.state.battlefield_mirror[row].length; index++) {
        let square = this.state.battlefield_mirror[row][index];
        let square_key = row * 10 + index;
        rendered_squares.push(
          <td
            key={square_key}
            onClick={() => {
              this.playerClickAt(row, index);
            }}
          >
            {square}
          </td>
        );
      }
    } else {
      alert("Oopsies, please refresh");
    }

    return rendered_squares;
  }

  updateFormationA = async (row, col) => {
    let row_copy = [...this.state.battlefield[row]];
    let storage_A_copy = [...this.state.storage_A];

    if ((this.state.setup_A == 0) && (row <= 5)) {
      if (row_copy[col] == "" && this.state.formation_count <= 5) {
        row_copy[col] = "C";
        storage_A_copy[row][col] = "C";
      } else if (
        row_copy[col] == "" &&
        this.state.formation_count >= 6 &&
        this.state.formation_count <= 9
      ) {
        row_copy[col] = "B";
        storage_A_copy[row][col] = "B";
      } else if (
        row_copy[col] == "" &&
        this.state.formation_count >= 10 &&
        this.state.formation_count <= 12
      ) {
        row_copy[col] = "c";
        storage_A_copy[row][col] = "c";
      } else if (
        row_copy[col] == "" &&
        this.state.formation_count >= 13 &&
        this.state.formation_count <= 15
      ) {
        row_copy[col] = "S";
        storage_A_copy[row][col] = "S";
      } else if (
        row_copy[col] == "" &&
        this.state.formation_count >= 16 &&
        this.state.formation_count <= 17
      ) {
        row_copy[col] = "D";
        storage_A_copy[row][col] = "D";
      } else {
        return;
      }
      let battlefield_copy = [...this.state.battlefield];
      battlefield_copy[row] = row_copy;

      await this.setState({
        battlefield: battlefield_copy,
        formation_count: ++this.state.formation_count,
        storage_A: storage_A_copy,
      });

      if (this.state.formation_count == 18) {
        await this.setState({
          setup_A: 1,
          battlefield_mirror: [...this.state.storage_A],
        });
        alert('CLICK ON BATTLEFIELD TO PROCEED')
      }
      
    }
    else{
      alert("This is the enemy territory!")
    }
  };

  chooseDirection = async (max_num) => {
    let rand_num = 0;
    let biggest = 0;
    let dir_record = 0;
    let dir_id_clone = [...this.state.dir_id];
    let dir_check_clone = [...this.state.dir_check];

    console.log("Before If else statements");
    console.log(dir_check_clone);
    console.log(dir_id_clone);

    if (this.state.eligible_dir == 1) {
      for (let i = 0; i < this.state.dir_check.length; i++) {
        if (this.state.dir_check[i] == max_num) {
          dir_id_clone[i] = 1;
        }
      }
    } else {
      for (let j = 0; j < this.state.dir_check.length; j++) {
        if (this.state.dir_check[j] == max_num) {
          dir_id_clone[j] = 1;
        }
      }
    }
    await this.setState({
      dir_id: dir_id_clone,
    });
    console.log("Direction_ID");
    console.log(this.state.dir_check);
    console.log(this.state.eligible_dir);
    console.log(this.state.dir_id);

    for (let k = 0; k < this.state.dir_id.length; k++) {
      if (this.state.dir_id[k] == 1) {
        rand_num = Math.floor(Math.random() * 100) + 1;
        console.log("Generated random number = ", rand_num);
        if (rand_num > biggest) {
          biggest = rand_num;
          console.log("Check rand_num");
          console.log(rand_num);
          dir_record = k;
        }
      }
    }
    console.log("Direction chosen = ", dir_record);
    return dir_record;
  };

  betweenTwoNum = (min, max) => {
    let numGen = Math.floor(Math.random() * (max - min + 1) + min);
    return numGen;
  };
  //Put this function as part of the loop for looping through fleet B
  countFreeSpace = async (row, col, max_num, storage_B_copy) => {
    let count_num = [0, 0, 0, 0];
    let temp_col = 0;
    let temp_row = 0;
    let count = 0;
    let directions_arr = [
      [-1, 0],
      [1, 0],
      [0, 1],
      [0, -1],
      //Left , right, bottom, top
    ];
    let dir_count = 0;
    console.log("start row = ", row, "start col = ", col);
    for (let i = 0; i < 4; i++) {
      temp_row = row;
      temp_col = col;
      count = 0;
      //1st iteration: max_num is 5

      while (
        temp_col >= 0 &&
        temp_col <= 11 &&
        temp_row >= 6 &&
        temp_row <= 11
      ) {
        if (storage_B_copy[temp_row][temp_col] == "") {
          count++;
          if (count == max_num) {
            count_num[i] = count;
            break;
          }
        } else {
          break;
        }
        temp_col = temp_col + directions_arr[i][0];
        temp_row = temp_row + directions_arr[i][1];
      }
    }
    for (let j = 0; j < count_num.length; j++) {
      if (count_num[j] == max_num) {
        dir_count++;
      }
    }
    if (dir_count >= 1) {
      await this.setState({
        eligible_dir: dir_count,
        dir_check: count_num,
        dir_id: [0, 0, 0, 0],
      });
      console.log("count num: ", count_num);
      return true;
    } else {
      return false;
    }
  };

  checkSlot = (row, col, storage_B_copy) => {
    do {
      row = this.betweenTwoNum(6, 11);
      col = this.betweenTwoNum(0, 11);
    } while (storage_B_copy[row][col] != "");

    return [row, col];
  };

  updateFormationB = async () => {
    //Fill up B side of the battlefield with ''
    let storage_B_copy = [...this.state.storage_B];
    let row = 0;
    let col = 0;

    for (let r = 0; r < 12; r++) {
      for (let c = 0; c < 12; c++) {
        storage_B_copy[r][c] = "";
      }
    }

    //fleetB_logo: ['C' , 'B' , 'c' , 'S' , 'D'],
    //fleetB: ['5' , '4' , '3' , '3' , '2']

    for (let i = 0; i < this.state.fleetB.length; i++) {
      let direction = 0;
      let is_eligible = false;
      while (is_eligible == false) {
        [row, col] = this.checkSlot(row, col, [...storage_B_copy]);
        is_eligible = await this.countFreeSpace(
          row,
          col,
          this.state.fleetB[i],
          [...storage_B_copy]
        );
      }
      direction = await this.chooseDirection(this.state.fleetB[i]);
      console.log("Putting the ship in this direction = ", direction);

      //In dir_check array, left, right, bottom, top
      for (let j = 0; j < this.state.fleetB[i]; j++) {
        console.log("Dir = ", direction, "row = ", row, "col = ", col);
        storage_B_copy[row][col] = this.state.fleetB_logo[i];
        if (direction == 0) {
          col--;
        } else if (direction == 1) {
          col++;
        } else if (direction == 2) {
          row++;
        } else {
          row--;
        }
      }
    }

    this.setState({
      storage_B: storage_B_copy,
      playerA_turn: 1,
      startGame: 1,
    });
    this.gamePlaySet();
    alert("Player A may initiate the battle! May the best fleet win!");
  };

  
  gamePlaySet = () => {
    /*this.setState({
      battlefield_mirror: this.state.battlefield,
    });*/
    this.refreshBattlefield();
  };

  playerClickAt = async (row, col) => {
    if (this.state.playerA_turn == 1) {
      this.gamePlay(row, col);
    }
  };

  // The statements for player A is not showing ==> 'You have missed' 'You have hit a part of ...' is not showing
  gamePlay = async (row, col) => {
    if(this.state.AI_diff != 'none'){
    await  this.setState({
        AI_picked: 1
      })
    }
    if(this.state.AI_picked == 1){
      if (this.state.playerA_turn == 1) {
        if (row >= 0 && row <= 5) {
          this.setState({
            message: "Oopsies, please do not commit fratricide"
          })
        } else if (
          this.state.battlefield[row][col] == "X" ||
          this.state.battlefield[row][col] == "O" //Maybe change to battlefield mirror to show player A side
        ) {
          this.setState({
            message: 'Please do not waste your ammunition!'
          })
        } else {
          if (this.state.storage_B[row][col] == "") {
            this.state.battlefield[row][col] = "O";

          } else if (this.state.storage_B[row][col] == "C") {
            this.state.battlefield[row][col] = "X";
            this.setState({
              carrierB: this.state.carrierB - 1,
              successfulHitsA: this.state.successfulHitsA + 1,
            });
        
            if (this.state.carrierB == 0) {
              alert("Player B carrier is sunk!");
            }
          } else if (this.state.storage_B[row][col] == "B") {
            this.state.battlefield[row][col] = "X";
            this.setState({
              battleshipB: this.state.battleshipB - 1,
              successfulHitsA: this.state.successfulHitsA + 1,
            });
  
            if (this.state.battleshipB == 0) {
              alert("Player B battleship is sunk!");
            }
          } else if (this.state.storage_B[row][col] == "c") {
            this.state.battlefield[row][col] = "X";
            this.setState({
              cruiserB: this.state.cruiserB - 1,
              successfulHitsA: this.state.successfulHitsA + 1,
              message: 'You have hit a part of a cruiser!'
            });

            if (this.state.cruiserB == 0) {
              alert("Player B cruiser is sunk!");
            }
          } else if (this.state.storage_B[row][col] == "S") {
            this.state.battlefield[row][col] = "X";
            this.setState({
              submarineB: this.state.submarineB - 1,
              successfulHitsA: this.state.successfulHitsA + 1,
            });

            if (this.state.submarineB == 0) {
              alert("Player B submarine is sunk!");
            }
          } else if (this.state.storage_B[row][col] == "D") {
            this.state.battlefield[row][col] = "X";
            this.setState({
              destroyerB: this.state.destroyerB - 1,
              successfulHitsA: this.state.successfulHitsA + 1,
            }); 
            if (this.state.destroyerB == 0) {
              alert("Player B destroyer is sunk!");
            }
          } else {
            return;
          }
          this.setState({
            message: 'AI turn'
          })

          await this.setState({
            playerA_turn: 0,
            playerB_turn: 1,
          });
          setTimeout(()=>{
              this.gamePlay();
          }, 1000);
        }
      } 
      else{
        if (this.state.playerB_turn == 1) {
          // I create two clones: bfield_clone , one storageb clone 
          let ship = ''
          let modifySuccessfulHits = async (change) => {
              await this.setState({
                successfulHitsB: this.state.successfulHitsB + change
              })
          }
  
          let modifyFieldArray = async (row , col , symbol) => {
            let B_field_copy = [...this.state.battlefield]
            B_field_copy[row][col] = symbol
            await this.setState({
               battlefield: B_field_copy
  
            })
          }

          if(this.state.AI_diff == 'weak'){
            ship = await runWeakAi(this.state.storage_A, modifySuccessfulHits , modifyFieldArray , this.state.battlefield)

          } 
          else if(this.state.AI_diff == 'strong'){
            ship = await runMediumAi(this.state.storage_A , modifySuccessfulHits , modifyFieldArray , this.state.battlefield)
          } 
          else{
            alert("Please pick an AI difficulty!")
          }
          
  
          if(ship == 'C'){
            await this.setState({
              carrierA: this.state.carrierA - 1
            })
          }
          else if(ship == 'B'){
            await this.setState({
              battleshipA: this.state.battleshipA - 1
            })
          }
          else if(ship == 'c'){
            await this.setState({
              cruiserA: this.state.cruiserA - 1
            })
          }
          else if(ship == 'S'){
            await this.setState({
              submarineA: this.state.submarineA - 1
            })
          }
          else if(ship == 'D'){
            await this.setState({
              destroyerA: this.state.destroyerA - 1
            })
          }
    
  
          if(this.state.carrierA == 0 && ship == 'C'){
            alert("Player A carrier is sunk!")
          }
          else if(this.state.battleshipA === 0 && ship == 'B'){
            alert("Player A battleship is sunk!")
          }
          else if(this.state.cruiserA === 0 && ship == 'c'){
            alert("Player A cruiser is sunk!")
          }
          else if(this.state.submarineA === 0 && ship == 'S'){
            alert("Player A submarine is sunk!")
          }
          else if(this.state.destroyerA === 0 && ship == 'D'){
            alert("Player A destroyer is sunk!")
          }
  
  
          await this.setState({
            message: 'It is your turn!'
          })

          let battlefield_mirror = this.state.storage_A.map(function(arr){
            return arr.slice();
          })
          // double for loop
          for(let i = 0; i < 12; i++){
            for(let j = 0; j < 12; j++){
              if(this.state.battlefield[i][j] == 'X' || this.state.battlefield[i][j] == 'O'){
                battlefield_mirror[i][j] = this.state.battlefield[i][j]
              }
            }
          }

          // go through each square in this.state.battlefield
          // if the square has X or O copy over to the battlefield_mirror
  
          this.setState({
            playerA_turn: 1,
            playerB_turn: 0,
            battlefield_mirror: battlefield_mirror
          });
        }
      }
  
    }
    else{
      alert("Please choose AI difficulty before proceeding")
    }
    

    
    if((this.state.successfulHitsA == 17) && (this.state.game_victory != 1)){
        alert("Player A is the king of the battlefield! Restarting game....")
        this.initGame();
    }
    else if((this.state.successfulHitsB== 17) && (this.state.game_victory != 1)){
        alert("AI is the king of the battlefield! Restarting game....")
        this.initGame();
    }
    else{
        return
    }
        
  }

  countFire() {
    let fires = 0;
    for (let r=0; r<12; r++) {
      for (let c=0; c<12; c++) {
        if (this.state.battlefield[r][c] !== "") {
          fires++;
        }
      }
    }
    return fires;
  }

  render() {
    if (this.state.battlefield.length == 0) {
      return <div></div>;
    }
    return (

      <div>
        <div id = 'header'>Welcome to battleship</div>

        <div id = 'container'>
          <div class = 'statements'>

            <p id = 'tracker'>
              <label>Shots fired: </label>{this.countFire()} <label>(Ignore this number during setup process)</label>

              <br/>
              <br/>
            
              {this.state.startGame ? this.state.playerA_turn ? <p>Player A's turn</p> : <p>Player B's turn</p> : null}

              <br/>

              <label id ='diff'>Choose AI difficulty:</label>
              <br/>
              <br/>


                <div class = 'options'>
                  <input type = 'radio' value = 'weak' name = 'level' onChange = {this.updateDifficulty}/>
                  <label id = "weak">Weak</label>
                  <span class = "checkmark"></span>
                </div>

                <br/>
                <br/> 

                <div class = "options">
                  <input type = 'radio' value = 'strong' name = 'level' onChange = {this.updateDifficulty}/>
                  <label id = "strong">Strong</label>
                  <span class = "checkmark"></span>
                </div>
               

               
            </p>

          </div>

          <br/>

          <div>
            <p id = 'symbols'>
                X = Hit ,
                O = Miss
            </p>
          </div>

          <Alert message = {this.state.message}/>
          <br/>
          <div id = 'layout'>
            <table id = 'battlefield'> 
              <tr class = 'A_side'><label>Row 0</label> {this.renderSquares(0)}</tr>   

              <tr class = 'A_side'><label>Row 1</label> {this.renderSquares(1)}</tr>

              <tr class = 'A_side'><label>Row 2</label> {this.renderSquares(2)}</tr>

              <tr class = 'A_side'><label>Row 3</label> {this.renderSquares(3)}</tr>

              <tr class = 'A_side'><label>Row 4</label> {this.renderSquares(4)}</tr>

              <tr class = 'A_side'><label>Row 5</label> {this.renderSquares(5)}</tr>

              <br/>

              <tr class = 'B_side'><label>Row 6</label> {this.renderSquares(6)}</tr>

              <tr class = 'B_side'><label>Row 7</label> {this.renderSquares(7)}</tr>

              <tr class = 'B_side'><label>Row 8</label> {this.renderSquares(8)}</tr>

              <tr class = 'B_side'><label>Row 9</label> {this.renderSquares(9)}</tr>

              <tr class = 'B_side'><label>Row 10</label> {this.renderSquares(10)}</tr>

              <tr class = 'B_side'><label>Row 11</label> {this.renderSquares(11)}</tr>

            </table>

            <h1 id = 'instructions'>
              <p>
                Battleships instructions:
                <br/>
                Player A = you
                Player B = AI
              </p>
              <p>
                Basic Game Setup:
                <br/>
                <br/>
                Carrier  -----  5 spaces (Marked by uppercase character 'C')
                <br/>
                <br/>
                Battleship  -----  4 spaces (Marked by uppercase character 'B')
                <br/>
                <br/>
                Cruiser  -----  3 spaces (Marked by lowercase character 'c')
                <br/>
                <br/>
                Submarine  -----  3 spaces (Marked by uppercase character 'S')
                <br/>
                <br/>
                Destroyer  -----  2 spaces (Marked by lowercase character 'D')
                <br/>
                <br/>
                Your Role as Player A:
                  <br/>
                  <br/>
                  1) Choose your opponent AI difficulty
                  <br/>
                  <br/>
                  2) Choose any space between rows 0 to 5 to place your fleet.
                  <br/>
                  <br/>
                  3) You can place them vertically/horizontally but not diagonally as per the actual board game. 
                  <br/>
                  <br/>
                  4) Once done, click on the board once to continue
              </p>
              <p>
                  <br/>
                  <br/>
                  Basic Gameplay:
                    <br/>
                    <br/>
                    During your turn, choose any space between row 6 to 11 to fire at 
                    <br/>
                    <br/>
                    Any ship you sank will be announced
                    <br/>
                    <br/>
                    Sink all of your AI opponent ships to win the game
              </p>
            </h1>
          </div>

          <br/>

        </div>
        
      </div>
    );
  }
}

export default Game;
