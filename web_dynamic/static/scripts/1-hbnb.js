$('document').ready(function () {
	let check = [];
	let checkName = []
	$('INPUT[type="checkbox"]').change(function () {
		if ($(this).is(":checked")) {
			check.push($(this).attr("data-id"));
            checkName.push($(this).attr("data-name"))
		}
		else {
			let index = check.indexOf($(this).attr("data-id"));
			check.splice(index, 1);
			index = checkName.indexOf($(this).attr("data-name"));
			checkName.splice(index, 1);
		}
		$('DIV.amenities H4').text(checkName.join(", "))
		});
});
