const featuredSeed = [
    {_id: 1, language:[{langCode: "en", name: "2x", description: "Featured tag shown for 24 hours only!!!"},{langCode: "fr", name: "2x", description: "Tag en vedette affiché pendant 24 heures seulement !!!"},{langCode: "ar", name: "2x", description: "علامة مميزة تظهر لمدة 24 ساعة فقط!"}], validationPeriod: 24, price: 1,  currencyCode: "USD", "currencySymbol": "&#36;", image: "2x.png",
    imageSource: "local"},
    {_id: 2, language:[{langCode: "en", name: "3x", description: "Featured tag shown for 36 hours only!!!"}, {langCode: "fr", name: "3x", description: "Étiquette en vedette affichée pendant 36 heures seulement !!!"}, {langCode: "ar", name: "3x", description: "علامة مميزة تظهر لمدة 36 ساعة فقط!"}], validationPeriod: 36, price: 2,  currencyCode: "USD", "currencySymbol": "&#36;", image: "3x.png",
    imageSource: "local"},
    {_id: 3, language:[{langCode: "en", name: "6x", description: "Featured tag shown for 72 hours only!!!"},{langCode: "fr", name: "6x", description: "Balise en vedette affichée pendant 72 heures seulement !!!"},{langCode: "ar", name: "6x", description: "علامة مميزة تظهر لمدة 72 ساعة فقط!"}], validationPeriod: 72, price: 3,  currencyCode: "USD", "currencySymbol": "&#36;", image: "6x.png",
    imageSource: "local"}
];

module.exports = { featuredSeed };