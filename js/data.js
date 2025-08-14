// Spanish words data organized by categories
const categories = [
    {
        id: 'pronombres',
        name: 'الضمائر',
        words: [
            { spanish: 'yo', translation: 'أنا', example: 'Yo soy estudiante' },
            { spanish: 'tú', translation: 'أنت', example: '¿Tú cómo estás?' },
            { spanish: 'él', translation: 'هو', example: 'Él es mi amigo' },
            { spanish: 'ella', translation: 'هي', example: 'Ella es profesora' },
            { spanish: 'nosotros/nosotras', translation: 'نحن', example: 'Nosotros somos estudiantes' },
            { spanish: 'vosotros/vosotras', translation: 'أنتم', example: '¿Vosotros sois hermanos?' },
            { spanish: 'ellos/ellas', translation: 'هم/هن', example: 'Ellos son de España' }
        ]
    },
    {
        id: 'verbos',
        name: 'أفعال شائعة',
        words: [
            { spanish: 'ser', translation: 'يكون (صفة دائمة)', example: 'Yo soy alto' },
            { spanish: 'estar', translation: 'يكون (حالة مؤقتة)', example: 'Estoy cansado' },
            { spanish: 'ser', translation: 'يكون', example: 'Yo soy estudiante' },
            { spanish: 'estar', translation: 'يكون (حالة)', example: 'Estoy cansado' },
            { spanish: 'tener', translation: 'يملك', example: 'Tengo un perro' },
            { spanish: 'hacer', translation: 'يفعل/يصنع', example: 'Hago mi tarea' },
            { spanish: 'ir', translation: 'يذهب', example: 'Voy al mercado' },
            { spanish: 'poder', translation: 'يستطيع', example: '¿Puedes ayudarme؟' },
            { spanish: 'querer', translation: 'يريد', example: 'Quiero un café' },
            { spanish: 'hablar', translation: 'يتحدث', example: 'Hablo español' },
            { spanish: 'comer', translation: 'يأكل', example: 'Como frutas' },
            { spanish: 'beber', translation: 'يشرب', example: 'Bebo agua' }
        ]
    },
    {
        id: 'sustantivos',
        name: 'أسماء أساسية',
        words: [
            { spanish: 'casa', translation: 'منزل', example: 'Mi casa es grande' },
            { spanish: 'comida', translation: 'طعام', example: 'La comida está deliciosa' },
            { spanish: 'agua', translation: 'ماء', example: 'Necesito agua' },
            { spanish: 'tiempo', translation: 'وقت', example: 'No tengo tiempo' },
            { spanish: 'día', translation: 'يوم', example: 'Buenos días' },
            { spanish: 'año', translation: 'سنة', example: 'Tengo veinte años' },
            { spanish: 'hombre', translation: 'رجل', example: 'Ese hombre es mi padre' },
            { spanish: 'mujer', translation: 'امرأة', example: 'La mujer es doctora' },
            { spanish: 'niño/niña', translation: 'طفل/طفلة', example: 'El niño juega' },
            { spanish: 'trabajo', translation: 'عمل', example: 'Voy al trabajo' }
        ]
    },
    {
        id: 'adjetivos',
        name: 'صفات',
        words: [
            { spanish: 'bueno/a', translation: 'جيد', example: 'Es un libro bueno' },
            { spanish: 'malo/a', translation: 'سيء', example: 'Es un día malo' },
            { spanish: 'grande', translation: 'كبير', example: 'Una casa grande' },
            { spanish: 'pequeño/a', translation: 'صغير', example: 'Un perro pequeño' },
            { spanish: 'nuevo/a', translation: 'جديد', example: 'Un coche nuevo' },
            { spanish: 'viejo/a', translation: 'قديم', example: 'Un libro viejo' },
            { spanish: 'bonito/a', translation: 'جميل', example: 'Un vestido bonito' },
            { spanish: 'feo/a', translation: 'قبيح', example: 'Un edificio feo' },
            { spanish: 'fácil', translation: 'سهل', example: 'Es fácil' },
            { spanish: 'difícil', translation: 'صعب', example: 'Es difícil' }
        ]
    },
    {
        id: 'adverbios',
        name: 'ظروف',
        words: [
            { spanish: 'bien', translation: 'جيداً', example: 'Lo hice bien' },
            { spanish: 'mal', translation: 'بشكل سيء', example: 'Eso está mal' },
            { spanish: 'despacio', translation: 'ببطء', example: 'Habla despacio' },
            { spanish: 'rápido', translation: 'بسرعة', example: 'Corre rápido' },
            { spanish: 'aquí', translation: 'هنا', example: 'Estoy aquí' },
            { spanish: 'allí', translation: 'هناك', example: 'Mira allí' },
            { spanish: 'ahora', translation: 'الآن', example: 'Ahora no' },
            { spanish: 'después', translation: 'بعد', example: 'Hasta después' },
            { spanish: 'nunca', translation: 'أبداً', example: 'Nunca voy allí' },
            { spanish: 'siempre', translation: 'دائماً', example: 'Siempre llega tarde' }
        ]
    },
    {
        id: 'preposiciones',
        name: 'حروف الجر',
        words: [
            { spanish: 'a', translation: 'إلى/في', example: 'Voy a casa' },
            { spanish: 'de', translation: 'من/بمعنى', example: 'Soy de España' },
            { spanish: 'en', translation: 'في', example: 'Está en la mesa' },
            { spanish: 'con', translation: 'مع', example: 'Voy contigo' },
            { spanish: 'sin', translation: 'بدون', example: 'Café sin azúcar' },
            { spanish: 'por', translation: 'من أجل/خلال', example: 'Gracias por todo' },
            { spanish: 'para', translation: 'لأجل', example: 'Es para ti' },
            { spanish: 'sobre', translation: 'فوق/حول', example: 'El libro está sobre la mesa' },
            { spanish: 'entre', translation: 'بين', example: 'Entre tú y yo' },
            { spanish: 'hasta', translation: 'حتى', example: 'Hasta mañana' }
        ]
    },
    {
        id: 'interrogativos',
        name: 'أدوات الاستفهام',
        words: [
            { spanish: '¿qué؟', translation: 'ماذا/ما', example: '¿Qué es esto؟' },
            { spanish: '¿quién؟', translation: 'من', example: '¿Quién es él؟' },
            { spanish: '¿dónde؟', translation: 'أين', example: '¿Dónde vives؟' },
            { spanish: '¿cuándo؟', translation: 'متى', example: '¿Cuándo vienes؟' },
            { spanish: '¿cómo؟', translation: 'كيف', example: '¿Cómo estás؟' },
            { spanish: '¿por qué؟', translation: 'لماذا', example: '¿Por qué lloras؟' },
            { spanish: '¿cuál؟', translation: 'أي/ما', example: '¿Cuál prefieres؟' },
            { spanish: '¿cuánto/a؟', translation: 'كم', example: '¿Cuánto cuesta؟' },
            { spanish: '¿cuáles؟', translation: 'أي/ما (جمع)', example: '¿Cuáles son tus favoritos؟' },
            { spanish: '¿a qué hora؟', translation: 'في أي ساعة', example: '¿A qué hora es la cita؟' }
        ]
    },
    {
        id: 'numeros',
        name: 'الأرقام',
        words: [
            { spanish: 'cero', translation: 'صفر', example: 'Cero grados' },
            { spanish: 'uno', translation: 'واحد', example: 'Un libro' },
            { spanish: 'dos', translation: 'اثنان', example: 'Dos manzanas' },
            { spanish: 'tres', translation: 'ثلاثة', example: 'Tres gatos' },
            { spanish: 'cuatro', translation: 'أربعة', example: 'Cuatro sillas' },
            { spanish: 'cinco', translation: 'خمسة', example: 'Son las cinco' },
            { spanish: 'seis', translation: 'ستة', example: 'Seis meses' },
            { spanish: 'siete', translation: 'سبعة', example: 'Siete días' },
            { spanish: 'ocho', translation: 'ثمانية', example: 'Ocho personas' },
            { spanish: 'nueve', translation: 'تسعة', example: 'Nueve años' },
            { spanish: 'diez', translation: 'عشرة', example: 'Las diez en punto' }
        ]
    },
    {
        id: 'fechas',
        name: 'الأيام والشهور',
        words: [
            { spanish: 'lunes', translation: 'الاثنين', example: 'El lnes voy al médico' },
            { spanish: 'martes', translation: 'الثلاثاء', example: 'Martes 13' },
            { spanish: 'miércoles', translation: 'الأربعاء', example: 'Hoy es miércoles' },
            { spanish: 'jueves', translation: 'الخميس', example: 'Jueves santo' },
            { spanish: 'viernes', translation: 'الجمعة', example: 'Viernes de descanso' },
            { spanish: 'sábado', translation: 'السبت', example: 'Sábado por la noche' },
            { spanish: 'domingo', translation: 'الأحد', example: 'Domingo de resurrección' },
            { spanish: 'enero', translation: 'يناير', example: '1 de enero' },
            { spanish: 'febrero', translation: 'فبراير', example: '14 de febrero' },
            { spanish: 'marzo', translation: 'مارس', example: '8 de marzo' },
            { spanish: 'abril', translation: 'أبريل', example: '1 de abril' },
            { spanish: 'mayo', translation: 'مايو', example: '1 de mayo' },
            { spanish: 'junio', translation: 'يونيو', example: '21 de junio' },
            { spanish: 'julio', translation: 'يوليو', example: '15 de julio' },
            { spanish: 'agosto', translation: 'أغسطس', example: '15 de agosto' },
            { spanish: 'septiembre', translation: 'سبتمبر', example: '15 de septiembre' },
            { spanish: 'octubre', translation: 'أكتوبر', example: '12 de octubre' },
            { spanish: 'noviembre', translation: 'نوفمبر', example: '2 de noviembre' },
            { spanish: 'diciembre', translation: 'ديسمبر', example: '25 de diciembre' }
        ]
    },
    {
        id: 'colores',
        name: 'الألوان',
        words: [
            { spanish: 'rojo/a', translation: 'أحمر', example: 'Una rosa roja' },
            { spanish: 'azul', translation: 'أزرق', example: 'El cielo azul' },
            { spanish: 'amarillo/a', translation: 'أصفر', example: 'El sol amarillo' },
            { spanish: 'verde', translation: 'أخضر', example: 'Hierba verde' },
            { spanish: 'negro/a', translation: 'أسود', example: 'Vestido negro' },
            { spanish: 'blanco/a', translation: 'أبيض', example: 'Nieve blanca' },
            { spanish: 'gris', translation: 'رمادي', example: 'Día gris' },
            { spanish: 'marrón', translation: 'بني', example: 'Mesa marrón' },
            { spanish: 'naranja', translation: 'برتقالي', example: 'Zanahoria naranja' },
            { spanish: 'rosa', translation: 'وردي', example: 'Camiseta rosa' },
            { spanish: 'morado/a', translation: 'بنفسجي', example: 'Uva morada' }
        ]
    },
    {
        id: 'frases',
        name: 'عبارات شائعة',
        words: [
            { spanish: 'Hola', translation: 'مرحباً', example: '¡Hola! ¿Cómo estás؟' },
            { spanish: 'Buenos días', translation: 'صباح الخير', example: 'Buenos días, señor' },
            { spanish: 'Buenas tardes', translation: 'مساء الخير', example: 'Buenas tardes, ¿cómo está؟' },
            { spanish: 'Buenas noches', translation: 'تصبح على خير/مساء الخير', example: 'Buenas noches, hasta mañana' },
            { spanish: 'Gracias', translation: 'شكراً', example: 'Muchas gracias' },
            { spanish: 'Por favor', translation: 'من فضلك', example: 'Un café, por favor' },
            { spanish: 'Lo siento', translation: 'أنا آسف', example: 'Lo siento mucho' },
            { spanish: 'Perdón', translation: 'عذراً', example: 'Perdón por llegar tarde' },
            { spanish: '¿Dónde está...؟', translation: 'أين...؟', example: '¿Dónde está el baño؟' },
            { spanish: 'No entiendo', translation: 'لا أفهم', example: 'Lo siento, no entiendo' },
            { spanish: '¿Hablas árabe؟', translation: 'هل تتكلم العربية؟', example: '¿Hablas árabe؟' },
            { spanish: 'No sé', translation: 'لا أعرف', example: 'No sé la respuesta' },
            { spanish: '¿Cuánto cuesta؟', translation: 'كم سعره؟', example: '¿Cuánto cuesta esto؟' },
            { spanish: 'Quisiera...', translation: 'أريد...', example: 'Quisiera un café' },
            { spanish: 'La cuenta, por favor', translation: 'الحساب من فضلك', example: '¿Me trae la cuenta, por favor؟' }
        ]
    }
];
