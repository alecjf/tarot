function pathDimensions() {
	const trig = (deg, func) => Math[func]((deg * Math.PI) / 180),
		// sin = (deg) => trig(deg, "sin"),
		cos = (deg) => trig(deg, "cos"),
		tan = (deg) => trig(deg, "tan"),
		numberOfTrees = 3,
		TREE_CONTAINER_WIDTH = ~~(
			document.getElementsByClassName("App")[0].offsetWidth /
			numberOfTrees
		),
		SEF_DIM = TREE_CONTAINER_WIDTH * 0.18,
		TREE_WIDTH = TREE_CONTAINER_WIDTH - SEF_DIM * numberOfTrees,
		PATH_HEIGHT = TREE_CONTAINER_WIDTH * 0.04,
		a = TREE_WIDTH / 2,
		b = tan(30) * a,
		c = a / cos(30),
		d = Math.sqrt(TREE_WIDTH ** 2 + c ** 2),
		y = b + c,
		z = Math.sqrt(a ** 2 + y ** 2),
		h = y + b,
		pixelate = (n) => Math.abs(Math.round(n)) + "px",
		halfWidth = a,
		triangleHeight = b,
		short = c,
		medium = pixelate(TREE_WIDTH),
		long = pixelate(h),
		bisectHexDiag = pixelate(d),
		otherDiag = pixelate(z),
		sefHeight = pixelate(SEF_DIM),
		halfSef = pixelate(SEF_DIM / 2),
		applyStyle = (cn, prop, length) =>
			[...document.getElementsByClassName(cn)].forEach(
				(elem) => (elem.style[prop] = length)
			),
		applicator = (cns, prop, val) =>
			cns.forEach((cn) => applyStyle(cn, prop, val));

	// path height:
	[...document.getElementsByClassName("path")].forEach((path) => {
		path.style.height = pixelate(PATH_HEIGHT);
	});

	// path lengths:
	applyStyle("short", "width", pixelate(short));
	applyStyle("medium", "width", medium);
	applyStyle("long", "width", long);
	applyStyle("bisect-hex-diag", "width", bisectHexDiag);
	applyStyle("other-diag", "width", otherDiag);

	// block heights and padding:
	applyStyle("trees", "padding", pixelate(SEF_DIM * 0.75) + " 0");
	applyStyle("trees", "gap", pixelate(SEF_DIM * 0.75));
	applyStyle("tree-container", "padding", sefHeight);
	applyStyle(
		"tree",
		"height",
		pixelate(short * 3 + triangleHeight * 2 + PATH_HEIGHT)
	);
	applyStyle("tree", "width", medium);
	applyStyle("tree", "paddingTop", pixelate(triangleHeight));
	applicator(
		["top-hex", "triangle", "diamond", "base"],
		"height",
		pixelate(short)
	);

	// center paths:
	applyStyle("center", "left", pixelate(halfWidth));
	applyStyle("center-2", "top", pixelate(short * 2));
	applyStyle("center-3", "top", pixelate(short * 3));
	applyStyle("center-2gra", "top", pixelate(short));
	applyStyle("center-3gra", "top", pixelate(short * 2));

	// SEFIROT:
	applyStyle("sefira", "height", sefHeight);
	applyStyle("sefira", "width", sefHeight);
	// center:
	const center = pixelate(halfWidth - SEF_DIM / 2);
	applicator(["kether", "tiphareth", "yesod", "malkuth"], "left", center);
	// left & right:
	const leftRight = "-" + halfSef;
	applicator(["binah", "geburah", "hod"], "left", leftRight);
	applicator(["chokmah", "chesed", "netzach"], "right", leftRight);
	// upper:
	const upper = pixelate(triangleHeight - SEF_DIM / 2 + PATH_HEIGHT / 2);
	applicator(["binah", "chokmah"], "top", upper);
	// middle:
	const middle = pixelate(
		short + (triangleHeight - SEF_DIM / 2 + PATH_HEIGHT / 2)
	);
	applicator(["chesed", "geburah"], "top", middle);
	// lower:
	const lower = pixelate(
		2 * short + (triangleHeight - SEF_DIM / 2 + PATH_HEIGHT / 2)
	);
	applicator(["hod", "netzach"], "top", lower);
	// CENTER SEFIROT:
	// crown:
	applyStyle("kether", "top", "-" + pixelate(SEF_DIM / 2 - PATH_HEIGHT / 2));
	// not gra:
	applyStyle(
		"tiphareth-not-gra",
		"top",
		pixelate(2 * short - SEF_DIM / 2 + PATH_HEIGHT / 2)
	);
	applyStyle(
		"yesod-not-gra",
		"top",
		pixelate(3 * short - SEF_DIM / 2 + PATH_HEIGHT / 2)
	);
	applyStyle(
		"malkuth-not-gra",
		"top",
		pixelate(4 * short - SEF_DIM / 2 + PATH_HEIGHT / 2)
	);
	// gra:
	applyStyle(
		"tiphareth-gra",
		"top",
		pixelate(short - SEF_DIM / 2 + PATH_HEIGHT / 2)
	);
	applyStyle(
		"yesod-gra",
		"top",
		pixelate(2 * short - SEF_DIM / 2 + PATH_HEIGHT / 2)
	);
	applyStyle(
		"malkuth-gra",
		"top",
		pixelate(3 * short - SEF_DIM / 2 + PATH_HEIGHT / 2)
	);
}

export default pathDimensions;
