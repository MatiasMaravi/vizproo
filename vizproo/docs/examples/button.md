# Botón básico

Muestra cómo crear un botón interactivo con la librería y reaccionar a clics desde Python.

## Descripción

Este ejemplo crea un botón con una etiqueta y registra un callback para manejar el evento de clic. El estado del botón se sincroniza automáticamente con el frontend.

## Código de ejemplo

```python
# Ejemplo mínimo de uso del botón
from vizproo.widgets import Button
button = Button(
    description="Click me",
    disabled=False
)

i = 0
def click(values):
    global i
    print(i) #Check logs
    i += 1
    
button.on_click(click)
button
```

## Resultado

El botón aparece en la salida del notebook y al hacer clic se ejecuta el callback en Python.

![Resultado del botón](ruta/a/tu/imagen/button_example.png)
