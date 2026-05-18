# CSS

## Selectores

- Selector por tipo: `a` selecciona todos los elementos del tipo `<a>`.

- Selector por id: `#miId` selecciona todos los elementos con el atributo `id="miId"`.

- Selector por clase: `.miClase` selecciona todos los elementos con el atributo `class="miClase"`.

- Selector universal: Selecciona todos los elementos con `*`.

- Selector por descendencia: `A B` selecciona todos los elementos de `B` que se encuentran dentro de `A`.

- Selector múltiple (por comas): `A, B` selecciona todos los elementos de `A` y `B`.

- Selector por hermanos adyacentes: `A + B` selecciona _sólo_ los elementos de `B` que van después de `A`.

- Selector general por hermanos: `A ~ B` Selecciona todos los elementos de `B` que van después de `A`

- Selector por hijos: `A > B` selecciona todos los `B` que son hijos directos de `A`.
  
### Pseudoclases

- `:hover`: Se activa el selector al pasar el mouse encima del elemento.

- `:focus`: Se activa el selector al hacer click o presionar con un táctil encima del elemento.
  
- `:active`: Se activa el selector mientras que se está interactuando con el elemento. Si se va a utilizar junto con `:hover`, este debe después.

- `:visited`: Se activa el selector cuando ya se visitó un determinado enlace con la etiqueta `<a>...<\a>`.

## Propiedades

### Estilos de texto

- `color`: Cambia el color del texto.

- `font-family`: Cambia la fuente del texto.

- `font-size`: Cambia el tamaño del texto.

- `font-weight`: Cambia el grosor del texto.

- `font-style`: Cambia el estilo del texto (cursiva)

- `line-height`: Define el espaciado entre párrafos con unidades de medida.

- `text-align`: Define la alineación del texto (izquierda, derecha, justificado, centrado)

- `text-decoration`: Estiliza el texto con subrayados de diferentes tipos. La opcion `none` quita todos los estilos.

- `text-transform`: Cambia el texto a mayúscula, minúscula u otros.
  
### Estilos de listas

- `list-style-type`: Cambia el tipo de punteo de una lista, `none` para desactivarlo.

- `list-style-position`: Cambia la posición del contenido de una lista aumentando o disminuyendo la tabulación con `inside` y `outside`.

### Dimensiones

- `width`: Define el ancho de un elemento.

- `height`: Define el alto de un elemento.

- `max-width`: De no utilizar `width`, este define el ancho máximo de un elemento.

- `min-width`: De no utilizar `width`, este define el alto mínimo de un elemento.

- `min-height`: De no utilizar `height`, este define el ancho máximo de un elemento.

- `min-height`: De no utilizar `height`, este define el alto mínimo de un elemento.

## Flexbox

- `justify-content`: Alinea elementos horizontalmente.

  - `flex-start` Alinea elementos al lado izquierdo del contenedor.

  - `flex-end`: Alinea elementos al lado derecho del contenedor.

  - `center`: Alinea elementos en el centro del contenedor.

  - `space-between`: Alinea elementos en el mismo contenedor para que tengan la misma distancia entre ellos.

  - `space-around`: Alinea elementos en el mismo contenedor para que tengan la misma separación entre ellos.


- `gap`: Realiza una separación de X unidades de medida entre elementos.


- `align-items`: Alinea elementos verticalmente.


- `order`: Se utiliza para modificar el orden inicial de los elementos: Para esto se utilizan números del conjunto de los enteros (-2; -1; 0; 1; 2; …).


- `align-self`: Es cómo align-items solo que para un elemento en específico.


- `flex-direction`: Define la dirección de los elementos dentro del contenedor.


  - `row`: Los elementos son colocados en la misma dirección del texto.


  - `row-reverse`: Los elementos son colocados en la dirección opuesta al texto.


  - `column`: Los elementos se colocan de arriba hacia abajo.


  - `column-reverse`: Los elementos se colocan de abajo hacia arriba.


- `flex-wrap`:Define cómo se ajustan los elementos en las líneas.

  - `nowrap`: Cada elemento se ajusta en una sola línea.

  - `wrap`: los elementos se envuelven alrededor de líneas adicionales.

  - `wrap-reverse`: Los elementos se envuelven alrededor de líneas adicionales en reversa.

- `flex-flow`: Funciona como combinación de flex-direction y flex-wrap. Ejemplo: `flex-flow: column wrap;`


- `align-content`: Determina cómo están alineadas las líneas o columnas de un contenedor y si necesita haber usado `flex-wrap` anteriormente para que funcione.


### Atributos generales utilizados total o parcialmente por align-content, align-items, align-self.


`flex-start`: Las líneas se posicionan en la parte superior del contenedor.


`flex-end`: Las líneas se posicionan en la parte inferior del contenedor.


`center`: Las líneas se posicionan en el centro (verticalmente hablando) del contenedor.


`space-between`: Las líneas se muestran con la misma distancia entre ellas.


`space-around`: Las líneas se muestran con la misma separación alrededor de ellas.


`stretch`: Las líneas se estiran para ajustarse al contenedor.


## Box Model

- `padding: X;`: Da espacio interno de X unidades de medida.

- `margin: X;`: Da espacio interno de X unidades de medida.

- `border-radius: X;`: Redondea las esquinas en base a X unidades de medida.

- `border: X <tipo> <color>;`: Agrega borde de X unidades de medida.

- `box-sizing`: Define el ancho total y largo total de un elemento.

  - `content-box;`: Este es el valor inicial y por defecto. El ancho y el largo no incluyen el border ni el padding.

  - `border-box`: El ancho y el largo incluyen el border y el padding. Las dimensiones del elemeno se calculan como: ancho = border + padding + ancho del contenido, y altura = border + padding + altura del contenido.

## Unidades Absolutas y Relativas

### Absolutas 
Estas se usan cuando se sabe exactamente cuanto espacio en pantalla quiere tomar un elemento
 
- `px`: Nombre: Píxeles. Es la unidad básica, el número refiere a la cantidad de píxeles que toma.

- `cm`: Nombre:Centímetros. Equivale a: 1cm = 96px/2,54

- `mm`: Nombre: Milímetros. Equivale a: 1mm = 1/10 de 1cm

- `Q`: Nombre: Cuarto de milímetros. Equivale a: 1Q = 1/40 de 1cm
 
- `in`: Nombre: Pulgadas.  Equivale a: 1in=2,54cm = 96px


### Relativas
Estas se usan cuando se sabe aproximadamente cuanto espacio debe tomar algo en pantalla, pero se quiere que tenga adaptabilidad para distintas configuraciones del navegador utilizado por el usuario final. (por ejemplo rem varía dependiendo de la dimensión base de tu navegador, que es 16px por defecto)

- `em`: Tamaño de letra del elemento padre, en el caso de propiedades tipográficas como font-size, y tamaño de la fuente del propio elemento en el caso de otras propiedades, como width.

- `rem`: Tamaño de la letra del elemento raíz. (html)

- `vw`: Porcentaje del ancho de la ventana gráfica observable.

- `vh`: Porcentaje del alto de la ventana gráfica observable.