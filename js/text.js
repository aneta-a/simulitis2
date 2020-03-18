var CurLocale = "ru";
var DefaultLocale = "ru";

var Strings = {
	ru: {
		Title: "Симулит-2",
		Intro: "Это немного дополненная модель из статьи <a href=\"https://www.washingtonpost.com/graphics/2020/world/corona-simulator/?utm_campaign=wp_main\">Why outbreaks like coronavirus spread exponentially, and how to “flatten the curve”</a>, автор Harry Stevens. Описанная там \"болезнь\" называется \"симулит\". Я добавила несколько дополнительных параметров и возможности настройки. И небольшую выдуманную историю, совершенно не претендующую на какое-либо отношение к реальности.",
		pBrownien: "Итак, в сказочной стране Флахландии в своих прямоугольных городах жили-были серые броуновские кружочки. Они были очень общительны и дружелюбны, бегали по своим городам и обнимались своими невидимыми руками с каждым встречным. Но однажды в одном флахладнском городе <b>Броуниэне</b> один из кружочков заболел ранее неизвестной болезнью: симулитом-2. Вместо серого он стал коричневым. И каждый серый кружочек, который встречался с коричневым, тоже заражался симулитом, становился коричневым. И всё бы ничего, большинство коричневых кружочков через некоторое время становились зелёными, и больше никого не заражали, но некоторые коричневые кружочки стали превращаться в красные крестики, а если красному крестику не помочь, он мог превратиться в чёрный крестик, а это уже навсегда. Однако, в Броуниэне ничего страшного не случилось, эльфы-целители спасли почти всех. Нажмите \"Start\",  чтобы посмотреть, как это было.",
		pBrownille: "На этом бы всё и кончилось, но беда в том, что некоторые жители Броуниэна, будучи коричневыми и ещё не зная, что это может быть опасно, разъехались по другим городам. <br/> Один из них попал в город <b>Броунвилль</b>. Но жители Броунвилля были весёлые и смелые, симулита не испугались. Что им какой-то симулит? Видали они и похуже! Тем более, вон, в Броуниэне ничего страшного не случилось! <br/>И ни продолжали так же бегать по своему городу, обниматься, ходить друг к другу в гости и собирать большие застолья. Однако, в отличие от Броуниэна, в Броунвилле не было эльфов-целителей, а маленькая больница Броунвилля переполнилась, и врачи не смогли помочь всем, кому их помощь понадобилась… (Обратите внимание на сиреневую линию на графике справа)",
		pBrownhrad: "Мэр <b>Броунграда</b> очень испугался. Ему не хотелось, чтобы было как в Броунвилле, особенно накануне выборов. И он под страхом наказания запретил броунградцам выходить на улицу. Всем, кроме тех, кто разносил по домам избирательные урны. Больница Броунграда, однако, лучше не стала: врачи сидели по домам, боясь наказания, да и денег на оснащение больницы не было, все ушли на предвыборную кампанию. И ещё на церковь, чтобы молиться об удаче. Запустите симуляцию несколько раз (кнопка \"Restart\"), чтобы узнать, почему удача броунградцам так нужна.",
		pBrowntown: "А мэр <b>Броунтауна</b> был демократичным, свободолюбивым и верил в силы природы. Он не хотел ограничивать свободу жителей, и решил, что будет даже лучше, если все они станут зелёными. А чтобы не случилось беды, он призвал всех жителей дружно строить новую больницу. И они её даже построили, но…",
		pBrownburg: "До <b>Броунбурга</b> вспышка симулита добралась не сразу, и у бургомистра было время подумать и учесть опыт коллег. Он решил призвать жителей по возможности оставаться по домам, и занялся переоснащением больниц. Получилось ли у него?",
		pDiycity: "А может быть получится у вас? В <b>Даисити</b> есть кнопка \"Settings\", используйте её, чтобы менять долю жителей, остающихся дома (\"responsibility\"), начальную ёмкость больниц и скорость её увеличения. Можно менять количество жителей города, их \"размер\" и скорость — от этого меняется количество контактов каждого жителя в единицу времени и влияние самоизоляции. Можно менять и параметры болезни симулит.",
		Resume: "Эта модель очень простая. Во Флахландии нет экономики и психологии, у её жителей нет семей, друзей, коллег, они не ходят в школы, не путешествуют (кроме тех нескольких жителей Броуниэна) и не собираются на массовые мероприятия. Но даже в их мире от их действий многое зависит."
	}
}

function getString(name) {
	var strObj = {};
	if (Strings.hasOwnProperty(CurLocale)) strObj = Strings[CurLocale]
	else strObj = Strings[DefaultLocale];
	if (strObj.hasOwnProperty(name)) return strObj[name];
	if (Strings[DefaultLocale].hasOwnProperty(name)) return Strings[DefaultLocale][name];
	return "";
	
}
