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
