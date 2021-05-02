/* eslint-disable no-unused-vars */
/* eslint-disable brace-style */
import * as fs from 'fs';
import * as yargs from 'yargs';
import {spawn} from 'child_process';

/**
 * Yargs execution of the type command. The corresponding command line options must be included
 */
yargs.command({
  command: 'type',
  describe: 'Check if the received path is a directory or a file',
  builder: {
    path: {
      describe: 'path of the file or directory',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      fs.stat(argv.path, (err, stats) => {
        if (!err) {
          if (stats.isFile()) console.log(argv.path + ' is a file');
          else if (stats.isDirectory()) console.log(argv.path + ' is a directroy');
        }
        else console.log(argv.path + '\'s path doesn\'t exist');
      });
    }
  },
});

/**
 * Yargs execution of the mkdir command. The corresponding command line options must be included
 */
yargs.command({
  command: 'mkdir',
  describe: 'Add an directory',
  builder: {
    path: {
      describe: 'Directory\'s path',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      fs.mkdir(argv.path, {recursive: true}, (err) => {
        if (err) console.log('Cannot create directory in specified path');
        else console.log('Directory successfully created on: ' + argv.path);
      });
    }
  },
});

/**
 * Yargs execution of the list command. The corresponding command line options must be included
 */
yargs.command({
  command: 'list',
  describe: 'Shows the contents of a directory',
  builder: {
    path: {
      describe: 'Directory\'s path',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      fs.readdir(argv.path, (err, directory) => {
        if (err) console.log(`Directory on ${argv.path} doesn´t exit`);

        else {
          console.log(`List of ${argv.path} elements:`);
          directory.forEach((file) => {console.log(file);});
        }
      });
    }
  },
});

/**
 * Yargs execution of the cat command. The corresponding command line options must be included
 */
yargs.command({
  command: 'cat',
  describe: 'Show the content of a file',
  builder: {
    path: {
      describe: 'File \'s path',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      fs.readFile(argv.path, 'utf-8', (err, data) => {
        if (err) console.log(`Can´t read the file indicated`);
        else console.log(data);
      });
    }
  },
});

/**
 * Yargs execution of the rm command. The corresponding command line options must be included
 */
yargs.command({
  command: 'rm',
  describe: 'Delete a file or directory',
  builder: {
    path: {
      describe: 'path',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.path === 'string') {
      fs.lstat(argv.path, (err, stats) => {
        if (err) console.log(argv.path + '\'s path doesn\'t exist');

        else {
          if (stats.isFile()) {
            fs.rm(`${argv.path}`, (err) => {
              if (err) console.log(`Cannot delete the file`);
              else console.log(`Deleted file on path: ${argv.path}`);
            });
          } else {
            fs.rm(`${argv.path}`, {recursive: true}, (err) => {
              if (err) console.log(`Cannot delete the directory`);
              else console.log(`Deleted directory on path ${argv.path}`);
            });
          }
        }
      });
    }
  },
});

/**
 * Yargs execution of the cp command. The corresponding command line options must be included
 */
yargs.command({
  command: 'cp',
  describe: 'Copy a file or directory',
  builder: {
    oldPath: {
      describe: 'Old path',
      demandOption: true,
      type: 'string',
    },
    newPath: {
      describe: 'Newath',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.oldPath === 'string' && typeof argv.newPath === 'string' ) {
      let path: string = `${argv.newPath}`;
      const pos: number = path.lastIndexOf('/');
      path = path.substr(0, pos);
      fs.lstat(argv.oldPath, (err, stats) => {
        if (err) console.log(argv.oldPath + '\'s path doesn\'t exist');
        else {
          fs.lstat(path, (err, stats) => {
            if (err) console.log(argv.newPath + '\'s path doesn\'t exist');
            else {
              const cp = spawn('cp', ['-r', `${argv.oldPath}`, `${argv.newPath}`]);
              console.log('Elements copied');
            }
          });
        }
      });
    }
  },
});

/**
 * Process arguments passed from command line to application
 */
yargs.parse();
