# NumberLink
Javascript Implementation of NumberLink problem using a maze wall follower algorithm.

# Motivation

A friend got me thinking about how to solve Number Link boards (see the game 'Free Flow') and after playing a bunch of them, many can be solved with the same strategy, which amounts to a maze wall following algorithm. This project is a JS implementation of such an algorithm which solves over 90% of the boards with only wall following.

If you want to read more about the Number link puzzle (try https://en.wikipedia.org/wiki/Numberlink) which lists it as a NP-Complete problem.

### Will I adapt the algorithm to solve 100% of all puzzles?
We will see. I have a short attention span when other shiny puzzles are nearby.

I have an idea on how to complete the rest using the same algorithm. In the current version, you complete one entire start to end path before putting the board back on the list for then another path to be completed. This assumes that entire paths can be found with the wall following algorithm alone. In more complex problems however I find myself doing a partial path which then helps define another path more easily (i.e. with wall following). The question becomes, how much of a partial path is sufficient

### Did you know there was a (better?) implementation already on github that also includes a puzzle generator(https://github.com/thomasahle/numberlink)?
No, but that was the point. I wanted to see if the idea would work. 

# Installation:

If you don't already have Node installed you can get it here:
https://nodejs.org/en/download/

The script depends on the md5 library which it uses to create hashes of boards so that duplicates are not created.

>npm install

# File Format

This script coincidently uses the same format as the original "Free Flow" game by 'Big Duck Games LLC' (https://www.microsoft.com/en-us/p/flow-free/9wzdncrdqvpj?activetab=pivot:overviewtab). Its a cool game that I've gotten hours of puzzle solving fun with, so have a try and support them by buying an expansion if you can.

The game level files are not included in this repo, but if you have the Windows 10 verson of the game installed you can find them in the *C:\Program Files\WindowsApps\BigDuckGamesLLC.Flow_1.7.0.3_x64__1eenntbmr0etw\Levels* directory. Note that the *WindowsApps* directory is by default hidden and protected so you would need to allow visibility and grant yourself access to enter the directory.

The file is a text file with one game board being described per line. Each board description is as follows;

[size],[type],[boardnumber],[numpaths]; path1.cell1, path1.cell2, ... ; path2.cell1, path2.cell2, ...; pathn.cell1, ...

*size:* The size of the board size x size (i.e. 5x5)
*type:* 0 = square matrix board
*boardnumber:* unique integer for each board
*numpaths:* number of paths (i.e. different colored pairs) to link up

Numbering of board cells (for a 5x5 board):
<table>
    <tr><td>0</td><td>1</td><td>2</td><td>3</td><td>4</td></tr>
    <tr><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td></tr>
    <tr><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td></tr>
    <tr><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td></tr>
    <tr><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td></tr>
</table>

Lets assume you want to encode the following board (where the numbers represent two endpoints belowing to the same path, which are normally uniquely colored).

<table>
    <tr><td>3</td><td>.</td><td>2</td><td>0</td><td>1</td></tr>
    <tr><td>.</td><td>.</td><td>.</td><td>.</td><td>.</td></tr>
    <tr><td>.</td><td>.</td><td>.</td><td>1</td><td>.</td></tr>
    <tr><td>.</td><td>2</td><td>.</td><td>.</td><td>0</td></tr>
    <tr><td>.</td><td>.</td><td>.</td><td>.</td><td>3</td></tr>
</table>

If you complete the puzzle it looks like the following:

<table>
    <tr><td>3</td><td>2</td><td>2</td><td>0</td><td>1</td></tr>
    <tr><td>3</td><td>2</td><td>0</td><td>0</td><td>1</td></tr>
    <tr><td>3</td><td>2</td><td>0</td><td>1</td><td>1</td></tr>
    <tr><td>3</td><td>2</td><td>0</td><td>0</td><td>0</td></tr>
    <tr><td>3</td><td>3</td><td>3</td><td>3</td><td>3</td></tr>
</table>

The cells of each color are listed in order from one end to the other. Each cell should be mentioned by one of the paths. So we get the following:

0: 3,8,7,12,17,18,19
1: 4,9,14,13
2: 2,1,6,11,16
3: 0,5,10,15,20,21,22,23,24

The configuration information for the beginning of the row is:
*size:* 5 // Means 5x5 board
*type:* 0 // Default for square board
*boardnumber:* 1 // Our first board
*numpaths:* 4 // Because we have 4 different paths

Putting it altogether our board is;

### 5,0,1,4; 3,8,7,12,17,18,19; 4,9,14,13; 2,1,6,11,16; 0,5,10,15,20,21,22,23,24

#Running:

>node NumberLink.js

```
>node NumberLink.js Levels\levelpack_1.txt
Opening:  Levels\levelpack_1.txt
Board  1 :
Unsolved:
 [ [ '0', '.', '1', '.', '3' ],
  [ '.', '.', '2', '.', '4' ],
  [ '.', '.', '.', '.', '.' ],
  [ '.', '1', '.', '3', '.' ],
  [ '.', '0', '2', '4', '.' ] ]
Solved:
 [ [ '0', '1', '1', '3', '3' ],
  [ '0', '1', '2', '3', '4' ],
  [ '0', '1', '2', '3', '4' ],
  [ '0', '1', '2', '3', '4' ],
  [ '0', '0', '2', '4', '4' ] ]
Maximimum board stack size during computation:  14
Board  2 :
Unsolved:
 [ [ '3', '.', '.', '.', '.' ],
  [ '.', '.', '.', '.', '.' ],
  [ '.', '.', '1', '.', '.' ],
  [ '2', '1', '0', '.', '3' ],
  [ '0', '.', '.', '.', '2' ] ]
Solved:
 [ [ '3', '3', '3', '3', '3' ],
  [ '2', '2', '2', '2', '3' ],
  [ '2', '1', '1', '2', '3' ],
  [ '2', '1', '0', '2', '3' ],
  [ '0', '0', '0', '2', '2' ] ]
Maximimum board stack size during computation:  7
Board  3 :
Unsolved:
 [ [ '.', '3', '2', '1', '.' ],
  [ '.', '.', '.', '0', '.' ],
  [ '.', '.', '0', '.', '.' ],
  [ '3', '.', '.', '4', '.' ],
  [ '2', '.', '4', '1', '.' ] ]
Solved:
 [ [ '3', '3', '2', '1', '1' ],
  [ '3', '2', '2', '0', '1' ],
  [ '3', '2', '0', '0', '1' ],
  [ '3', '2', '4', '4', '1' ],
  [ '2', '2', '4', '1', '1' ] ]
Maximimum board stack size during computation:  11

...

...

...

Board  147 :
Unsolved:
 [ [ '4', '.', '.', '.', '.', '.', '.', '.', '.' ],
  [ '.', '.', '.', '.', '.', '.', '.', '2', '.' ],
  [ '.', '.', '.', '.', '.', '.', '.', '.', '.' ],
  [ '.', '6', '.', '.', '.', '.', '.', '.', '3' ],
  [ '.', '.', '.', '4', '.', '.', '6', '.', '.' ],
  [ '.', '5', '.', '0', '.', '.', '.', '.', '.' ],
  [ '.', '.', '.', '7', '.', '.', '5', '.', '.' ],
  [ '2', '.', '7', '.', '1', '.', '.', '.', '.' ],
  [ '0', '.', '1', '.', '.', '3', '.', '.', '.' ] ]
Solved:
 [ [ '4', '4', '4', '4', '4', '4', '4', '4', '4' ],
  [ '2', '2', '2', '2', '2', '2', '2', '2', '4' ],
  [ '2', '6', '6', '6', '6', '6', '6', '4', '4' ],
  [ '2', '6', '5', '5', '5', '5', '6', '4', '3' ],
  [ '2', '5', '5', '4', '4', '5', '6', '4', '3' ],
  [ '2', '5', '0', '0', '4', '5', '5', '4', '3' ],
  [ '2', '0', '0', '7', '4', '4', '5', '4', '3' ],
  [ '2', '0', '7', '7', '1', '4', '4', '4', '3' ],
  [ '0', '0', '1', '1', '1', '3', '3', '3', '3' ] ]
Maximimum board stack size during computation:  20
Board  148 :
Unsolved:
 [ [ '3', '.', '.', '.', '.', '.', '.', '.', '.' ],
  [ '.', '.', '.', '.', '.', '.', '.', '.', '.' ],
  [ '.', '.', '.', '.', '.', '.', '.', '.', '.' ],
  [ '.', '3', '.', '.', '.', '.', '.', '.', '.' ],
  [ '.', '4', '.', '.', '5', '.', '.', '.', '.' ],
  [ '.', '.', '0', '.', '4', '.', '.', '.', '.' ],
  [ '.', '.', '2', '.', '.', '6', '.', '.', '.' ],
  [ '.', '0', '.', '.', '.', '.', '.', '1', '.' ],
  [ '.', '.', '1', '2', '5', '6', '.', '.', '.' ] ]
Solved:
 [ [ '3', '3', '3', '3', '3', '3', '3', '3', '3' ],
  [ '1', '1', '1', '1', '1', '1', '1', '1', '3' ],
  [ '1', '3', '3', '3', '3', '3', '3', '1', '3' ],
  [ '1', '3', '4', '4', '4', '4', '3', '1', '3' ],
  [ '1', '4', '4', '5', '5', '4', '3', '1', '3' ],
  [ '1', '0', '0', '5', '4', '4', '3', '1', '3' ],
  [ '1', '0', '2', '5', '5', '6', '3', '1', '3' ],
  [ '1', '0', '2', '2', '5', '6', '3', '1', '3' ],
  [ '1', '1', '1', '2', '5', '6', '3', '3', '3' ] ]
Maximimum board stack size during computation:  32
Board  149 :
Unsolved:
 [ [ '5', '.', '.', '.', '.', '.', '.', '.', '.' ],
  [ '4', '.', '.', '.', '4', '.', '.', '6', '.' ],
  [ '.', '.', '.', '.', '.', '.', '.', '3', '.' ],
  [ '.', '.', '.', '.', '.', '.', '.', '5', '.' ],
  [ '.', '2', '7', '.', '7', '2', '.', '0', '.' ],
  [ '.', '.', '.', '.', '.', '0', '.', '1', '.' ],
  [ '.', '.', '3', '.', '.', '.', '.', '.', '.' ],
  [ '.', '.', '.', '1', '.', '.', '.', '.', '.' ],
  [ '.', '6', '.', '.', '.', '.', '.', '.', '.' ] ]
Solved:
 [ [ '5', '5', '5', '5', '5', '5', '5', '5', '5' ],
  [ '4', '4', '4', '4', '4', '6', '6', '6', '5' ],
  [ '6', '6', '6', '6', '6', '6', '3', '3', '5' ],
  [ '6', '2', '2', '2', '2', '2', '3', '5', '5' ],
  [ '6', '2', '7', '7', '7', '2', '3', '0', '0' ],
  [ '6', '0', '0', '0', '0', '0', '3', '1', '0' ],
  [ '6', '0', '3', '3', '3', '3', '3', '1', '0' ],
  [ '6', '0', '0', '1', '1', '1', '1', '1', '0' ],
  [ '6', '6', '0', '0', '0', '0', '0', '0', '0' ] ]
Maximimum board stack size during computation:  5
Board  150 :
Unsolved:
 [ [ '.', '.', '.', '.', '.', '.', '0', '5', '1' ],
  [ '.', '2', '.', '.', '.', '.', '.', '.', '.' ],
  [ '7', '.', '.', '0', '.', '.', '.', '.', '.' ],
  [ '.', '.', '.', '5', '.', '.', '.', '.', '.' ],
  [ '.', '1', '.', '.', '.', '.', '.', '4', '.' ],
  [ '.', '.', '.', '.', '6', '.', '.', '.', '.' ],
  [ '.', '.', '.', '.', '.', '.', '3', '.', '3' ],
  [ '.', '.', '.', '7', '.', '.', '6', '4', '8' ],
  [ '2', '.', '.', '.', '.', '8', '.', '.', '.' ] ]
Solved:
 [ [ '7', '7', '7', '0', '0', '0', '0', '5', '1' ],
  [ '7', '2', '7', '0', '5', '5', '5', '5', '1' ],
  [ '7', '2', '7', '0', '5', '1', '1', '1', '1' ],
  [ '2', '2', '7', '5', '5', '1', '3', '3', '3' ],
  [ '2', '1', '7', '1', '1', '1', '3', '4', '3' ],
  [ '2', '1', '7', '1', '6', '6', '3', '4', '3' ],
  [ '2', '1', '7', '1', '1', '6', '3', '4', '3' ],
  [ '2', '1', '7', '7', '1', '6', '6', '4', '8' ],
  [ '2', '1', '1', '1', '1', '8', '8', '8', '8' ] ]
Maximimum board stack size during computation:  13
Execution time: 4973ms
Statistics:
5 'x' 5 'board has ' 30 '/ 30 solutions found'
6 'x' 6 'board has ' 29 '/ 30 solutions found'
7 'x' 7 'board has ' 29 '/ 30 solutions found'
8 'x' 8 'board has ' 26 '/ 30 solutions found'
9 'x' 9 'board has ' 22 '/ 30 solutions found'
Total Solutions: 136 /  150
Failed:
5 'x' 5 'failures: ' []
6 'x' 6 'failures: ' [ 3 ]
7 'x' 7 'failures: ' [ 7 ]
8 'x' 8 'failures: ' [ 5, 7, 22, 29 ]
9 'x' 9 'failures: ' [ 2, 3, 8, 15, 16, 17, 21, 22 ]
```

#Method

So how does the wall following algorithm work?
Take the following board and lets look at the '0' path first:
```
 [ [ '0', '.', '1', '.', '3' ],
  [ '.', '.', '2', '.', '4' ],
  [ '.', '.', '.', '.', '.' ],
  [ '.', '1', '.', '3', '.' ],
  [ '.', '0', '2', '4', '.' ] ]
```

We need to do a left-hand wall follow and a right-hand for each of the '0' points. In order to do this I need to have a sense of direction, so I just assume we are facing 'up' to start with. So imagine we are on cell 0 which happens to contain a '0' facing up. For a left hand wall follower we need a wall touching our left hand (left hand side of the board) which it is, but we can't move forwards since the top of the board is blocking us, so we turn clockwise 90 degrees so we are facing 'right'. Now we can move to cell 2. Now we are blocked by the '1' in cell 2 so we rotate again and find ourselves in cell 6. Follow this until we are stuck an it looks like this:


1) 0a to 0b left wall follow

```
 [ [ '0', '0', '1', '0', '3' ],
  [ '.', '0', '2', '0', '4' ],
  [ '.', '0', '0', '0', '.' ],
  [ '.', '1', '.', '3', '.' ],
  [ '.', '0', '2', '4', '.' ] ]
```

2) 0a to 0b right wall follow

