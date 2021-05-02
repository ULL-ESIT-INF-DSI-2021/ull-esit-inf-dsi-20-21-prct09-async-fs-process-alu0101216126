**Autor: Daniel Álvarez Medina (alu0101216126@ull.edu.es)**

# Informe práctica 9
## Sistema de ficheros y creación de procesos en Node.js

### 1. Introducción

En esta práctica se plantean una serie de ejercicios o retos a resolver haciendo uso de las APIs proporcionadas por Node.js para interactuar con el sistema de ficheros, así como para crear procesos.

### 2. Objetivos

La realización de esta práctica tiene como objetivo aprender:

- El uso de la API asíncrona de Node.js.
- El uso de la API de callbacks de Node.js

### 3. Tareas previas

Antes de comenzar a realizar los ejercicios, deberíamos realizar las siguientes tareas:

- Aceptar la [asignación de GitHub Classroom](https://classroom.github.com/a/CdDhsA9I) asociada a esta práctica.
- Familiarícese con el API de callbacks proporcionada por Node.js para interactuar con el sistema de ficheros.
- Familiarícese con el API asíncrona proporcionada por Node.js para crear procesos y, en concreto, con la función spawn.

### 4. Ejercicios

Todos el código fuente de los ejercicios realizados a continuación, deben estar alojados en ficheros independientes, cuyo nombre  será `ejercicio-n`. Utilizaremos la [estructura básica del proyecto vista en clase](https://ull-esit-inf-dsi-2021.github.io/typescript-theory/typescript-project-setup.html), por lo que incluiremos todos los ejercicios en el directorio `./src` de dicho proyecto.

Para la documentación usaremos **TypeDoc** ([Instrucciones](https://drive.google.com/file/d/19LLLCuWg7u0TjjKz9q8ZhOXgbrKtPUme/view)) 

### 4.1. Ejercicio 1

**Enunciado**

Realice una traza de ejecución de este programa mostrando, paso a paso, el contenido de la pila de llamadas, el registro de eventos de la API y la cola de manejadores de Node.js, además de lo que se muestra por la consola. Para ello, simule que se llevan a cabo, como mínimo, dos modificaciones del fichero helloworld.txt a lo largo de la ejecución del programa anterior. ¿Qué hace la función access? ¿Para qué sirve el objeto constants?

**Traza**

A continuación realizaremos una traza de ejecución del código anterior teniendo en cuenta `Call Stack, Node.js API, Callback Queue, Console`.

1. Lo que sucede primero es que se carga en la **Call Stack** la llamada a la función principal **main**, ya que javascript engloba todo el contenido del fichero en dicha función.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `main()` | - | - | - |

2. Añadimos el método asíncrono `access()` a **Node.js API**.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `main()` | `access()` | - | - |

3. Se acaba la ejecución síncrona de main, por lo que en la siguiente iteración se harán llamadas al **Callback Queue** dado que no existe contenido en la **Call Stack**, si no, se ejecutarían las llamadas de esta última por prioridad.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| - | - | `access()` | - |

4. Entonces `access()` pasa a la pila de llamadas como **anonymousAccess**.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `anonymousAccess()` | - | - | - |

5. **Si la ruta está bien**, metemos el `console.log()` en la pila de llamadas.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `console.log(Starting…)` | - | - | - |
|  `anonymousAccess()` | - | - | - |

6. Seguidamente, mostramos el contenido del `console.log()` por consola.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `anonymousAccess()` | - | - | Starting… |

7. Ponemos el método asíncrono `watch()` en el **Node.js API**. Como este no contiene ningún callback, no irá a la Callback Queue

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `anonymousAccess()` | `watch`| - | Starting… |

8. Luego, colocamos el método asíncrono EvenEmitter `watcher.on(‘change’, () =>...)` en el **Node.js API**.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `anonymousAccess()` | `watcher.on(‘change’, () =>...)`| - | Starting… |

9. Seguidamente, metemos el `console.log()` en la **Call Stack**. 

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `console.log(‘File … watched’)` | `watcher.on(‘change’, () =>...)` | - | Starting… |
| `anonymousAccess()` | - | - | - |

10. Mostramos el contenido del `console.log()` por consola.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `anonymousAccess()` | `watcher.on(‘change’, () =>...)` | - | Starting… |
| - | - | - | File … watched |

11. Se termina la función anónima.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| - | `watcher.on(‘change’, () =>...)` | `() => {...})` | Starting… |
| - | - | - | File … watched |

12. Se invoca a la función anónima de la **Callback Queue** ya que no hay contenido en la **Call Stack**.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `anonymousWacherOn()` | `watcher.on(‘change’, () =>...)` | - | Starting… |
| - | - | - | File … watched |

13. Metemos el `console.log()` en la pila de llamadas. 

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `console.log(‘File … somehow’)` | `watcher.on(‘change’, () =>...)` | - | Starting… |
| `anonymousWacherOn()` | - | - | File … watched |

14. Mostramos el contenido del `console.log()` por consola.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `anonymousWacherOn()` | `watcher.on(‘change’, () =>...)` | - | Starting… |
| - | - | - | File … watched |
| - | - | - | File … somehow |

15. Se termina la función anónima.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| - | `watcher.on(‘change’, () =>...)` |`() => {...})` | Starting… |
| - | - | - | File … watched |
| - | - | - | File … somehow |

16. Se invoca a la función anónima de la **Callback Queue**.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `anonymousWacherOn()` | `watcher.on(‘change’, () =>...)` | - | Starting… |
| - | - | - | File … watched |
| - | - | - | File … somehow |

17. Metemos el `console.log()` en la pila de llamadas. 

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `console.log(‘File … somehow’)` | `watcher.on(‘change’, () =>...)` | - | Starting… |
| `anonymousWacherOn()` | - | - | File … watched |
| - | - | - | File … somehow |

18. Mostramos el contenido del `console.log()` por consola.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| `anonymousWacherOn()` | `watcher.on(‘change’, () =>...)` | - | Starting… |
| - | - | - | File … watched |
| - | - | - | File … somehow |
| - | - | - | File … somehow |

19. Se termina la función anónima. Acaba el programa.

| Call Stack | Node.js API | Callback Queue | Console |
| -- | -- | -- | -- |
| - | `watcher.on(‘change’, () =>...)` |  `() => {...})`  | Starting… |
| - | - | - | File … watched |
| - | - | - | File … somehow |
| - | - | - | File … somehow |

**Preguntas:**

¿Qué hace la función `access`?

**fs.access:**: Función asíncrona que comprueba los permisos que tiene el usuario que intenta ejecutar el programa, con respecto al fichero que aporta en la ejecución. Si tiene los permisos suficiente, la función procede a seguir.

¿Para qué sirve el objeto `constants`?

**fs.constants:** Contiene todo los valores (flags) para fs.access. Es decir, fs.access debe recibir una de estas constantes, ya que según lo recibido se comprueba el permiso en específico del usuario. En este caso usa 'F_OK' para comprobar si el usuario puede ver el fichero. Otras flags que tiene son R_OK, W_OK, X_OK, que comprueban permisos de Lectura, Escritura y Ejecución respectivamente.

### 4.2 Ejercicio 2

**Enunciado:**

Escriba una aplicación que proporcione información sobre el número de líneas, palabras o caracteres que contiene un fichero de texto. La ruta donde se encuentra el fichero debe ser un parámetro pasado a la aplicación desde la línea de comandos. Adicionalmente, también deberá indicarle al programa desde la línea de comandos si desea visualizar el número de líneas, palabras, caracteres o combinaciones de ellas. Puede gestionar el paso de parámetros desde la línea de comandos haciendo uso de yargs.

Lleve a cabo el ejercicio anterior de dos maneras diferentes:

- Haciendo uso del método pipe de un Stream para poder redirigir la salida de un comando hacia otro.
- Sin hacer uso del método pipe, solamente creando los subprocesos necesarios y registrando manejadores a aquellos eventos necesarios para implementar la funcionalidad solicitada.

Para lo anterior, se recomienda leer la documentación de Stream. Piense que la propiedad stdin de un objeto ChildProcess es un Stream de escritura, mientras que su propiedad stdout es un Stream de lectura.

Por último, programe defensivamente, es decir, trate de controlar los potenciales errores que podrían surgir a la hora de ejecutar su programa. Por ejemplo, ¿qué sucede si indica desde la línea de comandos un fichero que no existe o una opción no válida?

**Código**

```ts
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
```

Se nos pide realizar el mismo ejercicio tanto con el uso de pipe, como sin él, es por ello que entre los argumentos del yarg indicaremos cuál queremos usar. El comando se llama show, y los argumentos son los siguientes:

- file:  Tipo string. Se indica la ruta del fichero.
- pipe: Tipo bool.  Se indica si se va a trabajar con pipe o no.
- lines: Tipo bool. Se indica si se quiere la cantidad de líneas o no.
- words: Tipo bool. Se indica si se quiere la cantidad de palabras o no.
- characters: Tipo bool. Se indica si se quiere la cantidad de caracteres o no.

Si **pipe** es true, se invoca al método `withPipe()` con los argumentos correspondientes, sino, se invoca a `withoutPipe()`

`withPipe()`

Argumentos:

- path:  Tipo string. Se indica la ruta del fichero.
- lines: Tipo bool. Se indica si se quiere la cantidad de líneas o no.
- words: Tipo bool. Se indica si se quiere la cantidad de palabras o no.
- characters: Tipo bool. Se indica si se quiere la cantidad de caracteres o no.

Primeramente generamos un nuevo proceso para el comando **wc**, mediante la función asíncrona **spawn**, a su vez le pasamos un argumento que corresponde con la ruta del fichero. De esta manera realizaremos el comando `wc ‘path’`, y lo almacenamos en la variable **wc**, que es de tipo `childProcess`.

A continuación a dicha variable le aplicaremos la propiedad de lectura `stdout`, esta es un objeto de tipo `Stream`, de esta manera obtendremos la salida del comando en nuestra variable `wcOutupt`. Posteriormente, separamos dicha variable por espacios gracias a la función `split()`, así obtendremos cada valor de la variable wcOutput en una posición del array, este array se llamará `wcOutputArray`.

Finalmente, mostraremos la cantidad de líneas, palabras o caracteres del fichero, según se haya especificado en los parámetros recibidos. Esto lo conseguiremos ejecutando el comando **echo** mediante **spawn**, y redirigiendo la salida de dicho comando a la salida de la terminal, mediante la propiedad de lectura `stdout`y el método **pipe**, como argumento a pipe a que indicarle donde se va a mostrar la salida, por ello ponemos ``process.stdout``, para que nos lo muestre por la terminal actual.

`withoutPipe()`

Argumentos:

- path:  Tipo string. Se indica la ruta del fichero.
- lines: Tipo bool. Se indica si se quiere la cantidad de líneas o no.
- words: Tipo bool. Se indica si se quiere la cantidad de palabras o no.
- characters: Tipo bool. Se indica si se quiere la cantidad de caracteres o no.

Primeramente generamos un nuevo proceso para el comando **wc**, mediante la función asíncrona **spawn**, a su vez le pasamos un argumento que corresponde con la ruta del fichero. De esta manera realizaremos el comando `wc ‘path’`, y lo almacenamos en la variable **wc**, que es de tipo `childProcess`.

A continuación a dicha variable le aplicaremos la propiedad de lectura `stdout`, esta es un objeto de tipo `Stream`, de esta manera obtendremos la salida del comando en nuestra variable `wcOutupt`. Posteriormente, separamos dicha variable por espacios gracias a la función `split()`, así obtendremos cada valor de la variable wcOutput en una posición del array, este array se llamará `wcOutputArray`.

Finalmente, mostraremos la cantidad de líneas, palabras o caracteres del fichero, según se haya especificado en los parámetros recibidos. Como esta vez no podemos usar **pipe** para redirigir la salida, simplemente guardamos las salidas en la string `final`, y al final del método realizamos un `console.log()` de dicha string.

### 4.3 Ejercicio 3

**Enunciado:**

A partir de la aplicación de procesamiento de notas desarrollada en la Práctica 8, desarrolle una aplicación que reciba desde la línea de comandos el nombre de un usuario de la aplicación de notas, así como la ruta donde se almacenan las notas de dicho usuario. Puede gestionar el paso de parámetros desde la línea de comandos haciendo uso de yargs. La aplicación a desarrollar deberá controlar los cambios realizados sobre todo el directorio especificado al mismo tiempo que dicho usuario interactúa con la aplicación de procesamiento de notas. Nótese que no hace falta modificar absolutamente nada en la aplicación de procesamiento de notas. Es una aplicación que se va a utilizar para provocar cambios en el sistema de ficheros.

Para ello, utilice la función watch y no la función watchFile, dado que esta última es más ineficiente que la primera. La función watch devuelve un objeto Watcher, que también es un objeto EventEmitter. ¿Qué evento emite el objeto Watcher cuando se crea un nuevo fichero en el directorio observado? ¿Y cuando se elimina un fichero existente? ¿Y cuando se modifica?

Con cada cambio detectado en el directorio observado, el programa deberá indicar si se ha añadido, modificado o borrado una nota, además de indicar el nombre concreto del fichero creado, modificado o eliminado para alojar dicha nota.

Programe defensivamente, es decir, trate de controlar los potenciales errores que podrían surgir a la hora de ejecutar su aplicación.

Por último, trate de contestar a las siguientes preguntas:

- ¿Cómo haría para mostrar, no solo el nombre, sino también el contenido del fichero, en el caso de que haya sido creado o modificado?
- ¿Cómo haría para que no solo se observase el directorio de un único usuario sino todos los directorios correspondientes a los diferentes usuarios de la aplicación de notas?

**Código**

```ts
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
```

Para saber que notas de qué usuario debemos observar, mediante la herramienta **yargs**, debemos de crear el comando **watch**, cuyo argumento sea el usuario a observar. **watch** observará los cambios que se lleven a cabo en las notas de dicho usuario.

Para ello mediante la función asíncrona `readdir()`, especificamos la ruta con el usuario que se nos indicó, si el usuario es incorrecto, pues en el `callback` se mostrará un error de que dicho usuario es inválido. Si el usuario es correcto, procederemos a obtener la cantidad de elementos que hay en la carpeta, y lo guardamos en `prevSize`, esto nos servirá para saber cuando se añade un fichero.

Ahora mediante la función asíncrona `access()` comprobamos si el usuario tiene los permisos necesarios para acceder a la carpeta, si el usuario no tiene los permisos, pues en el `callback` se mostrará un error de que dicho usuario no puede acceder. Si no, ya podremos comenzar a observar los cambios en el directorio mediante la función asíncrona `watch()`.

En dicha función indicamos la ruta a observar y un callback. Lo que haremos en dicho callback primeramente, es obtener de nuevo la cantidad de elementos de la carpeta y lo guardamos en `actualSize`, de esta manera, si prevSize es menor que actualSize, es que se añadió un elemento. Por otra parte, si el evento a realizar se llama `change`, es que se modificó un fichero, y si es `rename`, es que se eliminó un fichero. De esta manera podemos saber qué mensaje mostrar según la acción que se realize.

Finalmente, después de esta serie de condiciones, volvemos a igualar los tamaños de prevSize y actualSize para la siguiente iteración. La función asíncrona `setTimeOut()` en este caso simplemente la usamos para que no se muestren mensajes duplicados.

Respecto a las preguntas:

- ¿Cómo haría para mostrar, no solo el nombre, sino también el contenido del fichero, en el caso de que haya sido creado o modificado?

Para crear el fichero o modificarlo, pues emplearía una función asíncrona denominada `readFile`, esta función lee todo el contenido de un fichero, y dicho contenido se mostraría por consola.

- ¿Cómo haría para que no solo se observase el directorio de un único usuario sino todos los directorios correspondientes a los diferentes usuarios de la aplicación de notas?

Lo que se debería de hacer primeramente, sería que en vez de pasarle la ruta `./database/user`, se le pasaría solo `./database`, es decir, el directorio que contiene todos los directorios de los distintos usuarios con sus notas. Una vez realizado esto, se debería incluir `{recursive: true}` como argumento de la función `watch`, con esto indicamos que también se deben observar todos los directorios que contiene el propio directorio `./database`.

### 4.4 Ejercicio 4

**Enunciado**

Desarrolle una aplicación que permita hacer de wrapper de los distintos comandos empleados en Linux para el manejo de ficheros y directorios. En concreto, la aplicación deberá permitir:

1. Dada una ruta concreta, mostrar si es un directorio o un fichero.
2. Crear un nuevo directorio a partir de una nueva ruta que recibe como parámetro.
3. Listar los ficheros dentro de un directorio.
4. Mostrar el contenido de un fichero (similar a ejecutar el comando cat).
5. Borrar ficheros y directorios.
6. Mover y copiar ficheros y/o directorios de una ruta a otra. Para este caso, la aplicación recibirá una ruta origen y una ruta destino. En caso de que la ruta origen represente un directorio, se debe copiar dicho directorio y todo su contenido a la ruta destino.
Para interactuar con la aplicación a través de la línea de comandos, puede hacer uso de yargs.

Programe defensivamente, esto es, trate de controlar todos los potenciales errores que podrían surgir a la hora de ejecutar su programa.

**Código**

```ts
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


```

Para este ejercicio, hemos realizado un comando con yargs para cada caso, explicaremos cada comando y su implementación:

- **type**: Comprueba que la ruta recibida es un fichero o un directorio. Como argumento recibe una ruta.

Con la función asíncrona `stat`, comprobamos si la ruta existe, posteriormente, mediante las funciones asíncronas de stats `isFile()` o `isDirectory`, sabremos indicar al usuario si la ruta es un directorio o un fichero.

- **mkdir**: Nos crea un directorio. Como argumento recibe una ruta.

Con la función asíncrona `mkdir`, creamos un directorio en la ruta recibida como parámetro, si la ruta es inválida, aparecerá un error.

- **list**: Muestra el contenido de una carpeta. Como argumento recibe una ruta.

Con la función asíncrona `readdir`, mostramos elemento a elemento, todos los contenidos del directorio mediante un console.log, si la ruta es inválida, aparecerá un error.

- **cat**: Muestra el contenido de un fichero. Como argumento recibe una ruta.

Con la función asíncrona `readFile`, mostramos el contenido del fichero mediante un console.log de la ruta dada, si la ruta es inválida, aparecerá un error.

- **rm**: Elimina ficheros o directorios. Como argumento recibe una ruta.

Primeramente con la función `lstat`, comprobamos que la ruta existe, si es inválida aparecerá un error.

A continuación, si la ruta es un fichero (`isFile()`), eliminamos el fichero mediante la función asíncrona `rm`, sin espicificar una búsqueda recursiva, si no se puede borrar el fichero, aparecerá un mensaje de error.

Sin embargo, si la ruta es un fichero (`isDirectory()`), eliminamos el directorio mediante la función asíncrona `rm`, especificando una búsqueda recursiva, de esta manera indicamos que borre todo lo que se encuentre dentro de dicho directorio, si no se puede borrar el directorio, aparecerá un mensaje de error.

- **cp**: Copia un fichero o directorio a la ruta especificada. Como argumento recibe la ruta de donde se copia, y la ruta destino.

Primeramente con la función `lstat`, comprobamos que la ruta de donde vamos a copiar existe, si es inválida aparecerá un error.

Después con la misma función, comprobamos que la ruta destino existe, si es inválida aparecerá un error.

Finalmente con el la función asíncrona **spawn**, especificamos el comando `cp` de linux, junto con las dos rutas como argumento, y realizará la operación.

### 5. Conclusión

En lo referente a la conclusión de la práctica, puedo destacar en primer lugar, que he podido comprender el uso de la pila de llamadas y de esta manera entender como funciona la ejecución en JavaScript. A su vez la API de callbacks de Node.js, nos permite realizar una gran variedad de acciones para el manejo de ficheros, o para realizar ciertas acciones en determinados momentos. También la API asíncrona de Node.js, contiene una gran variedad de métodos que también nos sirven para el manejo de fichero, pero por ejemplo, con métodos como spawn, podremos realizar comandos de la terminal de linux, dentro de nuestro propio código, por lo que es un método muy importante.

Finalmente, comentar que ya había trabajado con el manejo de ficheros en otros lenguajes, pero en TS, me resultó más cómo debido a las herramientas que dispone. 

Todas estas herramientas las considero muy útiles y necesarias, ya que si realizamos algún proyecto de BackEnd, el uso de estas herramientas que vimos en esta práctica, serán fundamentales. 

### 6. Bibliografía
* [Documentación del API de callbacks de Node.js](https://nodejs.org/dist/latest/docs/api/fs.html#fs_callback_api)
* [Documentación del API asíncrona de Node.js](https://nodejs.org/dist/latest/docs/api/child_process.html#child_process_asynchronous_process_creation)
* [Documentación de Stream](https://nodejs.org/api/stream.html)
* [Documentación del paquete yargs](https://www.npmjs.com/package/yargs)
