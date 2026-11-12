---
tags: [pyadra, strategy, proposal]
created: 2026-11-12
status: open proposal
branch: rethink/studio
---

# Studio Rethink — una segunda opinión (12 de noviembre de 2026)

> [!warning] Propuesta abierta, no decisión del dueño
> Todo lo que hay aquí y en la rama `rethink/studio` es una propuesta (Company_Master §0: **Open proposal**). Los precios, los plazos y las promesas de la oferta los propuso Claude para hacer la idea concreta. Nadie los ha aprobado. No se fusiona a `main` sin que Eduardo y Cristian confirmen o cambien cada cifra.

## La contradicción, en una frase

Pyadra lleva un año puliendo la vitrina de nueve proyectos que casi nadie quiere comprar, cuando lo único que ha demostrado de forma repetida, y lo que sí tiene mercado, es **la capacidad de construirlos**.

## Lo que dicen los datos del propio repositorio

1. **El inventario completo vale poco más que un cliente.** Sumando la entrada más baja de cada proyecto en venta en `rooms.ts` (siete, sin contar Orbit 77, que recibe apoyo y no se vende), venderlos todos deja alrededor de $10.500, una sola vez. Un solo encargo de construcción al precio propuesto (A$6.900) es dos tercios de eso, y se puede repetir cada mes.
2. **Un proyecto sin ingresos no tiene comprador natural.** Quien compra un negocio paga por flujo de caja. Casi ninguno lo tiene; el código y la marca, que es lo que se transfiere, son hoy lo más barato de producir. La excepción es Kangaroo Cleanup, el único con clientes reales y recurrentes, y es justo el que menos se parece a los demás.
3. **El sitio está optimizado para contemplar, no para decidir.** Galaxy ya va por su sexta versión. La órbita, el vuelo entre salas y el telón son trabajo fino, pero un visitante necesita varios pasos para entender qué se vende y a qué precio, y la única acción final es "hablemos".
4. **La puerta que sí es negocio estaba escondida.** "Bring your idea" era un botón pequeño en la navegación que abría un diálogo con lenguaje de museo. La definición de la empresa empieza por "convertir ideas en proyectos reales"; la web mostraba solo la segunda mitad (buscar quién los compre).
5. **Mucho proceso para la etapa en la que está.** Etiquetas de evidencia, copy deck, estándar de proyecto, auditorías mensuales: es el gobierno de una empresa que ya tiene clientes que cuidar. Construir y documentar es la zona cómoda; lo que falta no es otra versión, es hablar con compradores.

## La propuesta

**Pyadra es un estudio: tú traes la idea, nosotros la construimos, precio fijo y fecha.** Los proyectos propios dejan de ser inventario y pasan a ser la prueba de que el equipo entrega. Siguen en venta, exactamente donde estaban.

| | Antes | En esta rama |
|---|---|---|
| Qué se vende | Proyectos terminados | La construcción del proyecto del cliente |
| Quién compra | Alguien que quiera operar una idea ajena | Alguien con idea propia y sin equipo técnico |
| Precio | Tras una conversación | En la página |
| Home | Símbolo + "Join" | La oferta, el calendario, la prueba, los precios |
| Los nueve proyectos | El producto | La evidencia (y siguen disponibles) |
| Acción | Explorar | Enviar la idea en un párrafo (`/start`) |

## Qué cambió en el código

- `/` es la nueva Home del estudio. La anterior vive intacta en `/museum`.
- `/start` es el brief: la idea, en qué punto está, qué paso quiere dar. Llega a `pyadra@pyadra.io` por `/api/contact` (tipo `studio-brief`).
- `src/app/studio/offer.ts` es el único lugar de la oferta: planes, precios, plazos, pasos, límites y preguntas.
- "Bring your idea" en la navegación ahora lleva a `/start` en todas las páginas.
- Galaxy, los dashboards, `/store`, `/team` y `/manifesto` no se tocaron.

Para descartarlo todo: `git checkout feat/galaxy-orbit-instrument && git branch -D rethink/studio`.

## Lo que hay que decidir antes de publicarlo

1. **Los precios y plazos** (`offer.ts`): Prototype A$1.900 en 7 días, Launch A$6.900 en 30 días, Care A$490 al mes. ¿Pueden cumplirlos con otro trabajo de por medio?
2. **La respuesta en dos días hábiles.** Es una promesa; alguien tiene que ser dueño de ese buzón.
3. **"No tomamos participación."** Contradice el modelo de regalías de los proyectos de Cristian. La propuesta es deliberada: cobrar en efectivo primero.
4. **El tagline** `Discover. Connect. Build. Buy.` ya no aparece en la Home; sigue en `/museum`.

## Cómo saber si funciona (30 días, sin tocar más código)

La web no vende sola. La hipótesis se prueba así:

- **20 conversaciones** con personas que tengan una idea o un negocio pequeño y no sepan construir: dueños de negocios locales en Australia, y fundadores no técnicos en San Francisco.
- **Meta: 2 prototipos pagados.** Si después de 20 conversaciones reales nadie paga A$1.900, la oferta o el público están mal, y eso también es un resultado.
- **Los videos que ya hacen cambian de tema:** de "mira nuestro proyecto" a "de una idea a un producto funcionando en 7 días", grabando una construcción real.
- **Congelar proyectos nuevos** durante la prueba. Cada proyecto nuevo ha sido una forma de no vender el anterior.
- **Kangaroo Cleanup** se ofrece donde se venden negocios locales, no solo en pyadra.io. Es el activo más vendible que tienen.

## Copy deck

Las cadenas visibles viven en `src/app/studio/offer.ts` (planes, pasos, límites, preguntas) y son la fuente. Las de la página:

- Etiqueta: `Pyadra · Product studio`
- Titular: `Your idea, live and taking payments in 30 days.`
- Texto: `We are a small team that has taken {n} ideas from a sentence to a working product. Now we do it for yours. One fixed price, agreed before we start, and everything we build is yours.` ({n} sale de `lots.ts`)
- Botones: `Tell us your idea` · `See what we have built`
- Nota: `Free to ask. We answer within two working days.`
- Secciones: `We built these for ourselves first.` · `Four steps, and you can see every one.` · `The price is on the page.` · `What we will not do.` · `Asked before the first call.` · `One paragraph is enough to start.`
- `/start`: `Tell us what you want to exist.` · `Send it to us` · confirmación `We have it.`
