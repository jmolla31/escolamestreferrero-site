/**
 * Cadenas de traducción UI para es/ca.
 * Añade aquí cualquier texto estático que aparezca en los componentes.
 */
export type Lang = 'es' | 'ca';

export const ui = {
  es: {
    // Navegación
    'nav.home': 'Inicio',
    'nav.about': 'Sobre nosotros',
    'nav.courses': 'Oferta Educativa',
    'nav.teachers': 'Profesores',
    'nav.blog': 'Noticias',
    'nav.events': 'Eventos',
    'nav.gallery': 'Galería',
    'nav.contact': 'Contacto',

    // Hero
    'hero.cta': 'Descubre nuestros cursos',

    // Secciones – inicio
    'home.courses.title': 'Nuestros cursos',
    'home.courses.more': 'Ver todos los cursos',
    'home.teachers.title': 'Nuestros profesores',
    'home.teachers.more': 'Conoce al equipo',
    'home.events.title': 'Próximos eventos',
    'home.events.more': 'Ver todos los eventos',
    'home.blog.title': 'Últimas noticias',
    'home.blog.more': 'Leer más noticias',

    // Cursos
    'courses.title': 'Cursos',
    'courses.level': 'Nivel',
    'courses.readMore': 'Más información',

    // Profesores
    'teachers.title': 'Profesores',

    // Blog
    'blog.title': 'Noticias',
    'blog.readMore': 'Leer más',
    'blog.publishedOn': 'Publicado el',

    // Eventos
    'events.title': 'Eventos',
    'events.tickets': 'Entradas',
    'events.location': 'Lugar',
    'events.free': 'Entrada libre',

    // Galería
    'gallery.title': 'Galería',

    // Sobre nosotros
    'about.title': 'Sobre nosotros',

    // Banda Jove
    'bandajove.title': 'Banda Joven',

    // Contacto
    'contact.title': 'Contacto',
    'contact.phone': 'Teléfono',
    'contact.email': 'Email',
    'contact.address': 'Dirección',
    'contact.form.name': 'Nombre',
    'contact.form.email': 'Email',
    'contact.form.message': 'Mensaje',
    'contact.form.send': 'Enviar',
    'contact.form.success': '¡Mensaje enviado correctamente!',

    // Footer
    'footer.rights': 'Todos los derechos reservados.',
    'footer.privacy': 'Política de privacidad',

    // Misc
    'lang.switch': 'Valencià',
    'lang.switch.url': '/',
  },
  ca: {
    // Navegació
    'nav.home': 'Inici',
    'nav.about': 'La Nostra Escola',
    'nav.courses': 'Oferta Educativa',
    'nav.teachers': 'Professors',
    'nav.blog': 'Notícies',
    'nav.events': 'Esdeveniments',
    'nav.gallery': 'Galeria',
    'nav.contact': 'Contacte',

    // Hero
    'hero.cta': 'Descobreix els nostres cursos',

    // Seccions – inici
    'home.courses.title': 'Els nostres cursos',
    'home.courses.more': 'Veure tots els cursos',
    'home.teachers.title': 'Els nostres professors',
    'home.teachers.more': 'Coneix l\'equip',
    'home.events.title': 'Propers esdeveniments',
    'home.events.more': 'Veure tots els esdeveniments',
    'home.blog.title': 'Últimes notícies',
    'home.blog.more': 'Llegir més notícies',

    // Cursos
    'courses.title': 'Cursos',
    'courses.level': 'Nivell',
    'courses.readMore': 'Més informació',

    // Professors
    'teachers.title': 'Professors',

    // Blog
    'blog.title': 'Notícies',
    'blog.readMore': 'Llegir més',
    'blog.publishedOn': 'Publicat el',

    // Esdeveniments
    'events.title': 'Esdeveniments',
    'events.tickets': 'Entrades',
    'events.location': 'Lloc',
    'events.free': 'Entrada lliure',

    // Galeria
    'gallery.title': 'Galeria',

    // Sobre nosaltres
    'about.title': 'La Nostra Escola',

    // Banda Jove
    'bandajove.title': 'Banda Jove',

    // Contacte
    'contact.title': 'Contacte',
    'contact.phone': 'Telèfon',
    'contact.email': 'Email',
    'contact.address': 'Adreça',
    'contact.form.name': 'Nom',
    'contact.form.email': 'Email',
    'contact.form.message': 'Missatge',
    'contact.form.send': 'Enviar',
    'contact.form.success': 'Missatge enviat correctament!',

    // Footer
    'footer.rights': 'Tots els drets reservats.',
    'footer.privacy': 'Política de privacitat',

    // Misc
    'lang.switch': 'Español',
    'lang.switch.url': '/es',
  },
} as const;

export type TranslationKey = keyof typeof ui.es;
