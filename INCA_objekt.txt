Struktur för javasscript-objektet INCA

window.inca = {
	patienter : [ {
		personnummer : var,
		diagnosdatum : var,
		diagnos : var,
		diagnosgrund : var
	} ],
	behandlingar : [ {
		B_ID : var,
		personnummer : var,
		behandlingsdatum : var,
		metod : var,
		operationskod : var
	} ],
	allmantillstand : [ {
		ECOG_ID : var,
		personnummer : var,
		ecog_datum : var,
		ecog : var,
	} ]
}