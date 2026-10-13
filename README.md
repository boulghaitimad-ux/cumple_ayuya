# Una sorpresa para mi Ayuya 🩵

Pequeña web de cumpleaños hecha con Flask, HTML, CSS, JavaScript y Canvas. No usa base de datos ni servicios de pago.

## Ejecutar en Windows

1. Instala Python 3 desde https://www.python.org/downloads/ si aún no lo tienes. Durante la instalación, marca **Add Python to PATH**.
2. Descomprime la carpeta `cumple_ayuya`.
3. Abre PowerShell dentro de esa carpeta.
4. (Recomendado) Crea un entorno virtual:

   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

5. Instala las dependencias:

   ```powershell
   python -m pip install -r requirements.txt
   ```

6. Arranca la web:

   ```powershell
   python app.py
   ```

7. Abre **http://127.0.0.1:5000** en el navegador.
8. Para detener el servidor, vuelve a PowerShell y pulsa `Ctrl+C`.

El servidor escucha solo en tu propio ordenador. No publica ni abre puertos automáticamente.

## Personalizar

- **Textos y nombre:** edita `templates/index.html`.
- **Colores:** cambia las variables CSS al principio de `static/css/style.css`.
- **Cantidad y velocidad de partículas:** en `static/js/hearts.js`, ajusta `PARTICLE_COUNT` y `DURATION`.
- **Fotos:** copia tus imágenes a `static/img/recuerdos/` y cambia las tarjetas de ejemplo en `templates/index.html` por etiquetas `<img src="{{ url_for('static', filename='img/recuerdos/tu-foto.jpg') }}" ...>`. No se incluyen fotos inventadas.
- **Notas de las fotos:** modifica el texto de cada `.polaroid-note`.
- **Música:** coloca una canción que tengas derecho a usar en `static/audio/musica.mp3`. El reproductor aparecerá y podrá usarse tras una interacción. Si el archivo no existe, la web continúa funcionando sin errores.

## Estructura

```text
cumple_ayuya/
├── app.py
├── requirements.txt
├── README.md
├── templates/index.html
└── static/
    ├── css/style.css
    ├── js/main.js
    ├── js/hearts.js
    ├── img/recuerdos/       # añade aquí tus fotos
    └── audio/               # añade musica.mp3 aquí
```

## Pruebas

Se ha realizado una comprobación básica de estructura y sintaxis Python al generar el proyecto. Las pruebas de interacción visual deben confirmarse abriendo la web en un navegador real.
