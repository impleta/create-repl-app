/**
 * This is executed on startup of the REPL.
 * 
 * Any exports are accessible at the top-level in the REPL, and 
 * any scripts executed by the repl.
 */
import {MyLib1} from "./MyLib1";
import {MyLib2} from "./MyLib2";

export {MyLib1, MyLib2};