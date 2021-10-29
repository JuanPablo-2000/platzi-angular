const { resolve } = require('path/posix');
const { Observable } = require('rxjs');
const { filter } = require('rxjs/operators');

const doSomething = () => {
  return new Promise((resolve) => {
    resolve('valor 1');
    resolve('valor 2');
    setTimeout(() => {
      resolve('valor 3');
    }, 3000)
  });
}

const doSomething$ = () => {
  return new Observable(observable => {
    observable.next('valor 1 $');
    observable.next('valor 2 $');
    observable.next('valor 3 $');
    observable.next(null);
    setTimeout(() => {
      observable.next('valor 4 $');
    }, 5000)
    setTimeout(() => {
      observable.next(null);
    }, 8000)
    setTimeout(() => {
      observable.next('valor 5 $');
    }, 10000)
  });
}

(async () => {
  const rta = await doSomething();
  console.log(rta);
})();

(() => {
  const obs$ = doSomething$();
  obs$
  .pipe(
    filter(value => value !== null)
  )
  .subscribe(rta => {
    console.log(rta);
  })
})();


/**
 * Ventajas que me ofrece el observador.
 * Puedo emitir varios valores, comunicando desde el observable
 * por medio de un string varios tipos de datos
 *
 * Con la promesa no podemos hacer esto, ya que, una vez
 * resuelto el valor no obtendriamos por ejemplo el valor 2
 * y esto es por que ya fue resuelta la promesa anterior,
 * una promesa solo ejecuta lo que tiene que ejecutar y retorna y ya
 * pero no es un string constate de datos
 *
 * Así que lo principal que nos deja hacer un observador es poder emitir
 * varios valores y angular va a utilizar esta estrategia en muchos campos
 * , en formularios reactivos, en peticiones, escuchar eventos dinamicos
 *
 * tambien con los observables podemos aplicar ciertas transformaciones o pipes
 * y con esto podemos hacer procesos para poder operar los datos a medida que se van
 * transmitiendo
 *
 * Promesa
 *  - Emite un solo valor
 *  - Simplificidad
 *
 * Observable
 *  - Stream de datos (puede emitir múltiples valores).
 *  - Es posible escuchar constantemente: eventos, resposive, fetchs.
 *  - Se puede cancelar.
 */
