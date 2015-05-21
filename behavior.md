
## check if user token exists 
* on fail prompt login or create user
 * on login ask username password
  * on success login go to main
  * on fail login go back to login
 * on create user ask username email password
  * on success try login
  * on fail try create user again

## create user
* - propt unique username
* - prompt unique email
* - prompt password
 * 		on fail retry
 *		on success try login

## login 
* - if comeing from create user
 * - send username password
* - if login in with pre existing acount
 * - prompt for username 
 * - prompt for password
  * 		on fail tell user 
  * 		on success store token

## menu
// - prompt user if the want to fetch story, browse, or profile
// 		on fetch story go to requset /api/skribbl
// 		on brows go to /api/story
// 		on profile go to /api/timeline

## request skribble start
// - ask for skribbl start
// 		on fail tell user && re ask
// 		on succes print first level && options
// - ask user to keep reading or fork
// 		on fork ask user for some writing
// 				on fail make user retry
// 				on success request return to menu
// 		on read further print next and repete prompt
