# StarCoordinates

Todos los ejemplos usan el dataset de Iris proporcionado por la libería Seaborn.

![image](../images/starcoordinates.PNG)

```python
from vizproo import StarCoordinates
plot1 = StarCoordinates(data=iris, dimensions=['sepal_length','sepal_width','petal_width','petal_length'], hue='species')
plot1
```