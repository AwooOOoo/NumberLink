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
+--+--+--+--+--+
| 0| 1| 2| 3| 4|
+--+--+--+--+--+
| 5| 6| 7| 8| 9|
+--+--+--+--+--+
|10|11|12|13|14|
+--+--+--+--+--+
|15|16|17|18|19|
+--+--+--+--+--+
|20|21|22|23|24|
+--+--+--+--+--+

#Running:

>node NumberLink.js