This was the same as left but we want a wall always touching the right-hand side and when we are blocked in front of us we rotate left, not right. Notice this particular path we actually reach the destination 0b in cell 20.

```
 [ [ '0', '.', '1', '.', '3' ],
  [ '0', '.', '2', '.', '4' ],
  [ '0', '.', '.', '.', '.' ],
  [ '0', '1', '.', '3', '.' ],
  [ '0', '0', '2', '4', '.' ] ]
```

3) 0b to 0a left wall follow
Notice this produces the same result as the board as the 2) above.

```
 [ [ '0', '.', '1', '.', '3' ],
  [ '0', '.', '2', '.', '4' ],
  [ '0', '.', '.', '.', '.' ],
  [ '0', '1', '.', '3', '.' ],
  [ '0', '0', '2', '4', '.' ] ]
```

4) 0b to 0a right wall follow
```
 [ [ '0', '.', '1', '.', '3' ],
  [ '.', '.', '2', '.', '4' ],
  [ '0', '0', '0', '.', '.' ],
  [ '0', '1', '0', '3', '.' ],
  [ '0', '0', '2', '4', '.' ] ]
```

Now we check for duplicates and to see if any of the solutions block any of the endpoints. Numbers 2) and 3) are duplicates. Number 1) blocks the '1' in cell 2 and the '2' in cell 7. Number 4 blocks the '1' in cell 16 and the '2' in cell 22. Based on this we only propagate number 2). It is possible that more than one solution makes it to the next round.

We also do this whole process for each number (so '0', '1', '2' and '3') so multiple partially solved boards make it to the next round.
At the end of a round you if the list of boards is empty, you are either stuck or complete. To check you are complete, simply look if there are any unused cells.

In the next round you repeats the same process all over again.



