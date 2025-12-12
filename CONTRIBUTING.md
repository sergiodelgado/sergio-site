# CONTRIBUTING

Guía simple para mantener coherencia y calidad en el desarrollo del sitio **sergio-site**.

---

## 🧭 Principios
- Mantener el sitio **ligero, estático y minimalista**.
- Evitar frameworks innecesarios.
- Cuidar accesibilidad (labels, roles, aria-current).
- Documentar cada cambio en `CHANGELOG.md`.
- Usar commits claros y consistentes.

---

## 📁 Estructura esperada
Todo vive en la raíz del proyecto:

index.html
about.html
projects.html
contact.html
styles.css
script.js
robots.txt
sitemap.xml
CHANGELOG.md
CONTRIBUTING.md
README.md

---

## 🔧 Flujo de trabajo recomendado

### 1. Crear nueva rama (opcional)
git checkout -b feature/nombre-cambio

### 2. Realizar cambios  
- Mantener semántica HTML limpia  
- Usar CSS existente (no crear nuevos archivos a menos que sea necesario)  
- No agregar librerías externas sin justificación  

### 3. Actualizar `CHANGELOG.md`  
Agregar entrada con fecha y descripción breve.

### 4. Commit
git add .
git commit -m "Descripción breve del cambio"
git push


### 5. Revisar en Vercel  
Cada push despliega automáticamente.

---

## 🧹 Estilo de código

- HTML: sangrado de 2 espacios, sin inline JS.  
- CSS: usar variables y patrones existentes.  
- JS: modular y mínimo.  
- Nada de archivos gigantes sin secciones claras.

---

## 📬 Dudas
Todo lo que altere accesibilidad, SEO o estructura del sitio debe revisarse con cuidado.

Si el cambio es mayor (navegación nueva, rediseño global), actualizar también el README.

---
