# Arquitectura actual

```text
index.php
├── valida credenciales demo
├── createUserSession()
└── redirige a dashboard.php

config/bootstrap.php
├── rutas relativas
├── configuración de cookie y sesión
├── autenticación y protección de vistas
├── creación y destrucción de sesión
└── menú según rol

config/demo_users.php
└── catálogo temporal de cuatro usuarios demo

dashboard.php
├── requireAuth()
├── menú por rol
├── información del contexto de sesión
└── vistas temporales de módulos

api/
└── conserva acciones de navegación durante la sesión

logout.php
└── destruye la sesión y redirige al login
```

## Contexto guardado en sesión

La clave `$_SESSION['livp_user']` contiene, como mínimo:

- identificador del usuario;
- rol y etiqueta del rol;
- documento de acceso;
- nombre y perfil;
- tipo de cuenta: persona, empresa o consorcio;
- entidad relacionada;
- empresas participantes cuando es consorcio;
- fecha y hora de inicio de sesión.

La clave `$_SESSION['action_cache']` guarda el historial temporal de acciones de la sesión.
