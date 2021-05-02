import * as fs from 'fs';
import * as yargs from 'yargs';

/**
 * Yargs execution of the watch command. The corresponding command line options must be included.
 */
yargs.command({
  command: 'watch',
  describe: 'Control user\'s changes',
  builder: {
    user: {
      describe: 'User to watch',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      let prevSize: number = 0;
      let actualSize: number = 0;
      fs.readdir('./database/' + argv.user, (err, files) => {
        if (err) console.log('Path doesn\'t exist'); // error handling
        prevSize = files.length;
      });

      fs.access('./database/' + argv.user, fs.constants.F_OK, (err) => {
        let wait: boolean = false;

        // error handling
        if (err) console.log(argv.user + ' can\'t access');

        else {
          fs.watch('./database/' + argv.user, (eventType, filename) => {
            if (wait) return;
            wait = true;
            fs.readdir('./database/' + argv.user, (err, files) => {
              if (err) console.log('Unexpected error'); // error handling
              actualSize = files.length;

              if (prevSize < actualSize) console.log(`File ${filename} has been added\n`);
              else if (eventType === 'change') console.log(`File ${filename} has been modified\n`);
              else if (eventType === 'rename') console.log(`File ${filename} has been deleted\n`);

              prevSize = actualSize;
              setTimeout(() => {
                wait = false;
              }, 100);
            });
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
