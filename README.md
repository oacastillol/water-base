# Water-cloud #

Servidor usado para recolectar los mensajes de los diversos sensores, para luego ser enviados a la nube


## Requerimientos ##
  * nodejs
  * npm
  * sqlite3
  
## Ejecución  ##

``` bash
$ cd water-base
water-base$ npm install
water-base$ DEBUG=myapp:* npm start
```
## Rutas ##

http://<ip>:3000/samples?node=4&sensor1=1&sensor2=2.2
 
 donde node es el identificador del dispositivo final y continua con los nombres del sensor y el valor de la medición.
