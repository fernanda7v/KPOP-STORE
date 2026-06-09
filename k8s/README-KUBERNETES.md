# Implementación Kubernetes - Kpop Store

Este directorio contiene los archivos de configuración para desplegar la aplicación Kpop Store en Kubernetes.

## Componentes desplegados

### 1. PostgreSQL
Archivo: `01-postgres.yaml`

Incluye:
- PersistentVolumeClaim para almacenamiento de datos.
- Secret con usuario, contraseña y base de datos.
- Deployment de PostgreSQL.
- Service interno tipo ClusterIP.

### 2. Backend NestJS
Archivo: `02-backend.yaml`

Incluye:
- ConfigMap para variables generales.
- Secret para la contraseña de la base de datos.
- Deployment del backend NestJS.
- Service tipo NodePort para exponer el backend.

### 3. Frontend React
Archivo: `03-frontend.yaml`

Incluye:
- Deployment del frontend React.
- Service tipo NodePort para exponer la interfaz web.

## Comandos de ejecución

Desde la carpeta principal del proyecto:

```bash
kubectl apply -f k8s/01-postgres.yaml
kubectl apply -f k8s/02-backend.yaml
kubectl apply -f k8s/03-frontend.yaml