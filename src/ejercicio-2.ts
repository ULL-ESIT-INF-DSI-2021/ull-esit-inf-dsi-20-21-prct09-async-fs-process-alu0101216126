import {spawn} from 'child_process';
import * as yargs from 'yargs';
import * as fs from 'fs';

/**
 * Provide information about the number of lines, words or characters that a text file contains. Making use of pipe, spawn and stream
 * @param path File path
 * @param characters Indicate if the user wants to see the characters amount
 * @param words Indicate if the user wants to see the words amount
 * @param lines Indicate if the user wants to see the lines amount
 */
function withPipe(path: string, characters: boolean, words: boolean, lines: boolean) {
  fs.access(path, fs.constants.F_OK, (err) => {
    if (err) console.log('Path doesn\'t exist');
    else {
      let wcOutput = '';
      const wc = spawn('wc', [path]);
      wc.stdout.on('data', (piece) => (wcOutput += piece));

      wc.on('close', () => {
        const wcOutputAsArray = wcOutput.split(/\s+/);
        if (lines) { // if the user wants to see the lines amount
          const echo = spawn('echo', [`File's lines: ${wcOutputAsArray[1]}`]);
          echo.stdout.pipe(process.stdout);
        }
        if (words) { // if the user wants to see the words amount
          const echo = spawn('echo', [`File's words: ${wcOutputAsArray[2]}`]);
          echo.stdout.pipe(process.stdout);
        }
        if (characters) { // if the user wants to see the characters amount
          const echo = spawn('echo', [`File's characters: ${wcOutputAsArray[3]}`]);
          echo.stdout.pipe(process.stdout);
        }
      });
    }
  });
}

/**
 * Provide information about the number of lines, words or characters that a text file contains. Without making use of pipe, spawn and stream
 * @param path File path
 * @param characters Indicate if the user wants to see the characters amount
 * @param words Indicate if the user wants to see the words amount
 * @param lines Indicate if the user wants to see the lines amount
 */
function withoutPipe(path: string, characters: boolean, words: boolean, lines: boolean): void {
  fs.access(path, fs.constants.F_OK, (err) => {
    if (err) console.log('Path doesn\'t exist');
    else {
      let wcOutput = '';
      const wc = spawn('wc', [path]);
      wc.stdout.on('data', (piece) => (wcOutput += piece));

      wc.on('close', () => {
        const wcOutputAsArray = wcOutput.split(/\s+/);
        let final = '';
        if (lines) { // if the user wants to see the lines amount
          final+= `File's lines: ${wcOutputAsArray[1]}\n`;
        }
        if (words) { // if the user wants to see the words amount
          final+= `File's words: ${wcOutputAsArray[2]}\n`;
        }
        if (characters) { // if the user wants to see the characters amount
          final+= `File's characters: ${wcOutputAsArray[3]}\n`;
        }
        console.log(final);
      });
    }
  });
}

/**
 * Yargs execution of the show command. The corresponding command line options must be included
 */
yargs.command({
  command: 'show',
  describe: 'Shows the information of a file',
  builder: {
    file: {
      describe: 'File\'s path',
      demandOption: true,
      type: 'string',
    },
    pipe: {
      describe: 'Whether to use a pipe or not',
      demandOption: true,
      type: 'boolean',
    },
    lines: {
      describe: 'Count lines or not',
      demandOption: true,
      type: 'boolean',
    },
    words: {
      describe: 'Count words or not',
      demandOption: true,
      type: 'boolean',
    },
    characters: {
      describe: 'Count characters or not',
      demandOption: true,
      type: 'boolean',
    },
  },
  handler(argv) {
    if (typeof argv.file === 'string' && typeof argv.pipe === 'boolean'&&
    typeof argv.characters === 'boolean' && typeof argv.words === 'boolean'&&
    typeof argv.lines === 'boolean') {
      if (argv.pipe) {
        withPipe(argv.file, argv.characters, argv.words, argv.lines);
      } else {
        withoutPipe(argv.file, argv.characters, argv.words, argv.lines);
      }
    }
  },
});

/**
 * Process arguments passed from command line to application.
 */
yargs.parse();
