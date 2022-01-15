const sefInfo = {
	Kether: [
		"Crown",
		"Sphere of Creative Urge",
		"nothingness, supreme godhead, the creator",
		"Saturn",
	],
	Chokmah: [
		"Wisdom",
		"Sphere of Force",
		"yang, active, positive, god, benevolent, beginning, point",
		"Kings: Elders, fire, Atziluth (creative urge)",
	],
	Binah: [
		"Understanding",
		"Sphere of Conceptual Form",
		"yin, passive, negative, goddess, discerning, womb",
		"Queens: Adults, water, Briah (concept)",
	],
	Chesed: [
		"Mercy",
		"Sphere of Expansion",
		"peace, forgiveness, cohesion, grace",
		"right arm, white, Moon",
	],
	Geburah: [
		"Strength",
		"Sphere of Restriction",
		"struggle, judgment, punishment, retribution, rigor",
		"left arm, red",
	],
	Tiphareth: [
		"Beauty",
		"Sphere of Illumination",
		"harmony, awakening, compassion",
		"green, Venus",
		"Knights: Young adults, air, Yetzirah (formation)",
	],
	Netzach: [
		"Victory",
		"Sphere of Creativity",
		"passion, emotion, instinct, prophecy",
		"right leg, Mars",
	],
	Hod: [
		"Splendor",
		"Sphere of Logic",
		"reason, intellect, learning, prophecy",
		"left leg, Sun",
	],
	Yesod: [
		"Foundation",
		"Sphere of Potential",
		"spiritual connection, divine transmission, covenant",
		"phallus, Mercury",
	],
	Malkuth: [
		"Kingdom",
		"Sphere of Manifestation",
		"physical world, health & wealth, basic consciousness, communion of Israel",
		"Jupiter",
		"Pages: Children, earth, Assiah (presence)",
	],
};

const sefs = Object.keys(sefInfo);

const pathTranslate = (path) => {
	const s = path.split("-").map((num) => sefs[num - 1]),
		relateSefs = (s, reverse) =>
			(reverse ? s.reverse() : s)
				.map((sef) => sefInfo[sef][0])
				.join(" of ");
	return [
		"from " + s.join(" to "),
		relateSefs(s, false),
		relateSefs(s, true),
	];
};

const pathTranslateFormat = (path) => {
	const lines = pathTranslate(path);
	return (
		<>
			{lines[0]}
			<br />
			{lines[1]}
			<br />
			{lines[2]}
		</>
	);
};

export default sefInfo;
export { sefs, pathTranslate, pathTranslateFormat };
