# Console utility for working with comments in files 

## Task

The utility will take all files with the .js extension in the current directory, find all comments with TODO in them.
All single-line TODO comments have the same beginning: two slashes, the word TODO (in any case), a space or a colon (or a colon, and a space; or a space-a colon-space; or several spaces) and then the comment text.
Comment text in todo can be represented in plain text. Or use special markup:
	// TODO {Author name}; {Date}; {Text}
A semicolon is required after the name and date, but a space between them is optional.

### Utility commands 

1.	exit :
2.	show : show all TODO comments
3.	important : show only important comments.
4.	user {username} : show user's comments
5.	sort {importance | user | date} : sort by param
6. 	date {yyyy[-mm-dd]}: shows all comments created after the transmitted date (inclusive).

## Install and start
*	npm install
*	node index.js (for linux: nodejs index.js)

## Examples

### Show

![](https://media.giphy.com/media/RleGF1UbwVAeK1yQUC/giphy.gif)

### Important

![](https://media.giphy.com/media/IgXxXS45VxaycwXCRH/giphy.gif)

### Sort 

![](https://media.giphy.com/media/Q5de61mHs4wDpxf6Aw/giphy.gif)

### Date

![](https://media.giphy.com/media/LrRoCyMRRoWjIgVBwY/giphy.gif)

### User

![](https://media.giphy.com/media/SXTlxdbahCbHw6Yjvd/giphy.gif)

## Project status

Project completed
