function Sefirot({ isGra }) {
	return (
		<>
			<div className="sefira kether">KETHER</div>
			<div className="sefira chokmah">CHOKMAH</div>
			<div className="sefira binah">BINAH</div>
			<div className="sefira chesed">CHESED</div>
			<div className="sefira geburah">GEBURAH</div>
			<div className={`sefira tiphareth-${isGra ? "" : "not-"}gra tiphareth`}>
				TIPHARETH
			</div>
			<div className="sefira netzach">NETZACH</div>
			<div className="sefira hod">HOD</div>
			<div className={`sefira yesod-${isGra ? "" : "not-"}gra yesod`}>
				YESOD
			</div>
			<div className={`sefira malkuth-${isGra ? "" : "not-"}gra malkuth`}>
				MALKUTH
			</div>
		</>
	);
}

export default Sefirot;
