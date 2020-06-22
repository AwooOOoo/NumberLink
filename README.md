# NumberLink
Javascript Implementation of NumberLink problem using a maze waller follower algorithm


#Installation:
The script depends on the md5 library which it uses to create hashes of boards so that duplicates are not created.

>npm install

#File Format
This script coincidently uses the same format as Free Flow by 'Big Duck Games LLC' (https://www.microsoft.com/en-us/p/flow-free/9wzdncrdqvpj?activetab=pivot:overviewtab). The game level files are not included in this repo, but if you have the Windows 10 verson of the game installed you can find them in the *C:\Program Files\WindowsApps\BigDuckGamesLLC.Flow_1.7.0.3_x64__1eenntbmr0etw\Levels* directory. Note that the *WindowsApps* directory is by default hidden and protected so you would need to allow visibility and grant yourself access to enter the directory.

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

Lets assume you want to encode the following board:

<table>
    <tr><td bgcolor="DarkViolet">0</td><td>1</td><td bgcolor="blue">2</td><td bgcolor=red">3</td><td bgcolor="green">4</td></tr>
    <tr><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td></tr>
    <tr><td>10</td><td>11</td><td>12</td><td bgcolor="green">13</td><td>14</td></tr>
    <tr><td>15</td><td bgcolor="blue">16</td><td>17</td><td>18</td><td bgcolor="red">19</td></tr>
    <tr><td>20</td><td>21</td><td>22</td><td>23</td><td bgcolor="DarkViolet">24</td></tr>
</table>

#Running:

>node NumberLink.js
