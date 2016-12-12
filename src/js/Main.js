/**
 *	Starts the application, which performs different actions on click events
 * and puts form data in the INCA object and shows data from the INCA object.
 *
 *	@author		Robin Kanthe
 *	@email		kanthe.robin@gmail.com
 *	@version		1.0
 *	@since		2016-11-14
 */

var Main = {
	bID : null, // ID på behandlingar delen av INCA-objektet, ökar med 1 efter ny inlagd behandling
	eID : null, // ID på allmantillstand delen av INCA-objektet, ökar med 1 efter nytt inlagd allmäntillstånd
	
	// Main class constructor. Enabling all js functionality
	// Adding eventlisteners to the different clickable buttons and tabs
	init : function() {
		
		try {
			bID = 0;		
			eID = 0;
			var anmalanTab = document.getElementById("tab_anmalan");
			anmalanTab.addEventListener("click", Main.showAnmalanTab);
			var formTab = document.getElementById("tab_form");
			formTab.addEventListener("click", Main.showFormTab);
			var registerButton = document.getElementById("register_button");
			registerButton.addEventListener("click", Main.sparaPatient);
			var treatmentButton = document.getElementById("treatment_button");
			treatmentButton.addEventListener("click", Main.sparaBehandling);
			var ecogButton = document.getElementById("ecog_button");
			ecogButton.addEventListener("click", Main.sparaEcog);
			var anmalanButton = document.getElementById("anmalan_button");
			anmalanButton.addEventListener("click", Main.visaAnmalan);
		}
		catch (e) { 
			document.getElementById("critical_error").innerHTML = "Error in Main.init: " + e;
		}
	},
	
	// Activated when clicking on "Patientformulär" tab
	showFormTab : function () {
		try {
			Main.removeErrorAndClearMessages();
			document.getElementById("h_form_wrapper").style.visibility = "visible";
			document.getElementById("r_form_wrapper").style.visibility = "visible";
			document.getElementById("b_e_form_wrapper").style.visibility = "visible";
			document.getElementById("h_anmalan_wrapper").style.visibility = "hidden";
			document.getElementById("anmalan_wrapper").style.visibility = "hidden";
		}
		catch (e) { 
			document.getElementById("critical_error").innerHTML = "Error in Main.showFormTab: " + e;
		}
	},
	
	// Activated when clicking on "Canceranmälan" tab
	showAnmalanTab : function () {
		try {
			Main.removeErrorAndClearMessages();
			document.getElementById("h_form_wrapper").style.visibility = "hidden";
			document.getElementById("h_form_wrapper").style.visibility = "hidden";
			document.getElementById("r_form_wrapper").style.visibility = "hidden";
			document.getElementById("b_e_form_wrapper").style.visibility = "hidden";
			document.getElementById("h_anmalan_wrapper").style.visibility = "visible";
			document.getElementById("anmalan_wrapper").style.visibility = "visible";
		}
		catch (e) { 
			document.getElementById("critical_error").innerHTML = "Error in Main.showAnmalanTab: " + e;
		}
	},
	
	// Function for saving values from "Registrera ny patient" form in the inca object
	sparaPatient : function() {
		var radiobuttonError = false;
		
		try {
			Main.removeErrorAndClearMessages();
			var p_number = document.getElementById("personnummer").value; // P-nr from form
			var date = document.getElementById("datum").value; // Date from form
			var diag = document.getElementById("diagnos").value; // Behandlingsmetod from form
			// Checks if one of Grund för diagnos radio buttons is checked and assigning the selection to a variable
			try {
				var grund = document.querySelector('input[name="diagnos_grund"]:checked').value; // ECOG from form
			}
			catch(e) {
				document.getElementById("grund_error").innerHTML = "Diagnosgrund är inte vald.";
				radiobuttonError = true;
				throw (e);
			}
			
			// Checks that p-nr do not already exist in the INCA object
			// A patient should not be registered twice
			if(!Main.kontrolleraPersonnummerFormat(p_number)) {
				// Error messages. Are erased when user klicks a button/tab again
				document.getElementById("pnr_error").innerHTML = "Personnumret är felskrivet.";	
			}
			else if(Main.kontrolleraPersonNummer(p_number)) {
				document.getElementById("pnr_error").innerHTML = "Patienten är redan registrerad.";	
			}
			// Checks that date is written in correct format
			else if (!Main.kontrolleraDatumFormat(date)) {
				document.getElementById("date_error").innerHTML = "Datum är felskrivet.";
			}
			// A diagnos must be written in form
			else if(diag == null || diag == "") {
				document.getElementById("diag_error").innerHTML = "V.g. fyll i diagnos-fältet";	
			}
			else {
				// Creating an object that is put in the "patienter" part of the INCA object
				var patient = {personnummer : p_number, datum : date, diagnos : diag, diagnos_grund : grund }
				window.inca.patienter.push(patient);
				document.getElementById("reg_correct").innerHTML = "Patient registrerad!";
			}
		}
		catch (e) {
		
			if(!radiobuttonError) { // Chrome, Opera
				document.getElementById("critical_error").innerHTML = "Error in Main.sparaPatient: " + e;
			}
		}
	},
	
	// Function for saving values from "Registrera behandling" form in the inca object
	sparaBehandling : function() {
		var radiobuttonError = false;
		
		try {
			Main.removeErrorAndClearMessages();
			var p_number = document.getElementById("b_personnummer").value; // P-nr from form
			var date = document.getElementById("b_datum").value; // Date from form
			// Checks if one of Behandlingsmetod radio buttons is checked and assigning the selection to a variable
			try {
				var method = document.querySelector('input[name="b_metod"]:checked').value; // ECOG from form
			}
			catch (e) { 
				document.getElementById("b_method_error").innerHTML = "Behandlingsmetod är inte vald.";
				radiobuttonError = true;
				throw (e);
			}
			var code = document.getElementById("b_operationskod").value; // Operationskod from form
			
			// Checks that p-nr exists in the INCA object
			if(!Main.kontrolleraPersonnummerFormat(p_number)) {
				// Error messages. Are erased when user klicks a button/tab again
				document.getElementById("b_pnr_error").innerHTML = "Personnumret är felskrivet.";	
			}
			else if(!Main.kontrolleraPersonNummer(p_number)) {
				document.getElementById("b_pnr_error").innerHTML = "Patient finns ej.";	
			}
			// Checks that date is written in correct format
			else if (!Main.kontrolleraDatumFormat(date)) {
				document.getElementById("b_date_error").innerHTML = "Datum är felsktivet.";
			}
			else if (!Main.kontrolleraOperationsKod(code, method)) {
				document.getElementById("b_code_error").innerHTML = "Operationskoden är felaktig.";
			}
			else {
				bID++; // Adding a unique ID
				// Creating an object that is put in the "behandlingar" part of the INCA object
				var behandling = {b_ID : bID, b_personnummer : p_number, b_datum : date, b_metod : method, b_operationskod : code }
				window.inca.behandlingar.push(behandling);
				document.getElementById("b_correct").innerHTML = "Behandling registrerad!";
			}
		}
		catch (e) {
		
			if(!radiobuttonError) { // Chrome, Opera
				document.getElementById("critical_error").innerHTML = "Error in Main.sparaBehandling: " + e;
			}
		}
	},
	
	// Function for saving values from "Registrera allmäntillstånd" form in the inca object
	sparaEcog : function() {
		var radiobuttonError = false;
		
		try {
			Main.removeErrorAndClearMessages();
			var p_number = document.getElementById("ecog_personnummer").value; // P-nr from form
			var date = document.getElementById("ecog_datum").value; // Date from form
			// Checks if one of ECOG radio buttons is checked and assigning the selection to a variable
			try {
				var ecog = document.querySelector('input[name="ecog_varde"]:checked').value; // ECOG from form
			}
			catch (e) { 
				document.getElementById("e_ecog_error").innerHTML = "ECOG är inte vald.";
				radiobuttonError = true;
				throw (e);
			}
			
			// Checks that p-nr exists in the INCA object
			if(!Main.kontrolleraPersonnummerFormat(p_number)) {
				// Error messages. Are erased when user klicks a button/tab again
				document.getElementById("e_pnr_error").innerHTML = "Personnumret är felskrivet.";	
			}
			else if(!Main.kontrolleraPersonNummer(p_number)) {
				document.getElementById("e_pnr_error").innerHTML = "Patient finns ej";	
			}
			// Checks that date is written in correct format
			else if (!Main.kontrolleraDatumFormat(date)) {
				document.getElementById("e_date_error").innerHTML = "Datum är felskrivet";
			}
			else {
				eID++; // Adding a unique ID
				// Creating an object that is put in the "allmantillstand" part of the INCA object
				var tillstand = {ecog_ID : eID, ecog_personnummer : p_number, ecog_datum : date, ecog_varde : ecog }
				window.inca.allmantillstand.push(tillstand);
				document.getElementById("e_correct").innerHTML = "Allmäntillstånd registrerat!";
			}
		}
		catch (e) {
		
			if(!radiobuttonError) { // Chrome, Opera
				document.getElementById("critical_error").innerHTML = "Error in Main.sparaEcog: " + e;
			}
		}
	},
	
	// Function for showing diagnos and ECOG "Canseranmälan" page
	visaAnmalan : function () {
		try {
			Main.removeErrorAndClearMessages();
			var result = false;
			var p_number = document.getElementById("a_personnummer").value;
			// Checks that p-nr exists in the INCA object
			if(!Main.kontrolleraPersonnummerFormat(p_number)) {
				document.getElementById("a_pnr_error").innerHTML = "Personnumret är felskrivet.";	
			}
			else if(!Main.kontrolleraPersonNummer(p_number)) {
				document.getElementById("a_pnr_error").innerHTML = "Patient finns ej.";	
			}
			// Finds and displays diagnos for the current patient
			for(var i = 0; i < window.inca.patienter.length; i++) {
				
				if(p_number == window.inca.patienter[i].personnummer) {
					document.getElementById("anm_diagnos").innerHTML = window.inca.patienter[i].diagnos;
					var ecogMax = 0;
					// Finds and displays highest ECOG for the current patient
					for(var i = 0; i < window.inca.allmantillstand.length; i++) {
						var current = window.inca.allmantillstand[i];
						
						if(p_number == current.ecog_personnummer && Number(current.ecog_varde) > ecogMax) {
							ecogMax = current.ecog_varde;
						}
					}
					document.getElementById("anm_ecog").innerHTML = ecogMax;
					result = true;
				}
			}
		}
		catch (e) {
			document.getElementById("critical_error").innerHTML = "Error in Main.visaAnmalan: " + e;
		}
	},
	
	//////////////////////////////////////////////////////////////////////
	// Some functions to evaluate that input is written in correct form //
	//////////////////////////////////////////////////////////////////////
	
	// Checks p-nr
	kontrolleraPersonnummerFormat : function (p_number) {
		var result = false;
		
		if(p_number.length == 12 && !isNaN(p_number)) {
			result = true;
		}
		return result;
	},
	// Checks if the p-nr sent is or is not already in the INCA object
	kontrolleraPersonNummer : function (personnummer) {
		var result = false;
		
		for(var i = 0; i < window.inca.patienter.length; i++) {
			
			if(personnummer == window.inca.patienter[i].personnummer) {
				result = true; 
			}
		}
		return result;
	},
	
	// Checks date
	kontrolleraDatumFormat : function (date) {
		var result = false;
		
		if(date.length == 6 && !isNaN(date)) {
			result = true;
		}
		return result;
	},
	// Checks operation code (Must be in form AB1234)
	kontrolleraOperationsKod : function (kod, method) {
		var result = false;
		// Only valid for the Kirurgi method
		if(method != "Kirurgi") {
			result = true;
		}
		else if(kod.length == 6
			&& !isNaN(kod.substring(2)) // Is the 4 last characters digits
			&& Main.arVersaler(kod.substring(0, 2)) // Is the 2 first characters capital letters
			)
		{
			result = true;
		}
		return result;
	},
	
	// Input: A 2 character var
	// Checks if both are capital letters
	arVersaler : function (delAvKod) {
		var result = false;
		
		if(delAvKod.length == 2) {
			var resultFirstLetter = false;
			var resultSecondLetter = false;
			// Goes through all capital letters there is in Swedish alphabet
			var capitalLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 
				'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'Å', 'Ä', 'Ö'];
			for(var i = 0; i < capitalLetters.length; i++) {
				// Checks if each sent character belongs to the list of capital letters
				if(delAvKod[0] == capitalLetters[i]) {
					resultFirstLetter = true;
				}
				if(delAvKod[1] == capitalLetters[i]) {
					resultSecondLetter = true;
				}
			}
			// Both checks must be true
			result = resultFirstLetter && resultSecondLetter;
		}
		return result;
	},
	// Removing all error messages and "Korrekt ifyllt" messages
	removeErrorAndClearMessages : function () {
		document.getElementById("pnr_error").innerHTML = "";
		document.getElementById("date_error").innerHTML = "";
		document.getElementById("diag_error").innerHTML = "";
		document.getElementById("grund_error").innerHTML = "";
		document.getElementById("reg_correct").innerHTML = "";
		document.getElementById("b_pnr_error").innerHTML = "";
		document.getElementById("b_date_error").innerHTML = "";
		document.getElementById("b_method_error").innerHTML = "";
		document.getElementById("b_code_error").innerHTML = "";
		document.getElementById("b_correct").innerHTML = "";
		document.getElementById("e_pnr_error").innerHTML = "";
		document.getElementById("e_date_error").innerHTML = "";
		document.getElementById("e_ecog_error").innerHTML = "";
		document.getElementById("e_correct").innerHTML = "";
		document.getElementById("a_pnr_error").innerHTML = "";
	},
}

// Starts the Main class when website loads
window.addEventListener("load", Main.init);
