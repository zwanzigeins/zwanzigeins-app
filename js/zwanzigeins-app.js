import ListenAndWriteGame from './listen-and-write-game.js';
import MentalArithmeticGame from './mental-arithmetic-game.js';
import Pages from './pages.js';
import Sound from './sound.js';
import Utils from './utils.js';

let sound = new Sound();
let pages = new Pages();

new MentalArithmeticGame(sound, pages);
new ListenAndWriteGame(sound, pages);
